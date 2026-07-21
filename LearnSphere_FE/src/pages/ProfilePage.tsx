import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AppHeader } from '../components/AppHeader';
import { RoleSidebar } from '../components/RoleSidebar';
import { SphereAIButton } from '../components/SphereAIButton';
import { api, clearSession, getStoredUser, saveSession, type User } from '../services/api';

const avatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAK3DeXFfcU7eoLcYm0J-P0geFc_1SNB3sOpbZdSgXNGYGNkWLvpydHgoO3teNd6SCKCfYzJzNrs1AB7P8Pu74X-3istluRsHM1oPvbEs2nLPM2cHWOxHmwakxXKAZY99rZGG-p9kypULkAvH9bkTxwS1EgNluYqYhNlGpql2gZkqIWaOYk5FWOQvYjhFI2VJivahYgEOwamgFB5MZtSI9a-fovv-ztHAlZ1TjPwNnEgpB773mBUptA6A';

function formatDate(value?: string) {
  if (!value) return 'Chưa cập nhật';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function getRoleLabel(role?: string) {
  if (role === 'admin') return 'Quản trị viên';
  if (role === 'tutor') return 'Giảng viên';
  return 'Học viên';
}

function getStatusLabel(status?: string) {
  if (status === 'pending') return 'Chờ duyệt';
  if (status === 'blocked') return 'Bị khóa';
  return 'Đang hoạt động';
}

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(getStoredUser()));

  useEffect(() => {
    if (!getStoredUser()) {
      setIsLoading(false);
      return;
    }

    api.me()
      .then((profile) => {
        setUser(profile);
        const token = localStorage.getItem('learnsphere_access_token');
        if (token) {
          saveSession({ access_token: token, token_type: 'bearer', user: profile });
        }
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const initials = useMemo(
    () =>
      (user?.full_name ?? 'LearnSphere User')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
    [user?.full_name],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Chưa thể lưu thay đổi hồ sơ lúc này.');
  }

  function handleLogout() {
    clearSession();
    window.location.assign('/login');
  }

  if (!user && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d131f] px-4 text-[#dde2f4]">
        <section className="w-full max-w-md rounded-xl border border-[#414754] bg-[#161c28] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-[#adc7ff]">lock</span>
          <h1 className="mb-2 text-[28px] font-semibold">Cần đăng nhập</h1>
          <p className="mb-6 text-[#c1c6d7]">Đăng nhập để xem và quản lý thông tin cá nhân của bạn.</p>
          <a className="inline-flex rounded-lg bg-[#adc7ff] px-6 py-3 font-bold text-[#002e68]" href="/login">
            Đăng nhập
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d131f] text-[#dde2f4]">
      <AppHeader user={user} roleLabel={getRoleLabel(user?.role)} avatarSrc={avatarSrc} />

      <RoleSidebar activePath="/profile" user={user} />

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:pl-72 md:pr-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <section className="overflow-hidden rounded-xl border border-white/5 bg-[#161c28]">
            <div className="h-28 bg-[linear-gradient(135deg,#adc7ff_0%,#24dfba_52%,#ffc080_100%)] opacity-90" />
            <div className="px-6 pb-6">
              <div className="relative z-10 -mt-24 mb-5 flex h-24 w-24 items-center justify-center rounded-xl border-4 border-[#161c28] bg-[#0d131f]/90 text-[28px] font-bold text-[#adc7ff] shadow-xl shadow-[#0d131f]/40">
                {initials}
              </div>
              <h1 className="text-[28px] font-semibold leading-9">{user?.full_name ?? 'Đang tải...'}</h1>
              <p className="mt-1 text-[#c1c6d7]">{user?.email}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#adc7ff]/20 bg-[#adc7ff]/10 px-3 py-1 font-mono text-[12px] text-[#adc7ff]">
                  {getRoleLabel(user?.role)}
                </span>
                <span className="rounded-full border border-[#24dfba]/20 bg-[#24dfba]/10 px-3 py-1 font-mono text-[12px] text-[#24dfba]">
                  {getStatusLabel(user?.account_status)}
                </span>
              </div>
              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#ffb4ab]/30 px-4 py-3 font-mono text-[14px] text-[#ffb4ab] transition-colors hover:bg-[#ffb4ab]/10"
                type="button"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </section>
        </aside>

        <section className="space-y-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: 'verified_user', label: 'Trạng thái', value: getStatusLabel(user?.account_status), tone: 'text-[#24dfba]' },
              { icon: 'badge', label: 'Vai trò', value: getRoleLabel(user?.role), tone: 'text-[#adc7ff]' },
              { icon: 'event', label: 'Ngày tham gia', value: formatDate(user?.created_at), tone: 'text-[#ffc080]' },
            ].map((item) => (
              <article key={item.label} className="rounded-xl border border-white/5 bg-[#161c28] p-5">
                <span className={`material-symbols-outlined mb-3 text-[28px] ${item.tone}`}>{item.icon}</span>
                <p className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">{item.label}</p>
                <p className="mt-1 text-[18px] font-semibold">{item.value}</p>
              </article>
            ))}
          </div>

          <section className="rounded-xl border border-white/5 bg-[#161c28] p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-[#dde2f4]">Thông tin cá nhân</h2>
              </div>
              {isLoading && <span className="font-mono text-[12px] text-[#8b90a0]">Đang đồng bộ...</span>}
            </div>

            {message && (
              <div className="mb-6 rounded-lg border border-[#ffc080]/30 bg-[#ffc080]/10 px-4 py-3 text-[14px] text-[#ffc080]">
                {message}
              </div>
            )}

            <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Họ và tên</span>
                <input
                  className="w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#dde2f4] outline-none transition-all focus:border-[#adc7ff] focus:ring-2 focus:ring-[#adc7ff]/30"
                  defaultValue={user?.full_name}
                  type="text"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Email</span>
                <input
                  className="w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#8b90a0] outline-none"
                  defaultValue={user?.email}
                  readOnly
                  type="email"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Vai trò</span>
                <input className="w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#8b90a0] outline-none" value={getRoleLabel(user?.role)} readOnly />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Cập nhật gần nhất</span>
                <input className="w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#8b90a0] outline-none" value={formatDate(user?.updated_at)} readOnly />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Giới thiệu ngắn</span>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#dde2f4] outline-none transition-all placeholder:text-[#8b90a0] focus:border-[#adc7ff] focus:ring-2 focus:ring-[#adc7ff]/30"
                  placeholder="Chia sẻ mục tiêu học tập, kỹ năng quan tâm hoặc vai trò của bạn trong LearnSphere..."
                />
              </label>
              <div className="flex justify-end md:col-span-2">
                <button className="rounded-lg bg-[#adc7ff] px-6 py-3 font-bold text-[#002e68] transition-all hover:brightness-110" type="submit">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </section>
        </section>
      </main>

      <SphereAIButton />
    </div>
  );
}
