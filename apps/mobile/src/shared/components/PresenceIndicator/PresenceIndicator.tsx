import type { UserStatus } from '@wudapp/types';
const COLOR: Record<UserStatus, string> = { online: '#3fc060', away: '#f4a636', offline: '#888' };
export function PresenceIndicator({ status }: { status: UserStatus }) {
  return <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLOR[status], display: 'inline-block' }} />;
}
