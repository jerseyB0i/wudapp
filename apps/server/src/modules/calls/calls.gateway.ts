/**
 * WebRTC signaling gateway — server never touches media.
 * Routes offer/answer/ICE between peers in a call.
 */
import type { TypedIO } from '../../infrastructure/socket.server.js';
import { callsService } from './calls.service.js';

export function registerCallsGateway(io: TypedIO): void {
  io.on('connection', (socket) => {
    const { userId } = socket.data;

    socket.on('call:initiate', async ({ conversationId, type }) => {
      const call = await callsService.initiateCall(conversationId, userId, type);
      socket.join(`call:${call.id}`);
      socket.to(conversationId).emit('call:incoming', call as any);
    });

    socket.on('call:accept', async ({ callId }) => {
      await callsService.updateStatus(callId, 'active');
      await callsService.addParticipant(callId, userId);
      socket.join(`call:${callId}`);
      io.to(`call:${callId}`).emit('call:accepted', { callId, userId });
    });

    socket.on('call:decline', async ({ callId }) => {
      await callsService.updateStatus(callId, 'declined');
      io.to(`call:${callId}`).emit('call:declined', { callId, userId });
    });

    socket.on('call:end', async ({ callId }) => {
      await callsService.updateStatus(callId, 'ended');
      await callsService.removeParticipant(callId, userId);
      io.to(`call:${callId}`).emit('call:ended', { callId });
      socket.leave(`call:${callId}`);
    });

    // ── WebRTC signaling relay ─────────────────────────────────────────────
    socket.on('webrtc:offer', ({ callId, toUserId, sdp }) => {
      socket.to(`call:${callId}`).emit('webrtc:offer', { callId, fromUserId: userId, sdp });
    });

    socket.on('webrtc:answer', ({ callId, toUserId, sdp }) => {
      socket.to(`call:${callId}`).emit('webrtc:answer', { callId, fromUserId: userId, sdp });
    });

    socket.on('webrtc:ice-candidate', ({ callId, toUserId, candidate }) => {
      socket.to(`call:${callId}`).emit('webrtc:ice-candidate', { callId, fromUserId: userId, candidate });
    });
  });
}
