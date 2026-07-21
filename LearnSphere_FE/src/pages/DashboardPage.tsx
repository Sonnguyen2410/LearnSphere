import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SphereAIButton } from '../components/SphereAIButton';
import { RoleSidebar } from '../components/RoleSidebar';
import { getRoleLabel, getRoleNav, type NavItem } from '../lib/roleAccess';
import { api, getStoredUser, type Enrollment } from '../services/api';

const avatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAK3DeXFfcU7eoLcYm0J-P0geFc_1SNB3sOpbZdSgXNGYGNkWLvpydHgoO3teNd6SCKCfYzJzNrs1AB7P8Pu74X-3istluRsHM1oPvbEs2nLPM2cHWOxHmwakxXKAZY99rZGG-p9kypULkAvH9bkTxwS1EgNluYqYhNlGpql2gZkqIWaOYk5FWOQvYjhFI2VJivahYgEOwamgFB5MZtSI9a-fovv-ztHAlZ1TjPwNnEgpB773mBUptA6A';

function getRoleActions(role?: string): NavItem[] {
  if (role === 'admin') {
    return [
      { href: '/admin-users', icon: 'group', label: 'Duyệt hoặc khóa tutor' },
      { href: '/courses', icon: 'school', label: 'Quản trị toàn bộ khóa học' },
      { href: '/lesson-management', icon: 'auto_stories', label: 'Quản lý mọi bài học' },
      { href: '/question-builder', icon: 'quiz', label: 'Quản lý quiz và câu hỏi' },
      { href: '/system-monitoring', icon: 'monitoring', label: 'Giám sát hệ thống' },
    ];
  }

  if (role === 'tutor') {
    return [
      { href: '/courses', icon: 'add_circle', label: 'Tạo và cập nhật khóa học' },
      { href: '/lesson-management', icon: 'auto_stories', label: 'Quản lý bài học của tôi' },
      { href: '/question-builder', icon: 'quiz', label: 'Tạo quiz và câu hỏi' },
      { href: '/courses', icon: 'how_to_reg', label: 'Duyệt enrollment của khóa học' },
    ];
  }

  return [
    { href: '/courses', icon: 'school', label: 'Xem và đăng ký khóa học' },
    { href: '/dashboard', icon: 'menu_book', label: 'Theo dõi khóa học của tôi' },
    { href: '/quiz', icon: 'quiz', label: 'Làm quiz khi đã active' },
    { href: '/ai-assistant', icon: 'smart_toy', label: 'Chat với trợ lý AI' },
  ];
}

export function DashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [message, setMessage] = useState('');
  const user = getStoredUser();
  const navItems = useMemo(() => getRoleNav(user), [user]);
  const roleActions = useMemo(() => getRoleActions(user?.role), [user?.role]);

  useEffect(() => {
    if (user?.role !== 'student') return;

    setIsLoadingCourses(true);
    api.getMyCourses()
      .then(setEnrollments)
      .catch((err) => {
        setEnrollments([]);
        setMessage(err instanceof Error ? err.message : 'Không thể tải khóa học đã đăng ký');
      })
      .finally(() => setIsLoadingCourses(false));
  }, [user?.role]);

  const myCourses = useMemo(
    () =>
      enrollments
        .filter((enrollment) => typeof enrollment.course_id !== 'string')
        .map((enrollment) => {
          const course = enrollment.course_id as Exclude<Enrollment['course_id'], string>;
          return {
            id: course._id,
            title: course.title,
            description: course.description || 'Chưa có mô tả.',
            author: typeof course.created_by === 'object' ? course.created_by.full_name : 'Chưa rõ',
            status: enrollment.status,
          };
        }),
    [enrollments],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0d131f] text-[#dde2f4]">
      <AppHeader user={user} roleLabel={getRoleLabel(user?.role)} avatarSrc={avatarSrc} />

      <RoleSidebar activePath="/dashboard" items={navItems} user={user} />

      <main className="min-h-screen pb-24 md:pl-64">
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
          <section>
            <p className="mb-2 font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">{getRoleLabel(user?.role)}</p>
            <h1 className="text-[32px] font-semibold text-[#dde2f4]">
              Chào mừng trở lại, {user?.full_name ?? 'bạn'}.
            </h1>
          </section>

          {message && <div className="rounded-lg border border-[#ffc080]/30 bg-[#ffc080]/10 px-4 py-3 text-[14px] text-[#ffc080]">{message}</div>}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roleActions.map((action) => (
              <a key={action.label} className="rounded-xl border border-white/5 bg-[#161c28] p-5 transition-colors hover:border-[#adc7ff]/50" href={action.href}>
                <span className="material-symbols-outlined mb-4 text-[32px] text-[#adc7ff]">{action.icon}</span>
                <h2 className="text-[18px] font-semibold text-[#dde2f4]">{action.label}</h2>
              </a>
            ))}
          </section>

          {user?.role === 'student' && (
            <section className="space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="text-[24px] font-semibold text-[#adc7ff]">Khóa học của tôi</h2>
                <a className="text-[14px] text-[#24dfba] hover:underline" href="/courses">
                  Xem tất cả khóa học
                </a>
              </div>
              {isLoadingCourses && <p className="font-mono text-[12px] text-[#8b90a0]">Đang tải khóa học đã đăng ký...</p>}
              {!isLoadingCourses && !myCourses.length && (
                <div className="rounded-xl border border-dashed border-[#414754] bg-[#161c28] p-8 text-center text-[#c1c6d7]">
                  Chưa có khóa học đăng ký nào.
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myCourses.map((course) => (
                  <a key={course.id} className="rounded-xl border border-[#414754] bg-[#161c28] p-5 transition-colors hover:border-[#adc7ff]/50" href={`/lesson-detail?course_id=${encodeURIComponent(course.id)}`}>
                    <h3 className="mb-2 text-[22px] font-semibold text-[#dde2f4]">{course.title}</h3>
                    <p className="mb-4 line-clamp-2 text-[14px] leading-6 text-[#c1c6d7]">{course.description}</p>
                    <div className="flex items-center justify-between gap-3 font-mono text-[12px]">
                      <span className="text-[#8b90a0]">Người tạo: {course.author}</span>
                      <span className={course.status === 'active' ? 'text-[#24dfba]' : 'text-[#ffc080]'}>
                        {course.status === 'active' ? 'Đang học' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <SphereAIButton />
    </div>
  );
}
