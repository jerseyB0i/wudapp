import type { FastifyInstance } from 'fastify';
import { callsService } from './calls.service.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';

export async function callsRouter(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authMiddleware);

  fastify.get('/calls/history', async (request) => {
    const { userId } = request.user as { userId: string };
    return callsService.getHistory(userId);
  });
}
