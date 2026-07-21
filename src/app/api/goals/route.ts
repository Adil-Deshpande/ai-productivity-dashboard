import { apiHandler } from '@/lib/apiHandler';
import { goalController } from '@/modules/goals/controller';

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     responses:
 *       200:
 *         description: List of goals
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
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
 *     responses:
 *       201:
 *         description: Goal created
 */
export const GET = apiHandler((req: Request) => goalController.getGoals(req));
export const POST = apiHandler((req: Request) => goalController.createGoal(req));
