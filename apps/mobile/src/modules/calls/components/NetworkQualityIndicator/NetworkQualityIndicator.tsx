// TODO: 1–4 bar signal icon based on RTCStatsReport packet loss / jitter
export function NetworkQualityIndicator({ quality }: { quality: 1 | 2 | 3 | 4 }) {
  return <div>Signal: {quality}/4</div>;
}
