'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiPlus,
  FiTrash2,
  FiX,
  FiEdit3,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiList,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, initializeDB, Quiz, QuizAttempt } from '@/lib/store';
import { useHydrated } from '@/hooks/use-hydrated';
import { useCurrentUser } from '@/hooks/use-current-user';

interface QuestionDraft {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function QuizPage() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const teacherId = currentUser?.role === 'teacher' ? currentUser.id : null;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState('15');
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { question: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);
  const [viewingScores, setViewingScores] = useState<Quiz | null>(null);
  const [resultsTab, setResultsTab] = useState<'attempts' | 'students'>('attempts');

  const hydrated = useHydrated();

  useMemo(() => {
    if (!hydrated) return;
    initializeDB();
    let items = db.getQuizzes();
    if (teacherId) {
      items = items.filter((q) => q.teacherId === teacherId);
    }
    setQuizzes(items);
    let allCourses = db.getCourses();
    if (teacherId) {
      allCourses = db.getCoursesByTeacher(teacherId);
    }
    setCourses(allCourses);
  }, [hydrated, teacherId, refreshKey]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">در حال بارگذاری...</div>;

  const updateQuestion = (idx: number, patch: Partial<QuestionDraft>) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? value : o)) }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((qs) => [...qs, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const course = db.getCourseById(courseId);
    if (!course) {
      toast.error('دوره را انتخاب کنید');
      return;
    }
    if (!title.trim()) {
      toast.error('عنوان آزمون را وارد کنید');
      return;
    }
    const validQuestions = questions.filter(
      (q) => q.question.trim() && q.options.every((o) => o.trim())
    );
    if (validQuestions.length === 0) {
      toast.error('حداقل یک سوال کامل وارد کنید');
      return;
    }
    if (validQuestions.length !== questions.length) {
      toast.error('همه سوالات باید کامل باشند');
      return;
    }
    db.addQuiz({
      courseId: course.id,
      courseName: course.title,
      teacherId: teacherId || course.teacherId,
      title: title.trim(),
      description: description.trim(),
      duration: Number(duration) || 15,
      questions: questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correctIndex: q.correctIndex,
      })),
      createdAt: new Date().toLocaleDateString('fa-IR'),
    });
    toast.success('آزمون با موفقیت ساخته شد');
    setShowModal(false);
    setTitle('');
    setDescription('');
    setCourseId('');
    setDuration('15');
    setQuestions([{ question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این آزمون مطمئن هستید؟ تمام نتایج نیز حذف می‌شوند.')) {
      db.deleteQuiz(id);
      toast.success('آزمون حذف شد');
      setRefreshKey((k) => k + 1);
    }
  };

  const attemptsFor = (quiz: Quiz) => db.getAttemptsByQuiz(quiz.id);
  const avgScore = (quiz: Quiz) => {
    const attempts = attemptsFor(quiz);
    if (attempts.length === 0) return '—';
    const avg = attempts.reduce((s, a) => s + (a.maxScore > 0 ? a.score / a.maxScore : 0), 0) / attempts.length;
    return `${Math.round(avg * 100)}٪`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">آزمون‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">{quizzes.length} آزمون</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          ساخت آزمون جدید
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16 bg-background border rounded-2xl">
          <FiAward className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">هنوز آزمونی ساخته نشده است</p>
          <p className="text-sm text-muted-foreground mt-1">اولین آزمون را برای دانش‌آموزان خود بسازید</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {quizzes.map((quiz) => {
            const attempts = attemptsFor(quiz);
            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background border rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FiAward className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{quiz.title}</h3>
                      <p className="text-xs text-muted-foreground">{quiz.courseName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>

                {quiz.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>
                )}

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60">
                    <FiList className="h-3 w-3" /> {quiz.questions.length} سوال
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60">
                    <FiClock className="h-3 w-3" /> {quiz.duration} دقیقه
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60">
                    <FiUsers className="h-3 w-3" /> {attempts.length} شرکت
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700">
                    <FiCheckCircle className="h-3 w-3" /> میانگین {avgScore(quiz)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setViewingScores(quiz);
                    setResultsTab('attempts');
                  }}
                  className="mt-auto flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <FiEdit3 className="h-4 w-4" />
                  مشاهده نتایج
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">ساخت آزمون جدید</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">عنوان آزمون</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلا: آزمون گرامر درس ۱ تا ۳"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">توضیحات</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="توضیح کوتاه درباره آزمون..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">دوره</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">انتخاب دوره...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="border rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">سوالات</h3>
                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <FiPlus className="h-3 w-3" /> افزودن سوال
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="border rounded-xl p-3 space-y-2 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
                        سوال {qIdx + 1}
                      </span>
                      <input
                        value={q.question}
                        onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                        placeholder="متن سوال..."
                        className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      />
                      {questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(qIdx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 pr-8">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuestion(qIdx, { correctIndex: oIdx })}
                            title="گزینه صحیح"
                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              q.correctIndex === oIdx ? 'border-green-500 bg-green-500' : 'border-muted-foreground/40'
                            }`}
                          >
                            {q.correctIndex === oIdx && (
                              <FiCheckCircle className="h-3 w-3 text-white" />
                            )}
                          </button>
                          <input
                            value={opt}
                            onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                            placeholder={`گزینه ${oIdx + 1}`}
                            className="flex-1 px-3 py-1.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground pr-8">
                      دایره سبز = گزینه صحیح (برای این سوال)
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                ذخیره آزمون
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Results Modal */}
      {viewingScores && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{viewingScores.title}</h2>
                <p className="text-xs text-muted-foreground">{viewingScores.courseName} — {viewingScores.questions.length} سوال</p>
              </div>
              <button onClick={() => setViewingScores(null)} className="p-1 hover:bg-muted rounded-lg">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setResultsTab('attempts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  resultsTab === 'attempts' ? 'bg-primary text-primary-foreground' : 'bg-muted/60'
                }`}
              >
                نتایج
              </button>
              <button
                onClick={() => setResultsTab('students')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  resultsTab === 'students' ? 'bg-primary text-primary-foreground' : 'bg-muted/60'
                }`}
              >
                بر اساس دانش‌آموز
              </button>
            </div>

            {(() => {
              const attempts = db.getAttemptsByQuiz(viewingScores.id);
              if (attempts.length === 0) {
                return (
                  <div className="text-center py-10">
                    <FiUsers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground">هنوز کسی در این آزمون شرکت نکرده است</p>
                  </div>
                );
              }
              if (resultsTab === 'attempts') {
                return (
                  <div className="space-y-2">
                    {attempts.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border">
                        <div>
                          <p className="text-sm font-medium">{a.studentName}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">{a.date}</p>
                        </div>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            a.maxScore > 0 && a.score / a.maxScore >= 0.7
                              ? 'bg-green-50 text-green-700'
                              : a.maxScore > 0 && a.score / a.maxScore >= 0.4
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {a.score} / {a.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              const byStudent = attempts.reduce((acc: Record<string, QuizAttempt[]>, a) => {
                (acc[a.studentId] = acc[a.studentId] || []).push(a);
                return acc;
              }, {} as Record<string, QuizAttempt[]>);
              return (
                <div className="space-y-2">
                  {Object.entries(byStudent).map(([sid, list]) => {
                    const best = Math.max(...list.map((a) => (a.maxScore > 0 ? a.score / a.maxScore : 0)));
                    return (
                      <div key={sid} className="flex items-center justify-between p-3 rounded-xl border">
                        <div>
                          <p className="text-sm font-medium">{list[0].studentName}</p>
                          <p className="text-xs text-muted-foreground">{list.length} بار شرکت</p>
                        </div>
                        <span className="text-sm font-bold px-3 py-1 rounded-lg bg-primary/10 text-primary">
                          {Math.round(best * 100)}٪ بهترین
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
}
