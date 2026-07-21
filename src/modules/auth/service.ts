import bcrypt from 'bcryptjs';
import { authRepository } from './repository';
import { LoginInput, RegisterInput } from './schemas';
import { BadRequestError, UnauthorizedError } from '@/lib/errors';
import { signToken } from '@/lib/jwt';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await authRepository.createUser({ ...data, passwordHash });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({ userId: user.id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
