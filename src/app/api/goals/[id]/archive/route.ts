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
    const { isArchived } = await request.json();

    const goal = await db.goal.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        isArchived,
      },
    });

    if (goal.count === 0) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Also update tasks archiving status
    await db.task.updateMany({
      where: { goalId: id },
      data: { isArchived }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Archive goal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
