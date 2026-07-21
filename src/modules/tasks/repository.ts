import { db } from '@/lib/db';
import { CreateTaskInput, UpdateTaskInput } from './schemas';
import { Task } from '@prisma/client';

export class TaskRepository {
  async findAllByGoalId(goalId: string, userId: string): Promise<Task[]> {
    return db.task.findMany({
      where: {
        goalId,
        goal: {
          userId,
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return db.task.findFirst({
      where: {
        id,
        goal: {
          userId,
        },
      },
    });
  }

  async create(goalId: string, userId: string, data: CreateTaskInput): Promise<Task> {
    return db.task.create({
      data: {
        ...data,
        goalId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateTaskInput): Promise<Task> {
    // Ownership verified in service via findById
    return db.task.update({
      where: { id },
      data,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(id: string, userId: string): Promise<Task> {
    // Ownership verified in service via findById
    return db.task.delete({
      where: { id },
    });
  }
}

export const taskRepository = new TaskRepository();
