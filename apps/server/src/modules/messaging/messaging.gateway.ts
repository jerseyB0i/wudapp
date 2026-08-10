/**
 * Socket.IO gateway for real-time messaging events.
 * Typing indicators, delivery/read receipts, presence.
 */
import type { TypedIO } from '../../infrastructure/socket.server.js';
import { messagingService } from './messaging.service.js';

const TYPING_TIMEOUT_MS = 5_000;
const typingTimers = new Map<string, NodeJS.Timeout>();

export function registerMessagingGateway(io: TypedIO): void {
  io.on('connection', (socket) => {
    const { userId, username } = socket.data;

    // ── Room management ──────────────────────────────────────────────────────
    socket.on('conversation:join', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(conversationId);
    });

    // ── Typing indicators ────────────────────────────────────────────────────
    socket.on('typing:start', ({ conversationId }) => {
      const key = `${conversationId}:${userId}`;
      clearTimeout(typingTimers.get(key));
      socket.to(conversationId).emit('typing:start', {
        conversationId,
        user: { id: userId, displayName: username },
      });
      typingTimers.set(
        key,
        setTimeout(() => {
          socket.to(conversationId).emit('typing:stop', { conversationId, userId });
          typingTimers.delete(key);
        }, TYPING_TIMEOUT_MS),
      );
    });

    socket.on('typing:stop', ({ conversationId }) => {
      const key = `${conversationId}:${userId}`;
      clearTimeout(typingTimers.get(key));
      typingTimers.delete(key);
      socket.to(conversationId).emit('typing:stop', { conversationId, userId });
    });

    // ── Delivery / read receipts ─────────────────────────────────────────────
    socket.on('message:delivered', async ({ messageId }) => {
      await messagingService.markDelivered(messageId, userId);
      const msg = await messagingService.getMessage(messageId);
      if (msg) {
        socket
          .to(msg.conversationId)
          .emit('message:delivered', { messageId, userId, deliveredAt: new Date().toISOString() });
      }
    });

    socket.on('message:read', async ({ messageId }) => {
      await messagingService.markRead(messageId, userId);
      const msg = await messagingService.getMessage(messageId);
      if (msg) {
        socket
          .to(msg.conversationId)
          .emit('message:read', { messageId, userId, readAt: new Date().toISOString() });
      }
    });

    // ── Presence ─────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      io.emit('presence:update', {
        userId,
        status: 'offline',
        lastSeen: new Date().toISOString(),
      });
    });
  });
}
