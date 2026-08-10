// TODO: waveform bars + play/pause + speed toggle + timestamp
interface Props {
	src: string;
	waveform: number[];
	durationMs: number;
}
export function VoiceNotePlayer({
	src: _src,
	waveform: _waveform,
	durationMs
}: Props) {
	return <div>VoiceNotePlayer — {Math.round(durationMs / 1000)}s</div>;
}
