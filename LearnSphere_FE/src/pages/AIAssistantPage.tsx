import { useState, type FormEvent } from 'react';
import { AppHeader } from '../components/AppHeader';
import { RoleSidebar } from '../components/RoleSidebar';
import { canStudy, getRoleLabel } from '../lib/roleAccess';
import { getStoredUser } from '../services/api';

const avatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD3CAHLhxx8msEYYRpTMyyPTzFwpCWL5PbXXUGXiPfT3Bzzn0F2yP_WVSD3QV6axYjYiZFkCxTihFF6TuGD8rl4G8VTjcjoUy_mFiE-e6KQNkyRh5b5U8QjwZM0MXS43z0NxYLY9_pG5I8OQZtEQ2YIcdH2dxUijazGLgEuoivh59ouVsurBcIsf_PB29Vg4sbF054jvWCTxN3vjxQsOtKDg5CD2l_T6Y3PIbDPRt8CAnVJB_2ZUsIUaQ';

export function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const user = getStoredUser();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setSentMessages((current) => [...current, trimmed]);
    setMessage('');
  }

  if (!canStudy(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d131f] px-4 text-[#dde2f4]">
        <section className="max-w-md rounded-xl border border-[#414754] bg-[#161c28] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-[#ffb4ab]">lock</span>
          <h1 className="text-[26px] font-semibold">Không có quyền truy cập</h1>
          <p className="mt-2 text-[#c1c6d7]">Trợ lý AI học tập chỉ dành cho học viên.</p>
          <a className="mt-6 inline-flex rounded-lg bg-[#adc7ff] px-5 py-3 font-bold text-[#002e68]" href="/dashboard">
            Về bảng điều khiển
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0d131f] text-[#dde2f4]">
      <AppHeader user={user} roleLabel={getRoleLabel(user?.role)} avatarSrc={avatarSrc} />

      <RoleSidebar activePath="/ai-assistant" user={user} />

      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#0d131f] md:pl-64">
        <div className="z-10 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
          {!sentMessages.length && (
            <div className="flex h-full items-center justify-center">
              <section className="max-w-xl rounded-xl border border-dashed border-[#414754] bg-[#161c28] p-10 text-center">
                <span className="material-symbols-outlined mb-4 text-[56px] text-[#8b90a0]">smart_toy</span>
                <h2 className="text-[28px] font-semibold text-[#dde2f4]">Chưa có hội thoại AI</h2>
              </section>
            </div>
          )}

          {sentMessages.map((item, index) => (
            <div key={`${item}-${index}`} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-none border border-[#414754] bg-[#2f3542] p-4">
                <p className="text-[#dde2f4]">{item}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="z-20 bg-gradient-to-t from-[#0d131f] via-[#0d131f] to-transparent p-4 md:px-6 md:pb-6">
          <form className="group relative" onSubmit={handleSubmit}>
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#adc7ff] to-[#24dfba] opacity-20 blur transition duration-300 group-focus-within:opacity-40" />
            <div className="relative flex items-center rounded-2xl border border-[#414754] bg-[#242a37] p-2">
              <input
                className="flex-1 border-none bg-transparent px-4 text-[#dde2f4] placeholder:text-[#8b90a0] focus:ring-0"
                placeholder="Nhập câu hỏi..."
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc7ff] text-[#00285b] transition-transform active:scale-90 hover:shadow-lg" type="submit" aria-label="Gửi">
                <span className="material-symbols-outlined font-bold">send</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
