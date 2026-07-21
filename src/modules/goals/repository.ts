import { db } from '@/lib/db';
import { CreateGoalInput, UpdateGoalInput } from './schemas';
import { Goal } from '@prisma/client';

export class GoalRepository {
  async findAllByUserId(userId: string): Promise<Goal[]> {
    return db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tasks: true }
    });
  }

  async findById(id: string, userId: string): Promise<Goal | null> {
    return db.goal.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateGoalInput): Promise<Goal> {
    return db.goal.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateGoalInput): Promise<Goal> {
    // Ownership is verified by the service calling findById first.
    return db.goal.update({
      where: { id },
      data,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(id: string, userId: string): Promise<Goal> {
    // Ownership is verified by the service calling findById first.
    return db.goal.delete({
      where: { id },
    });
  }
}

export const goalRepository = new GoalRepository();
