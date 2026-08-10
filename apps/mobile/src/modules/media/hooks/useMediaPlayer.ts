import { useRef, useState } from 'react';

export function useMediaPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const play = () => {
    if (!audioRef.current) audioRef.current = new Audio(src);
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play();
    setIsPlaying(true);

    audioRef.current.ontimeupdate = () => setCurrentTime(audioRef.current!.currentTime);
    audioRef.current.onloadedmetadata = () => setDuration(audioRef.current!.duration);
    audioRef.current.onended = () => setIsPlaying(false);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return { isPlaying, currentTime, duration, playbackRate, play, pause, seek, cycleSpeed };
}
