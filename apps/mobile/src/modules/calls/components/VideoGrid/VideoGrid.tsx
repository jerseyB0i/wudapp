// TODO: adaptive grid — 1-up, 2-up, 4-up depending on participant count
export function VideoGrid({ streams }: { streams: Map<string, MediaStream> }) {
  return <div>VideoGrid — {streams.size} streams</div>;
}
