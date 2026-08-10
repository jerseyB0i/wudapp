import { z } from 'zod';
export const initiateCallSchema = z.object({
  conversationId: z.string().uuid(),
  type:           z.enum(['voice', 'video']),
});
