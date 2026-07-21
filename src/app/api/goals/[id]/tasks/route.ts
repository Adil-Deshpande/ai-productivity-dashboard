import { apiHandler } from '@/lib/apiHandler';
import { taskController } from '@/modules/tasks/controller';

/**
 * @swagger
 * /api/goals/{id}/tasks:
 *   get:
 *     summary: Get all tasks for a specific goal
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *   post:
 *     summary: Create a new task for a goal
 *     tags: [Tasks]
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
 *             required:
 *               - title
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
 *       201:
 *         description: Task created
 */
export const GET = apiHandler(async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return taskController.getTasks(req, { goalId: id });
});

export const POST = apiHandler(async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return taskController.createTask(req, { goalId: id });
});
