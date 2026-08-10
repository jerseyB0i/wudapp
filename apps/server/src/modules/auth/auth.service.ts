import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users, sessions } from '../../db/schema/index.js';
import { generateId } from '../../shared/utils/id.js';
import { hashPin, verifyPin } from '../../shared/utils/hash.js';
import type { RegisterBody, LoginBody, AuthResponse } from '@wudapp/types';

export class AuthService {
  async register(body: RegisterBody): Promise<AuthResponse> {
    const existing = await db.query.users.findFirst({
      where: eq(users.username, body.username),
    });
    if (existing) throw Object.assign(new Error('Username taken'), { statusCode: 409 });

    const id = generateId();
    const pinHash = hashPin(body.pin);

    await db.insert(users).values({
      id,
      username:    body.username,
      displayName: body.displayName,
      pinHash,
    });

    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    return { user: user as any, token: '' }; // token injected by router
  }

  async login(body: LoginBody): Promise<{ pinHash: string; userId: string }> {
    const user = await db.query.users.findFirst({
      where: eq(users.username, body.username),
    });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    if (!verifyPin(body.pin, user.pinHash)) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }
    return { pinHash: user.pinHash, userId: user.id };
  }
}

export const authService = new AuthService();
