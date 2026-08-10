import type { Conversation } from '@wudapp/types';
interface Props { conversations: Conversation[]; onSelect: (id: string) => void }
export function ConversationList({ conversations, onSelect }: Props) {
  return (
    <ul>
      {conversations.map((c) => (
        <li key={c.id} onClick={() => onSelect(c.id)}>{c.name ?? c.id}</li>
      ))}
    </ul>
  );
}
