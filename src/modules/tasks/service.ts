import { taskRepository } from './repository';
import { CreateTaskInput, UpdateTaskInput } from './schemas';
import { NotFoundError } from '@/lib/errors';
import { goalService } from '@/modules/goals/service';

export class TaskService {
  async getTasks(goalId: string, userId: string) {
    // Verify goal ownership
    await goalService.getGoal(goalId, userId);
    return taskRepository.findAllByGoalId(goalId, userId);
  }

  async createTask(goalId: string, userId: string, data: CreateTaskInput) {
    // Verify goal ownership before creating a task
    await goalService.getGoal(goalId, userId);
    return taskRepository.create(goalId, userId, data);
  }

  async updateTask(id: string, userId: string, data: UpdateTaskInput) {
    const task = await taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    const updatedTask = await taskRepository.update(id, userId, data);

    // After updating a task, check the overall goal status
    const allTasks = await taskRepository.findAllByGoalId(task.goalId, userId);
    if (allTasks.length > 0) {
      const allCompleted = allTasks.every((t) => t.status === 'COMPLETED');
      const hasInProgress = allTasks.some((t) => t.status === 'IN_PROGRESS' || t.status === 'COMPLETED');
      
      let newGoalStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'PENDING';
      if (allCompleted) newGoalStatus = 'COMPLETED';
      else if (hasInProgress) newGoalStatus = 'IN_PROGRESS';

      await goalService.updateGoal(task.goalId, userId, { status: newGoalStatus });
    }

    return updatedTask;
  }

  async deleteTask(id: string, userId: string) {
    const task = await taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return taskRepository.delete(id, userId);
  }
}

export const taskService = new TaskService();
