interface Props { src: string; alt?: string; onPress?: () => void }
export function ImagePreview({ src, alt, onPress }: Props) {
  return <img src={src} alt={alt ?? ''} onClick={onPress} style={{ maxWidth: '100%', borderRadius: 12 }} />;
}
