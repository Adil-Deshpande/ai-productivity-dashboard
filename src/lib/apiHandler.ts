import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from './errors';
import { logger } from './logger';

export const apiHandler = (handler: (...args: never[]) => Promise<Response> | Response) => {
  return async (req: Request, ...args: unknown[]): Promise<Response> => {
    try {
      return await handler(req as never, ...(args as never[]));
    } catch (err: unknown) {
      logger.error('API Error:', err);

      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: err.issues },
          { status: 400 }
        );
      }

      if (err instanceof AppError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
};
