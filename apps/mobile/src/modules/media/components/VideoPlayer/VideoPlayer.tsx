interface Props { src: string; poster?: string }
export function VideoPlayer({ src, poster }: Props) {
  return <video src={src} poster={poster} controls style={{ width: '100%' }} />;
}
