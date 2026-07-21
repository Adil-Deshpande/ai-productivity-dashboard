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

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await db.note.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Fetch notes error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    const note = await db.note.create({
      data: {
        title: title || 'Untitled Note',
        content: content || '',
        userId: userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
