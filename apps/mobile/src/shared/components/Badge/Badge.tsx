export function Badge({ count }: { count: number }) {
  if (!count) return null;
  return <span style={{ background: '#0095f6', borderRadius: '50%', padding: '2px 6px', fontSize: 11 }}>{count > 99 ? '99+' : count}</span>;
}
