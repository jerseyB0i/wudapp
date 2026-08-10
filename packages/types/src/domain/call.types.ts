export type CallType = 'voice' | 'video';
export type CallStatus = 'ringing' | 'active' | 'ended' | 'missed' | 'declined';

export interface Call {
  id: string;
  conversationId: string;
  type: CallType;
  initiatedBy: string;
  status: CallStatus;
  startedAt: string | null;
  endedAt: string | null;
  // hydrated
  participants?: CallParticipant[];
}

export interface CallParticipant {
  callId: string;
  userId: string;
  joinedAt: string;
  leftAt: string | null;
  durationMs: number | null;
}
