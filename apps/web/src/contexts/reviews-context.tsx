'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsContextType {
  getCourseReviews: (courseId: string) => Review[];
  addReview: (courseId: string, userName: string, rating: number, comment: string) => boolean;
  hasUserReviewed: (courseId: string, userId: string) => boolean;
  getAverageRating: (courseId: string) => number;
  getReviewCount: (courseId: string) => number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('course-reviews');
    if (saved) {
      try { setReviews(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('course-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const getCourseReviews = useCallback(
    (courseId: string) => reviews.filter((r) => r.courseId === courseId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews]
  );

  const addReview = useCallback((courseId: string, userName: string, rating: number, comment: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const userId = 'user-' + Date.now();
    const newReview: Review = { id, courseId, userId, userName, rating, comment, createdAt: new Date().toISOString() };
    setReviews((prev) => [...prev, newReview]);
    return true;
  }, []);

  const hasUserReviewed = useCallback(
    (courseId: string, userId: string) => reviews.some((r) => r.courseId === courseId && r.userId === userId),
    [reviews]
  );

  const getAverageRating = useCallback(
    (courseId: string) => {
      const courseReviews = reviews.filter((r) => r.courseId === courseId);
      if (courseReviews.length === 0) return 0;
      return courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    },
    [reviews]
  );

  const getReviewCount = useCallback(
    (courseId: string) => reviews.filter((r) => r.courseId === courseId).length,
    [reviews]
  );

  return (
    <ReviewsContext.Provider value={{ getCourseReviews, addReview, hasUserReviewed, getAverageRating, getReviewCount }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within ReviewsProvider');
  return context;
}
