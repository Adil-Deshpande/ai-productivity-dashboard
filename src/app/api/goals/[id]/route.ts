import { apiHandler } from '@/lib/apiHandler';
import { goalController } from '@/modules/goals/controller';

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get a specific goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal details
 *       404:
 *         description: Goal not found
 *   patch:
 *     summary: Update a specific goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Goal updated
 *       404:
 *         description: Goal not found
 *   delete:
 *     summary: Delete a specific goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted
 *       404:
 *         description: Goal not found
 */
export const GET = apiHandler(async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await context.params;
  return goalController.getGoal(req, resolvedParams);
});

export const PATCH = apiHandler(async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await context.params;
  return goalController.updateGoal(req, resolvedParams);
});

export const DELETE = apiHandler(async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await context.params;
  return goalController.deleteGoal(req, resolvedParams);
});
