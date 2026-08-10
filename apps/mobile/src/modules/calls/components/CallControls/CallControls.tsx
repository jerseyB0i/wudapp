interface Props {
  audioMuted: boolean; videoMuted: boolean; speakerOn: boolean;
  onToggleAudio: () => void; onToggleVideo: () => void;
  onToggleSpeaker: () => void; onEndCall: () => void;
}
export function CallControls(props: Props) {
  return <div>CallControls</div>;
}
