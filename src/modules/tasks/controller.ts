import { NextResponse } from 'next/server';
import { taskService } from './service';
import { createTaskSchema, updateTaskSchema } from './schemas';
import { UnauthorizedError } from '@/lib/errors';
import { verifyToken } from '@/lib/jwt';

// Helper to get userId from headers
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

export class TaskController {
  async getTasks(req: Request, params: { goalId: string }) {
    const userId = getUserId(req);
    const tasks = await taskService.getTasks(params.goalId, userId);
    return NextResponse.json(tasks);
  }

  async createTask(req: Request, params: { goalId: string }) {
    const userId = getUserId(req);
    const body = await req.json();
    const data = createTaskSchema.parse(body);
    const task = await taskService.createTask(params.goalId, userId, data);
    return NextResponse.json(task, { status: 201 });
  }

  async updateTask(req: Request, params: { taskId: string }) {
    const userId = getUserId(req);
    const body = await req.json();
    const data = updateTaskSchema.parse(body);
    const task = await taskService.updateTask(params.taskId, userId, data);
    return NextResponse.json(task);
  }

  async deleteTask(req: Request, params: { taskId: string }) {
    const userId = getUserId(req);
    await taskService.deleteTask(params.taskId, userId);
    return NextResponse.json({ success: true });
  }
}

export const taskController = new TaskController();
