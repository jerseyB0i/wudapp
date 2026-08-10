import { z } from 'zod';

export const registerSchema = z.object({
  username:    z.string().min(3).max(32).regex(/^[a-z0-9_]+$/),
  displayName: z.string().min(1).max(64),
  pin:         z.string().min(4).max(16),
});

export const loginSchema = z.object({
  username: z.string(),
  pin:      z.string(),
});
