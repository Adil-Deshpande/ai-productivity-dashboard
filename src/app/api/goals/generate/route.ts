import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/apiHandler';
import { aiGoalService } from '@/modules/goals/ai.service';
import { verifyToken } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/errors';
import { z } from 'zod';

const generateRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt is too short').max(1000, 'Prompt is too long'),
});

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

/**
 * @swagger
 * /api/goals/generate:
 *   post:
 *     summary: Generate a goal and associated tasks from a text prompt
 *     tags: [AI, Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Goal created with nested tasks
 */
export const POST = apiHandler(async (req: Request) => {
  const userId = getUserId(req);
  const body = await req.json();
  const { prompt } = generateRequestSchema.parse(body);

  const goal = await aiGoalService.generateAndSaveGoal(prompt, userId);
  return NextResponse.json(goal, { status: 201 });
});
