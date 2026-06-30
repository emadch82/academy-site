import type { PublishStatus, ContentType, BannerType } from '../enums/index.js';

/** DTO مقاله/خبر */
export interface ArticleDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  type: ContentType;
  status: PublishStatus;
  coverImageUrl?: string;
  authorId?: string;
  authorName?: string;
  tags?: string[];
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO صفحه CMS */
export interface PageDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status: PublishStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO بنر */
export interface BannerDto {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  type: BannerType;
  position?: string;
  order: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO FAQ */
export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO گالری */
export interface GalleryDto {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO نظر دانشجو */
export interface TestimonialDto {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  courseId?: string;
  courseName?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
