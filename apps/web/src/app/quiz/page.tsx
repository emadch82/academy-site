'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAward, FiClock, FiCheckCircle, FiXCircle, FiChevronRight, FiRotateCcw } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { db, initializeDB, Quiz } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const hydrated = useHydrated();

  const user = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = Cookies.get('amz_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; name: string; identifier: string; role: string };
    } catch {
      return null;
    }
  }, []);

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getQuizzes();
    if (user?.id) {
      const courseIds = db
        .getEnrollmentsByStudent(user.id)
        .filter((e) => e.status !== 'cancelled')
        .map((e) => e.courseId);
      if (courseIds.length > 0) {
        items = items.filter((q) => courseIds.includes(q.courseId));
      }
    }
    setQuizzes(items);
  }, [hydrated, user?.id, refreshKey]);

  if (!hydrated) return <main className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">در حال بارگذاری...</p></main>;

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setShowResult(false);
  };

  const answer = (qIdx: number, oIdx: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? oIdx : a)));
  };

  const submit = () => {
    if (!selectedQuiz) return;
    const unanswered = answers.filter((a) => a === -1).length;
    if (unanswered > 0) {
      const r = confirm(`هنوز ${unanswered} سوال بدون پاسخ دارید. آیا مطمئن هستید؟`);
      if (!r) return;
    }
    const score = selectedQuiz.questions.reduce(
      (s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    if (user?.id) {
      db.addQuizAttempt({
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        courseId: selectedQuiz.courseId,
        studentId: user.id,
        studentName: user.name,
        score,
        maxScore: selectedQuiz.questions.length,
        date: new Date().toLocaleDateString('fa-IR'),
      });
    }
    setShowResult(true);
    setRefreshKey((k) => k + 1);
  };

  const score = selectedQuiz
    ? selectedQuiz.questions.reduce((s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;
  const pct = selectedQuiz ? Math.round((score / selectedQuiz.questions.length) * 100) : 0;

  if (selectedQuiz && !showResult) {
    const q = selectedQuiz.questions[currentQ];
    return (
      <main className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedQuiz.courseName} — سوال {currentQ + 1} از {selectedQuiz.questions.length}
                  </p>
                </div>
                <button onClick={() => setSelectedQuiz(null)} className="text-sm text-muted-foreground hover:text-foreground">
                  خروج از آزمون
                </button>
              </div>

              <div className="flex gap-1.5 mb-6">
                {selectedQuiz.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      answers[i] !== -1 ? 'bg-primary' : i === currentQ ? 'bg-primary/30' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-background border rounded-2xl p-6 mb-6">
                <p className="font-bold text-lg mb-4">{currentQ + 1}. {q.question}</p>
                <div className="grid gap-3">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => answer(currentQ, oIdx)}
                      className={`text-right px-4 py-3 rounded-xl border transition-colors ${
                        answers[currentQ] === oIdx
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
                  disabled={currentQ === 0}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border font-medium disabled:opacity-40 hover:bg-muted/50 transition-colors"
                >
                  <FiChevronRight className="h-4 w-4" /> قبلی
                </button>
                {currentQ < selectedQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ((c) => c + 1)}
                    className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    بعدی
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    ثبت پاسخ‌ها
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  if (selectedQuiz && showResult) {
    return (
      <main className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center">
              <div className={`h-28 w-28 rounded-3xl mx-auto mb-6 flex items-center justify-center ${pct >= 60 ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={`text-3xl font-bold ${pct >= 60 ? 'text-green-600' : 'text-red-500'}`}>{pct}٪</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{pct >= 60 ? 'آفرین! قبول شدید' : 'دفعه بعد موفق می‌شوید'}</h1>
              <p className="text-muted-foreground mb-4">
                نتیجه شما در «{selectedQuiz.title}»: <span className="font-bold text-foreground">{score} از {selectedQuiz.questions.length}</span>
              </p>
              {!user && (
                <p className="text-xs text-muted-foreground mb-6">
                  برای ذخیره نتیجه خود <Link href="/auth/login" className="text-primary hover:underline">وارد شوید</Link>
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => startQuiz(selectedQuiz)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium hover:bg-muted/50 transition-colors"
                >
                  <FiRotateCcw className="h-4 w-4" /> آزمون مجدد
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                >
                  بازگشت به لیست
                </button>
              </div>

              <div className="mt-8 text-right bg-background border rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-center mb-4">مرور پاسخ‌ها</h3>
                {selectedQuiz.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {answers[i] === q.correctIndex ? (
                      <FiCheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <FiXCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        پاسخ صحیح: <span className="text-green-600">{q.options[q.correctIndex]}</span>
                        {answers[i] !== q.correctIndex && (
                          <> — پاسخ شما: <span className="text-red-500">{answers[i] !== -1 ? q.options[answers[i]] : 'بدون پاسخ'}</span></>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                <FiAward className="h-12 w-12 text-primary/40" />
              </div>
              <h1 className="text-3xl font-bold mb-3">آزمون‌های آنلاین</h1>
              <p className="text-muted-foreground">
                {user ? 'آزمون‌های دوره‌های شما' : 'برای دیدن آزمون‌های دوره‌های خود وارد شوید'}
              </p>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-12 bg-background border rounded-2xl">
                <p className="font-bold">آزمونی برای شما تعریف نشده است</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {user ? 'آزمون‌های دوره‌های شما به‌زودی اضافه می‌شوند' : <Link href="/auth/login" className="text-primary hover:underline">ورود به حساب کاربری</Link>}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {quizzes.map((quiz) => {
                  const attempts = db.getAttemptsByQuiz(quiz.id);
                  const mine = user?.id ? attempts.filter((a) => a.studentId === user.id) : [];
                  const last = mine.length > 0 ? mine[mine.length - 1] : null;
                  return (
                    <motion.div key={quiz.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-background border rounded-2xl p-6 flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <FiAward className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="font-bold text-lg">{quiz.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{quiz.courseName}</p>
                      <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {quiz.duration} دقیقه</span>
                        <span>{quiz.questions.length} سوال</span>
                      </div>
                      {last && (
                        <p className="text-xs mt-3">
                          آخرین نتیجه: <span className={`font-bold ${last.score / last.maxScore >= 0.6 ? 'text-green-600' : 'text-red-500'}`}>{last.score} / {last.maxScore}</span>
                        </p>
                      )}
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="mt-5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        {last ? 'آزمون مجدد' : 'شروع آزمون'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
