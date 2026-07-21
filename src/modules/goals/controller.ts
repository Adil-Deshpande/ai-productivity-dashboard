import { NextResponse } from 'next/server';
import { goalService } from './service';
import { createGoalSchema, updateGoalSchema } from './schemas';
import { UnauthorizedError } from '@/lib/errors';

import { verifyToken } from '@/lib/jwt';

// Helper to get userId from headers (set by proxy.ts or fallback auth in future if needed)
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
      } catch {
        // ignore
      }
    }
  }
  if (!userId) {
    throw new UnauthorizedError();
  }
  return userId;
};

export class GoalController {
  async getGoals(req: Request) {
    const userId = getUserId(req);
    const goals = await goalService.getGoals(userId);
    return NextResponse.json(goals);
  }

  async getGoal(req: Request, params: { id: string }) {
    const userId = getUserId(req);
    const goal = await goalService.getGoal(params.id, userId);
    return NextResponse.json(goal);
  }

  async createGoal(req: Request) {
    const userId = getUserId(req);
    const body = await req.json();
    const data = createGoalSchema.parse(body);
    const goal = await goalService.createGoal(userId, data);
    return NextResponse.json(goal, { status: 201 });
  }

  async updateGoal(req: Request, params: { id: string }) {
    const userId = getUserId(req);
    const body = await req.json();
    const data = updateGoalSchema.parse(body);
    const goal = await goalService.updateGoal(params.id, userId, data);
    return NextResponse.json(goal);
  }

  async deleteGoal(req: Request, params: { id: string }) {
    const userId = getUserId(req);
    await goalService.deleteGoal(params.id, userId);
    return NextResponse.json({ success: true });
  }
}

export const goalController = new GoalController();
