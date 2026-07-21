import { goalRepository } from './repository';
import { CreateGoalInput, UpdateGoalInput } from './schemas';
import { NotFoundError } from '@/lib/errors';

export class GoalService {
  async getGoals(userId: string) {
    return goalRepository.findAllByUserId(userId);
  }

  async getGoal(id: string, userId: string) {
    const goal = await goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundError('Goal not found');
    }
    return goal;
  }

  async createGoal(userId: string, data: CreateGoalInput) {
    return goalRepository.create(userId, data);
  }

  async updateGoal(id: string, userId: string, data: UpdateGoalInput) {
    const goal = await goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundError('Goal not found');
    }
    return goalRepository.update(id, userId, data);
  }

  async deleteGoal(id: string, userId: string) {
    const goal = await goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundError('Goal not found');
    }
    return goalRepository.delete(id, userId);
  }
}

export const goalService = new GoalService();
