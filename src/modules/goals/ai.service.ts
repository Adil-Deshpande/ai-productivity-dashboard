import { z } from 'zod';
import { db } from '@/lib/db';
import { generateStructuredData } from '@/lib/ai';

const aiGoalSchema = z.object({
  goal: z.object({
    title: z.string().describe('A concise, action-oriented title for the goal'),
    description: z.string().describe('A brief explanation of the goal and its importance'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('The recommended priority level'),
    targetDate: z.string().datetime().nullable().describe('An estimated target date in ISO-8601 format, or null if N/A'),
  }),
  tasks: z.array(z.object({
    title: z.string().describe('A concise, actionable task title'),
    description: z.string().describe('A brief explanation of what the task involves'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Priority level of the task'),
    targetDate: z.string().datetime().nullable().describe('Estimated target date for this task in ISO-8601 format, or null if N/A'),
  })).describe('A chronologically logical list of tasks required to complete the goal'),
});

export class AIGoalService {
  async generateAndSaveGoal(prompt: string, userId: string) {
    // 1. Generate the structured data using our AI helper
    const aiResponse = await generateStructuredData(
      prompt,
      aiGoalSchema,
      'You are an expert productivity coach. Break down the user\'s prompt into a structured goal and a logical sequence of actionable tasks.'
    );

    // 2. Save to the database atomically using a Prisma transaction
    const savedGoal = await db.goal.create({
      data: {
        userId,
        title: aiResponse.goal.title,
        description: aiResponse.goal.description,
        priority: aiResponse.goal.priority,
        targetDate: aiResponse.goal.targetDate,
        aiGenerated: true,
        status: 'PENDING',
        tasks: {
          create: aiResponse.tasks.map((task, index) => ({
            title: task.title,
            description: task.description,
            priority: task.priority,
            targetDate: task.targetDate,
            aiGenerated: true,
            status: 'PENDING',
            order: index, // Preserve the AI's logical ordering
          })),
        },
      },
      include: {
        tasks: true, // Return tasks along with the goal
      },
    });

    return savedGoal;
  }
}

export const aiGoalService = new AIGoalService();
