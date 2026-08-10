import { useState } from 'react';

export interface CallControls {
  audioMuted:  boolean;
  videoMuted:  boolean;
  speakerOn:   boolean;
}

export function useCallState() {
  const [controls, setControls] = useState<CallControls>({
    audioMuted: false,
    videoMuted: false,
    speakerOn:  false,
  });

  const toggleAudio  = () => setControls((s) => ({ ...s, audioMuted: !s.audioMuted }));
  const toggleVideo  = () => setControls((s) => ({ ...s, videoMuted: !s.videoMuted }));
  const toggleSpeaker = () => setControls((s) => ({ ...s, speakerOn: !s.speakerOn }));

  return { controls, toggleAudio, toggleVideo, toggleSpeaker };
}
