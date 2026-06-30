import mongoose from 'mongoose';
import { PublishStatus, ContentType, BannerType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const articleSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  summary: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  type: { type: String, enum: Object.values(ContentType), required: true, index: true },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.DRAFT, index: true },
  coverImageUrl: { type: String, default: null },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  tags: [{ type: String }],
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  metaTitle: { type: String, maxlength: 200 },
  metaDescription: { type: String, maxlength: 500 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(articleSchema);

articleSchema.index({ slug: 1 });
articleSchema.index({ type: 1, status: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ title: 'text', summary: 'text', content: 'text' });

export interface ArticleDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  type: string;
  status: string;
  coverImageUrl?: string;
  authorId?: mongoose.Types.ObjectId;
  tags?: string[];
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ArticleModel = model<ArticleDocument>('Article', articleSchema);


const bannerSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  subtitle: { type: String, maxlength: 200 },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: null },
  type: { type: String, enum: Object.values(BannerType), required: true, index: true },
  position: { type: String, default: null },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(bannerSchema);

bannerSchema.index({ type: 1, isActive: 1, order: 1 });

export interface BannerDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  type: string;
  position?: string;
  order: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const BannerModel = model<BannerDocument>('Banner', bannerSchema);


const faqSchema = new Schema({
  question: { type: String, required: true, maxlength: 500 },
  answer: { type: String, required: true, maxlength: 5000 },
  category: { type: String, maxlength: 100 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(faqSchema);

faqSchema.index({ category: 1, isActive: 1, order: 1 });

export interface FaqDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const FaqModel = model<FaqDocument>('Faq', faqSchema);


const gallerySchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: null },
  category: { type: String, maxlength: 100 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(gallerySchema);

gallerySchema.index({ category: 1, isActive: 1, order: 1 });

export interface GalleryDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const GalleryModel = model<GalleryDocument>('Gallery', gallerySchema);


const testimonialSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentAvatar: { type: String, default: null },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
  courseName: { type: String, default: null },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 2000 },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(testimonialSchema);

testimonialSchema.index({ isApproved: 1, isFeatured: -1 });
testimonialSchema.index({ courseId: 1 });

export interface TestimonialDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentAvatar?: string;
  courseId?: mongoose.Types.ObjectId;
  courseName?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const TestimonialModel = model<TestimonialDocument>('Testimonial', testimonialSchema);

