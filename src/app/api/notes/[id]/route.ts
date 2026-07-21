import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

const getUserId = (req: Request) => {
  let userId = req.headers.get('x-user-id');
  if (!userId) {
    const cookieHeader = req.headers.get('cookie');
    const match = cookieHeader?.match(/(?:^|;\s*)token=([^;]*)/);
    const token = match ? match[1] : null;
    if (token) {
      try {
        const decoded = verifyToken(token) as { userId: string };
        userId = decoded.userId;
      } catch {}
    }
  }
  return userId;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const note = await db.note.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    if (note.count === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const note = await db.note.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (note.count === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
