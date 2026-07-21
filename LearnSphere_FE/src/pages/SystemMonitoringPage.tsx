import { AppHeader } from '../components/AppHeader';
import { RoleSidebar } from '../components/RoleSidebar';
import { SphereAIButton } from '../components/SphereAIButton';
import { canManageSystem, getRoleLabel, getRoleNav } from '../lib/roleAccess';
import { getStoredUser } from '../services/api';

const avatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJoFDj_0QC113oXEglqawaRx_p6aj65L4yuLN_52cJ7ZIsSBwJOLuDBdEOjZO4FGAYbIdjFRiTlh8P2s0viUatzxsXtdGT_HsugoXIhqhwVN_Dw3tV9dDK8jwLYtcCNANCSZMe4LpwBeZ_9u6z_nbGgFvzsUsVhmefvWWra3Gr3YxrVvyeFBabLR6ZaLPdihuammwZ1Kx-7DMoW1tlYifLN7bf0t5jAQwLgAkqx_v0jfzWhkcx2DbATA';

export function SystemMonitoringPage() {
  const user = getStoredUser();
  const navItems = getRoleNav(user);

  if (!canManageSystem(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d131f] px-4 text-[#dde2f4]">
        <section className="max-w-md rounded-xl border border-[#414754] bg-[#161c28] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-[#ffb4ab]">lock</span>
          <h1 className="text-[26px] font-semibold">Không có quyền truy cập</h1>
          <p className="mt-2 text-[#c1c6d7]">Chỉ admin được giám sát và quản trị hệ thống.</p>
          <a className="mt-6 inline-flex rounded-lg bg-[#adc7ff] px-5 py-3 font-bold text-[#002e68]" href="/dashboard">
            Về bảng điều khiển
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0d131f] text-[#dde2f4]">
      <AppHeader user={user} roleLabel={getRoleLabel(user?.role)} avatarSrc={avatarSrc} />

      <RoleSidebar activePath="/system-monitoring" items={navItems} user={user} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 md:pl-72 md:pr-8">
        <section className="w-full rounded-xl border border-dashed border-[#414754] bg-[#161c28]/80 p-10 text-center">
          <span className="material-symbols-outlined mb-4 text-[56px] text-[#8b90a0]">monitoring</span>
          <h1 className="text-[30px] font-semibold text-[#dde2f4]">Chưa có dữ liệu giám sát</h1>
        </section>
      </main>

      <SphereAIButton />
    </div>
  );
}
