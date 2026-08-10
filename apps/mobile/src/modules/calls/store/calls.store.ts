import { create } from 'zustand';
import type { Call } from '@wudapp/types';

interface CallsState {
  activeCall:   Call | null;
  incomingCall: Call | null;
  setActive:   (call: Call | null) => void;
  setIncoming: (call: Call | null) => void;
}

export const useCallsStore = create<CallsState>((set) => ({
  activeCall:   null,
  incomingCall: null,
  setActive:   (call) => set({ activeCall: call }),
  setIncoming: (call) => set({ incomingCall: call }),
}));
