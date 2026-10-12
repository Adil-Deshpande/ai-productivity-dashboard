import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from './errors';
import { logger } from './logger';
import { httpRequestsTotal, httpRequestDuration } from './metrics';

export const apiHandler = (
  handler: (...args: never[]) => Promise<Response> | Response
) => {
  return async (req: Request, ...args: unknown[]): Promise<Response> => {
    const method = req.method || 'UNKNOWN';
    const startedAt = process.hrtime.bigint();

    let response: Response;

    try {
      response = await handler(req as never, ...(args as never[]));
    } catch (err: unknown) {
      logger.error('API Error:', err);

      if (err instanceof z.ZodError) {
        response = NextResponse.json(
          { error: 'Validation Error', details: err.issues },
          { status: 400 }
        );
      } else if (err instanceof AppError) {
        response = NextResponse.json(
          { error: err.message },
          { status: err.statusCode }
        );
      } else {
        response = NextResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
      }
    }

    const statusCode = String(response.status);
    const durationSeconds =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;

    httpRequestsTotal.inc({
      method,
      status_code: statusCode,
    });

    httpRequestDuration.observe(
      {
        method,
        status_code: statusCode,
      },
      durationSeconds
    );

    return response;
  };
};