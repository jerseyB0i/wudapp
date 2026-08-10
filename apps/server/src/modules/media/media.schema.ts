import { z } from 'zod';

export const uploadMetaSchema = z.object({
  conversationId: z.string().uuid(),
  replyToId:      z.string().uuid().optional(),
  durationMs:     z.coerce.number().optional(),
});
