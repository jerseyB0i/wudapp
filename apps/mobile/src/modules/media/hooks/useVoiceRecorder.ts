import { useRef, useState } from 'react';

interface RecorderState {
  isRecording: boolean;
  durationMs:  number;
  audioBlob:   Blob | null;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    durationMs:  0,
    audioBlob:   null,
  });
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval>>();
  const startMsRef  = useRef<number>(0);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    recorderRef.current = recorder;
    chunksRef.current   = [];
    startMsRef.current  = Date.now();

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setState((s) => ({ ...s, audioBlob: blob, isRecording: false }));
      stream.getTracks().forEach((t) => t.stop());
    };

    recorder.start(100);
    timerRef.current = setInterval(() => {
      setState((s) => ({ ...s, durationMs: Date.now() - startMsRef.current }));
    }, 100);
    setState((s) => ({ ...s, isRecording: true, audioBlob: null }));
  };

  const stop = () => {
    clearInterval(timerRef.current);
    recorderRef.current?.stop();
  };

  const cancel = () => {
    clearInterval(timerRef.current);
    recorderRef.current?.stop();
    chunksRef.current = [];
    setState({ isRecording: false, durationMs: 0, audioBlob: null });
  };

  return { ...state, start, stop, cancel };
}
