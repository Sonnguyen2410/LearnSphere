import { useEffect, useState } from 'react';
import { UserAvatarMenu } from './UserAvatarMenu';
import { api, type User } from '../services/api';

type AppHeaderProps = {
  avatarSrc: string;
  roleLabel: string;
  user?: User | null;
};

export function AppHeader({ avatarSrc, roleLabel, user }: AppHeaderProps) {
  const [resolvedAvatarSrc, setResolvedAvatarSrc] = useState(user?.avatar_key ? avatarSrc : '');

  useEffect(() => {
    let isActive = true;
    setResolvedAvatarSrc(user?.avatar_key ? avatarSrc : '');

    if (!user?.avatar_key) return () => { isActive = false; };

    api.getProfileAvatar()
      .then((result) => {
        if (isActive) setResolvedAvatarSrc(result.download_url);
      })
      .catch(() => {
        if (isActive) setResolvedAvatarSrc(avatarSrc);
      });

    return () => {
      isActive = false;
    };
  }, [avatarSrc, user?.avatar_key]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0d131f]/92 shadow-sm backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <a className="text-[24px] font-bold text-[#adc7ff]" href="/dashboard">
              LearnSphere
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="icon-button" type="button" aria-label="Tìm kiếm">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="icon-button relative" type="button" aria-label="Thông báo">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ffc080]" />
            </button>
            <UserAvatarMenu name={user?.full_name ?? 'LearnSphere User'} role={roleLabel} avatarSrc={resolvedAvatarSrc} />
          </div>
        </div>
      </header>
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
