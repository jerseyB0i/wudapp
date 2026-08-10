/**
 * WebRTC client — mesh topology.
 * Each peer maintains a direct connection to every other peer in the call.
 */
import type { TypedSocket } from './socket.client';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    // LAN-only: no STUN needed, but kept for future remote support
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export class WebRTCClient {
  private peers = new Map<string, RTCPeerConnection>();
  private localStream: MediaStream | null = null;
  private callId: string | null = null;

  constructor(private socket: TypedSocket) {
    this.registerSocketHandlers();
  }

  // ── Setup ────────────────────────────────────────────────────────────────
  async startLocalStream(video: boolean): Promise<MediaStream> {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video,
    });
    return this.localStream;
  }

  stopLocalStream(): void {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
  }

  // ── Peer management ──────────────────────────────────────────────────────
  async createOffer(peerId: string, callId: string): Promise<void> {
    this.callId = callId;
    const pc = this.createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket.emit('webrtc:offer', { callId, toUserId: peerId, sdp: offer });
  }

  async handleOffer(peerId: string, sdp: RTCSessionDescriptionInit, callId: string): Promise<void> {
    this.callId = callId;
    const pc = this.createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.socket.emit('webrtc:answer', { callId, toUserId: peerId, sdp: answer });
  }

  async handleAnswer(peerId: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peers.get(peerId);
    await pc?.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const pc = this.peers.get(peerId);
    await pc?.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────
  endCall(): void {
    this.peers.forEach((pc) => pc.close());
    this.peers.clear();
    this.stopLocalStream();
    this.callId = null;
  }

  // ── Private ──────────────────────────────────────────────────────────────
  private createPeerConnection(peerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peers.set(peerId, pc);

    this.localStream?.getTracks().forEach((t) => pc.addTrack(t, this.localStream!));

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && this.callId) {
        this.socket.emit('webrtc:ice-candidate', {
          callId: this.callId,
          toUserId: peerId,
          candidate: candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      // Dispatch custom event so React components can subscribe
      window.dispatchEvent(new CustomEvent('webrtc:remote-stream', { detail: { peerId, stream } }));
    };

    return pc;
  }

  private registerSocketHandlers(): void {
    this.socket.on('webrtc:offer', ({ callId, fromUserId, sdp }) => {
      this.handleOffer(fromUserId, sdp, callId);
    });
    this.socket.on('webrtc:answer', ({ fromUserId, sdp }) => {
      this.handleAnswer(fromUserId, sdp);
    });
    this.socket.on('webrtc:ice-candidate', ({ fromUserId, candidate }) => {
      this.handleIceCandidate(fromUserId, candidate);
    });
  }
}
