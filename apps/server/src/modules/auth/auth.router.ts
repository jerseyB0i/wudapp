import type { FastifyInstance } from 'fastify';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { generateId } from '../../shared/utils/id.js';

export async function authRouter(fastify: FastifyInstance): Promise<void> {
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const result = await authService.register(body);
    const token = fastify.jwt.sign({ userId: result.user.id, username: result.user.username });
    return reply.code(201).send({ user: result.user, token });
  });

  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const { userId } = await authService.login(body);
    const token = fastify.jwt.sign({ userId, username: body.username });
    return reply.send({ token });
  });
}
