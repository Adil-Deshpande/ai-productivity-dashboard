import { apiHandler } from '@/lib/apiHandler';
import { taskController } from '@/modules/tasks/controller';

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a specific task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *   delete:
 *     summary: Delete a specific task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
export const PATCH = apiHandler(async (req: Request, context: { params: Promise<{ taskId: string }> }) => {
  const resolvedParams = await context.params;
  return taskController.updateTask(req, resolvedParams);
});

export const DELETE = apiHandler(async (req: Request, context: { params: Promise<{ taskId: string }> }) => {
  const resolvedParams = await context.params;
  return taskController.deleteTask(req, resolvedParams);
});
