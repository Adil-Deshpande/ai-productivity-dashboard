import { apiHandler } from '@/lib/apiHandler';
import { authController } from '@/modules/auth/controller';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user object
 *       401:
 *         description: Unauthorized
 */
export const GET = apiHandler((req: Request) => authController.getMe(req));
