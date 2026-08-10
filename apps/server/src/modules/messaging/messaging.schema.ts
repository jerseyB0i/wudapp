import { z } from 'zod';

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content:        z.string().max(4096).optional(),
  type:           z.enum(['text', 'image', 'video', 'voice']),
  replyToId:      z.string().uuid().optional(),
});

export const editMessageSchema = z.object({
  content: z.string().min(1).max(4096),
});

export const createConversationSchema = z.object({
  type:      z.enum(['dm', 'group']),
  memberIds: z.array(z.string().uuid()).min(1).max(9),
  name:      z.string().max(128).optional(),
});
