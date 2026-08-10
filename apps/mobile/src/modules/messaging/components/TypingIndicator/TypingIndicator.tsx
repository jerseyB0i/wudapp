// TODO: animated 3-dot indicator, shows names of typing users
export function TypingIndicator({ names }: { names: string[] }) {
  if (!names.length) return null;
  return <div>{names.join(', ')} is typing…</div>;
}
