import { getRoleNav, type NavItem } from '../lib/roleAccess';
import type { User } from '../services/api';

type RoleSidebarProps = {
  activePath?: string;
  items?: NavItem[];
  user?: User | null;
};

export function RoleSidebar({ activePath = window.location.pathname, items, user }: RoleSidebarProps) {
  const navItems = items ?? getRoleNav(user);

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 flex-col border-r border-[#414754] bg-[#161c28] py-6 md:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            className={`mx-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
              item.href === activePath ? 'bg-[#4a8eff] text-[#00285b]' : 'text-[#c1c6d7] hover:bg-[#2f3542] hover:text-[#dde2f4]'
            }`}
            href={item.href}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[14px] font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
