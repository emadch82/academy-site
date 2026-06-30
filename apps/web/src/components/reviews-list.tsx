'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser } from 'react-icons/fi';
import { useReviews, Review } from '@/contexts/reviews-context';

interface ReviewsListProps {
  courseId: string;
  refreshKey: number;
}

const ratingLabels: Record<number, string> = {
  1: 'ضعیف',
  2: 'متوسط',
  3: 'خوب',
  4: 'عالی',
  5: 'عالی',
};

export function ReviewsList({ courseId, refreshKey }: ReviewsListProps) {
  const { getCourseReviews, getAverageRating, getReviewCount } = useReviews();
  const reviews = getCourseReviews(courseId);
  const avgRating = getAverageRating(courseId);
  const count = getReviewCount(courseId);

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <div className="space-y-6">
      {/* Summary */}
      {count > 0 && (
        <div className="bg-background rounded-2xl border p-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{avgRating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{count} نظر</p>
            </div>

            <div className="flex-1 min-w-[200px] space-y-1.5">
              {ratingCounts.map(({ rating, count: rCount }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-muted-foreground">{rating}</span>
                  <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: count > 0 ? `${(rCount / count) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="w-8 text-muted-foreground text-xs">{rCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <FiStar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">هنوز نظری ثبت نشده است</p>
          <p className="text-sm text-muted-foreground/60">اولین نفری باشید که نظر میدهید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background rounded-xl border p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground mr-1">{ratingLabels[review.rating]}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
