import { apiHandler } from '@/lib/apiHandler';
import { authController } from '@/modules/auth/controller';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful (clears HTTP-only cookie)
 */
export const POST = apiHandler(() => authController.logout());
