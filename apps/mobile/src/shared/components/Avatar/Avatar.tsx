interface Props { src: string | null; name: string; size?: number }
export function Avatar({ src, name, size = 40 }: Props) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%' }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#333' }}>
      {initials}
    </div>
  );
}
