import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export const signToken = (payload: string | object | Buffer, expiresIn: string | number = '1d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
