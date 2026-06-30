'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import { useReviews } from '@/contexts/reviews-context';
import { useCart } from '@/contexts/cart-context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  courseId: string;
  onReviewAdded: () => void;
}

export function ReviewForm({ courseId, onReviewAdded }: ReviewFormProps) {
  const router = useRouter();
  const { addReview } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Cookies.get('amz_access')) {
      toast.error('برای ثبت نظر ابتدا وارد شوید');
      router.push('/auth/login');
      return;
    }
    if (rating === 0) {
      toast.error('لطفاً امتیاز بدهید');
      return;
    }
    if (!comment.trim()) {
      toast.error('لطفاً نظر خود را بنویسید');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    addReview(courseId, userName || 'کاربر', rating, comment.trim());
    setRating(0);
    setComment('');
    setUserName('');
    setIsSubmitting(false);
    toast.success('نظر شما ثبت شد');
    onReviewAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-background rounded-2xl border p-6 space-y-5">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <FiMessageSquare className="h-5 w-5 text-primary" />
        ثبت نظر
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">امتیاز شما</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <FiStar
                className={`h-7 w-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-muted-foreground mr-2">
              {rating === 1 && 'ضعیف'}
              {rating === 2 && 'متوسط'}
              {rating === 3 && 'خوب'}
              {rating === 4 && 'عالی'}
              {rating === 5 && 'عالی'}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <FiUser className="inline ml-1 h-4 w-4" />
          نام (اختیاری)
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="نام شما"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">نظر شما</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          placeholder="نظر خود را درباره این دوره بنویسید..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          'در حال ارسال...'
        ) : (
          <>
            <FiSend className="h-4 w-4" />
            ثبت نظر
          </>
        )}
      </button>
    </form>
  );
}
