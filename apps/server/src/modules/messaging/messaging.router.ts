import type { FastifyInstance } from 'fastify';
import { messagingService } from './messaging.service.js';
import { sendMessageSchema, editMessageSchema, createConversationSchema } from './messaging.schema.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import type { TypedIO } from '../../infrastructure/socket.server.js';

export async function messagingRouter(fastify: FastifyInstance, { io }: { io: TypedIO }): Promise<void> {
  fastify.addHook('preHandler', authMiddleware);

  // ── Conversations ────────────────────────────────────────────────────────
  fastify.get('/conversations', async (request) => {
    const { userId } = request.user as { userId: string };
    return messagingService.getUserConversations(userId);
  });

  fastify.post('/conversations', async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const body = createConversationSchema.parse(request.body);
    const conv = await messagingService.createConversation(userId, body.type, body.memberIds, body.name);
    return reply.code(201).send(conv);
  });

  // ── Messages ─────────────────────────────────────────────────────────────
  fastify.get<{ Params: { conversationId: string }; Querystring: { cursor?: string } }>(
    '/conversations/:conversationId/messages',
    async (request) => {
      const { conversationId } = request.params;
      const { cursor } = request.query;
      return messagingService.getMessages(conversationId, cursor);
    },
  );

  fastify.post('/messages', async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const body = sendMessageSchema.parse(request.body);
    const message = await messagingService.sendMessage(
      userId,
      body.conversationId,
      body.content,
      body.type as any,
      body.replyToId,
    );
    io.to(body.conversationId).emit('message:new', message as any);
    return reply.code(201).send({ message });
  });

  fastify.patch<{ Params: { messageId: string } }>('/messages/:messageId', async (request) => {
    const { userId } = request.user as { userId: string };
    const { messageId } = request.params;
    const body = editMessageSchema.parse(request.body);
    await messagingService.editMessage(messageId, userId, body.content);
    const message = await messagingService.getMessage(messageId);
    io.to(message!.conversationId).emit('message:edited', {
      messageId,
      content: body.content,
      editedAt: message!.editedAt!,
    });
    return { message };
  });

  fastify.delete<{ Params: { messageId: string } }>('/messages/:messageId', async (request) => {
    const { userId } = request.user as { userId: string };
    const { messageId } = request.params;
    const message = await messagingService.getMessage(messageId);
    await messagingService.deleteMessage(messageId, userId);
    if (message) {
      io.to(message.conversationId).emit('message:deleted', {
        messageId,
        conversationId: message.conversationId,
      });
    }
    return { ok: true };
  });
}
