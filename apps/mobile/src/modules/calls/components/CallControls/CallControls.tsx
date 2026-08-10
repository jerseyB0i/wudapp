interface Props {
	audioMuted: boolean;
	videoMuted: boolean;
	speakerOn: boolean;
	onToggleAudio: () => void;
	onToggleVideo: () => void;
	onToggleSpeaker: () => void;
	onEndCall: () => void;
}
export function CallControls(_props: Props) {
	return <div>CallControls</div>;
}
