import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { RoleSidebar } from '../components/RoleSidebar';
import { SphereAIButton } from '../components/SphereAIButton';
import { api, getStoredUser, type Quiz, type QuizQuestion } from '../services/api';

const avatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZTzrqinlRFUY1sswmWehy8W9-29UTDjuk86zxLTpDBEFl9w08RLopb5YVU57I-aa19Wl9VrS0edpsQR8xNt48XxF1X06NouIMiuMjCWVN7cjl4ww1TiG2Pzg010a9XNX4VZzhTP0WiiWisWlLR1VOTkgHhhqDiv0wk-TTOJlMwCEETJlt1QJFPrKE6ZFQUNlNCvSgAloR1vE9Ne5LK0MsLRjk_Gb2QyISPjX-_TGececa2Y5py_eOfw';

function getRoleLabel(role?: string) {
  if (role === 'admin') return 'Quản trị viên';
  if (role === 'tutor') return 'Giảng viên';
  if (role === 'student') return 'Học viên';
  return 'Khách';
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function QuizPage() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course_id');
  const initialQuizId = params.get('quiz_id');
  const user = getStoredUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState(initialQuizId ?? '');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [attemptId, setAttemptId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(courseId || initialQuizId));
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!courseId) return;

    setIsLoading(true);
    api.getCourseQuizzes(courseId)
      .then((items) => {
        setQuizzes(items);
        if (!selectedQuizId && items[0]) {
          setSelectedQuizId(items[0]._id);
        }
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : 'Không thể tải quiz'))
      .finally(() => setIsLoading(false));
  }, [courseId, selectedQuizId]);

  useEffect(() => {
    if (!selectedQuizId) return;

    setIsLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setAttemptId('');
    setExpiresAt('');
    setTimeLeft(0);

    const loadQuestions =
      user?.role === 'student'
        ? api.startQuiz(selectedQuizId).then((attempt) => {
            setAttemptId(attempt.attempt_id);
            setExpiresAt(attempt.expires_at);
            setTimeLeft(Math.max(0, Math.floor((new Date(attempt.expires_at).getTime() - Date.now()) / 1000)));
            return attempt.questions;
          })
        : api.getQuizQuestions(selectedQuizId);

    loadQuestions
      .then(setQuestions)
      .catch((err) => setMessage(err instanceof Error ? err.message : 'Không thể tải câu hỏi quiz'))
      .finally(() => setIsLoading(false));
  }, [selectedQuizId, user?.role]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = window.setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const selectedQuiz = useMemo(() => quizzes.find((quiz) => quiz._id === selectedQuizId), [quizzes, selectedQuizId]);
  const answeredCount = Object.values(selectedAnswers).filter((answerIds) => answerIds.length > 0).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  function toggleAnswer(question: QuizQuestion, answerId: string) {
    setSelectedAnswers((current) => {
      const existing = current[question._id] ?? [];
      if (question.question_type === 'single_choice') {
        return { ...current, [question._id]: [answerId] };
      }

      return {
        ...current,
        [question._id]: existing.includes(answerId)
          ? existing.filter((id) => id !== answerId)
          : [...existing, answerId],
      };
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0d131f] text-[#dde2f4] selection:bg-[#adc7ff]/30">
      <AppHeader user={user} roleLabel={getRoleLabel(user?.role)} avatarSrc={avatarSrc} />

      <RoleSidebar activePath="/quiz" user={user} />

      <main className="mx-auto w-full max-w-7xl flex-grow space-y-6 px-4 py-10 md:pl-72 md:pr-8">
        <section className="rounded-xl border border-[#414754]/50 bg-[#1a202c] p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <h1 className="mb-1 text-[26px] font-semibold leading-8 text-[#dde2f4]">Quiz</h1>
              {attemptId && <p className="mt-2 font-mono text-[12px] text-[#8b90a0]">Attempt: {attemptId}</p>}
            </div>
            {expiresAt && (
              <div className="flex w-fit items-center gap-3 rounded-lg border border-[#414754]/50 bg-[#242a37] px-6 py-2">
                <span className="material-symbols-outlined animate-pulse text-[#adc7ff]">schedule</span>
                <span className="font-mono text-[14px] font-medium text-[#adc7ff]">{formatTime(timeLeft)} còn lại</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-end justify-between">
              <span className="font-mono text-[14px] font-medium text-[#dde2f4]">Đã chọn {answeredCount}/{questions.length} câu</span>
              <span className="font-mono text-[12px] text-[#c1c6d7]">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2f3542]">
              <div className="h-full rounded-full bg-[#ffc080] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-lg border border-[#ffc080]/30 bg-[#ffc080]/10 px-4 py-3 text-[14px] text-[#ffc080]">
            {message}
          </div>
        )}

        {courseId && quizzes.length > 0 && (
          <label className="block rounded-xl border border-[#414754]/50 bg-[#161c28] p-4">
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-wider text-[#8b90a0]">Chọn quiz</span>
            <select
              className="w-full rounded-lg border border-[#414754] bg-[#0d131f] px-4 py-3 text-[#dde2f4]"
              value={selectedQuizId}
              onChange={(event) => setSelectedQuizId(event.target.value)}
            >
              {quizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </label>
        )}

        {selectedQuiz && (
          <section className="rounded-xl border border-[#414754]/50 bg-[#161c28] p-6">
            <h2 className="text-[22px] font-semibold text-[#dde2f4]">{selectedQuiz.title}</h2>
            {selectedQuiz.description && <p className="mt-2 text-[#c1c6d7]">{selectedQuiz.description}</p>}
            <p className="mt-3 font-mono text-[12px] text-[#8b90a0]">Thời lượng: {selectedQuiz.time_limit} phút</p>
          </section>
        )}

        {isLoading && <p className="font-mono text-[12px] text-[#8b90a0]">Đang tải dữ liệu quiz...</p>}

        {!isLoading && !questions.length && (
          <div className="rounded-xl border border-dashed border-[#414754] bg-[#161c28] p-10 text-center">
            <span className="material-symbols-outlined mb-3 text-[44px] text-[#8b90a0]">quiz</span>
            <h2 className="text-[22px] font-semibold text-[#dde2f4]">Chưa có câu hỏi quiz</h2>
          </div>
        )}

        <div className="space-y-5">
          {questions.map((question, index) => (
            <section key={question._id} className="rounded-xl border border-[#414754]/40 bg-[#161c28] p-6 md:p-8">
              <div className="mb-6 flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#adc7ff]/10 font-bold text-[#adc7ff]">{index + 1}</span>
                <div>
                  <h2 className="text-[18px] leading-7 text-[#dde2f4]">{question.content}</h2>
                  <p className="mt-2 font-mono text-[12px] text-[#8b90a0]">
                    {question.question_type === 'single_choice' ? 'Một đáp án' : 'Nhiều đáp án'} · {question.point} điểm
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {question.answers.map((answer) => {
                  const checked = selectedAnswers[question._id]?.includes(answer._id) ?? false;
                  return (
                    <button
                      key={answer._id}
                      className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                        checked ? 'border-[#adc7ff] bg-[#adc7ff]/10' : 'border-[#414754]/60 hover:border-[#adc7ff]/40 hover:bg-[#1f2937]'
                      }`}
                      type="button"
                      onClick={() => toggleAnswer(question, answer._id)}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[14px] font-bold ${checked ? 'border-[#adc7ff] text-[#adc7ff]' : 'border-[#414754] text-[#c1c6d7]'}`}>
                        {checked ? <span className="material-symbols-outlined text-[16px]">check</span> : ''}
                      </span>
                      <span className="text-[16px] text-[#dde2f4]">{answer.content}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SphereAIButton />
    </div>
  );
}
