import { z } from 'zod';

const schema = z.object({
  PORT:              z.coerce.number().default(3001),
  HOST:              z.string().default('0.0.0.0'),
  JWT_SECRET:        z.string().min(32),
  DATABASE_PATH:     z.string().default('./wudapp.db'),
  UPLOADS_DIR:       z.string().default('./uploads'),
  MAX_IMAGE_BYTES:   z.coerce.number().default(10_485_760),  // 10MB
  MAX_VIDEO_BYTES:   z.coerce.number().default(104_857_600), // 100MB
  MAX_VOICE_BYTES:   z.coerce.number().default(26_214_400),  // 25MB
});

export const config = schema.parse(process.env);
export type Config = typeof config;
