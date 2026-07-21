import { db } from '@/lib/db';
import { RegisterInput } from './schemas';
import { User } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  }

  async createUser(data: RegisterInput & { passwordHash: string }): Promise<User> {
    return db.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        name: data.name,
      },
    });
  }
}

export const authRepository = new AuthRepository();
