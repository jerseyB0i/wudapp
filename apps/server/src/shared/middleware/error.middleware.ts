import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  const statusCode = error.statusCode ?? 500;
  reply.code(statusCode).send({
    error: error.message ?? 'Internal Server Error',
    code:  error.code ?? 'INTERNAL_ERROR',
  });
}
