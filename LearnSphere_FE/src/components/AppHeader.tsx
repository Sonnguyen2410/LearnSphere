import { UserAvatarMenu } from './UserAvatarMenu';
import type { User } from '../services/api';

type AppHeaderProps = {
  avatarSrc: string;
  roleLabel: string;
  user?: User | null;
};

export function AppHeader({ avatarSrc, roleLabel, user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#414754] bg-[#0d131f]/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <a className="text-[24px] font-bold text-[#adc7ff]" href="/dashboard">
          LearnSphere
        </a>
        <UserAvatarMenu name={user?.full_name ?? 'LearnSphere User'} role={roleLabel} avatarSrc={avatarSrc} />
      </div>
    </header>
  );
}
