import { NextResponse } from 'next/server';
import { authService } from './service';
import { registerSchema, loginSchema } from './schemas';
import { verifyToken } from '@/lib/jwt';

export class AuthController {
  async register(req: Request) {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const user = await authService.register(data);
    return NextResponse.json(user, { status: 201 });
  }

  async login(req: Request) {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const { user, token } = await authService.login(data);

    const response = NextResponse.json({ user });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  }

  async logout() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    return response;
  }

  async getMe(req: Request) {
    let userId = req.headers.get('x-user-id');
    
    if (!userId) {
      // Fallback: extract token from cookie if header is missing
      const cookieHeader = req.headers.get('cookie');
      const match = cookieHeader?.match(/(?:^|;\s*)token=([^;]*)/);
      const token = match ? match[1] : null;
      
      if (token) {
        try {
          const decoded = verifyToken(token) as { userId: string };
          userId = decoded.userId;
        } catch {
          // Ignore error and fall through to Unauthorized
        }
      }
    }
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const user = await authService.getMe(userId);
    return NextResponse.json(user);
  }
}

export const authController = new AuthController();
