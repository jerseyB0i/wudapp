// TODO: bubble — outgoing right/incoming left, tail, read tick, reply thread indent
import type { Message } from '@wudapp/types';
interface Props {
	message: Message;
	isOwn: boolean;
}
export function MessageBubble({ message, isOwn: _isOwn }: Props) {
	return <div>{message.content}</div>;
}
