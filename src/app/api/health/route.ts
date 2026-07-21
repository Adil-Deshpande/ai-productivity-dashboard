import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/apiHandler';
import { db } from '@/lib/db';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API Health Check
 *     description: Returns the health status of the API and Database
 *     responses:
 *       200:
 *         description: OK
 */
const healthCheck = async () => {
  // Check DB connection
  await db.$queryRaw`SELECT 1`;
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
};

export const GET = apiHandler(healthCheck);
