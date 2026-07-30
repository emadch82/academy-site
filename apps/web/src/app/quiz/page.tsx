'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiXCircle, FiClock, FiAward } from 'react-icons/fi';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const MOCK_QUESTIONS: Question[] = [
  { id: 1, question: 'پایتخت ایران کدام شهر است؟', options: ['اصفهان', 'تهران', 'شیراز', 'تبریز'], correct: 1 },
  { id: 2, question: 'کدام زبان برنامه‌نویسی بیشترین استفاده را در هوش مصنوعی دارد؟', options: ['Java', 'C++', 'Python', 'JavaScript'], correct: 2 },
  { id: 3, question: 'فرمول آب چیست؟', options: ['CO2', 'H2O', 'NaCl', 'O2'], correct: 1 },
  { id: 4, question: 'بزرگترین اقیانوس جهان کدام است؟', options: ['اطلس', 'هند', 'آرام', 'جنوبگان'], correct: 2 },
  { id: 5, question: 'React توسط کدام شرکت توسعه یافته است؟', options: ['Google', 'Microsoft', 'Meta', 'Apple'], correct: 2 },
];

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(MOCK_QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const question = MOCK_QUESTIONS[currentQ];
  const score = answers.reduce<number>((acc, ans, i) => acc + (ans === MOCK_QUESTIONS[i].correct ? 1 : 0), 0);
  const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  if (!quizStarted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                <FiAward className="h-12 w-12 text-primary/40" />
              </div>
              <h1 className="text-3xl font-bold mb-4">آزمون آنلاین</h1>
              <p className="text-muted-foreground mb-8">
                {MOCK_QUESTIONS.length} سوال | زمان: {MOCK_QUESTIONS.length * 2} دقیقه
              </p>
              <button type="button" onClick={() => setQuizStarted(true)} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                شروع آزمون
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  if (showResult) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 ${percentage >= 60 ? 'bg-green-100' : 'bg-red-100'}`}>
              {percentage >= 60 ? <FiCheckCircle className="h-12 w-12 text-green-600" /> : <FiXCircle className="h-12 w-12 text-red-600" />}
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {percentage >= 60 ? 'تبریک! قبول شدید' : 'متأسفانه قبول نشدید'}
            </h1>
            <p className="text-muted-foreground mb-2">نتیجه شما:</p>
            <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
            <p className="text-muted-foreground mb-8">{score} از {MOCK_QUESTIONS.length} پاسخ صحیح</p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={() => { setQuizStarted(false); setShowResult(false); setAnswers(new Array(MOCK_QUESTIONS.length).fill(null)); setCurrentQ(0); }} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                تلاش مجدد
              </button>
              <Link href="/courses" className="border px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors">بازگشت</Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <FiArrowRight className="ml-1 h-4 w-4" />
                خروج
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FiClock className="h-4 w-4" />
                سوال {currentQ + 1} از {MOCK_QUESTIONS.length}
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / MOCK_QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-background rounded-2xl border p-8">
          <h2 className="text-xl font-bold mb-8">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button key={i} type="button" onClick={() => handleAnswer(i)} className={`w-full text-right p-4 rounded-xl border-2 transition-all ${answers[currentQ] === i ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}>
                <span className="font-medium">{opt}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            {currentQ > 0 && (
              <button type="button" onClick={() => setCurrentQ(currentQ - 1)} className="px-6 py-3 rounded-xl border font-medium hover:bg-muted transition-colors">سوال قبل</button>
            )}
            {currentQ < MOCK_QUESTIONS.length - 1 ? (
              <button type="button" onClick={() => setCurrentQ(currentQ + 1)} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">سوال بعد</button>
            ) : (
              <button type="button" onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all">ارائه پاسخ‌ها</button>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
