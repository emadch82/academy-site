import type { CourseType, CourseStatus, CourseLevel } from '../enums/index.js';

/** DTO کلیِ دوره برای نمایش */
export interface CourseDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  type: CourseType;
  level: CourseLevel;
  status: CourseStatus;
  coverImageUrl?: string;
  introVideoUrl?: string;
  price: number; // به ریال
  discountPrice?: number;
  currency: string; // 'IRR'
  durationMinutes: number;
  sessionsCount: number;
  teacherId: string;
  teacherName?: string;
  branchId?: string;
  capacity?: number;
  enrolledCount: number;
  startDate?: Date;
  endDate?: Date;
  rating?: number;
  tags?: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** سرفصل دوره */
export interface CourseSyllabusItem {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  order: number;
}
