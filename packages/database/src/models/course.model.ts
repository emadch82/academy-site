import mongoose from 'mongoose';
import { CourseType, CourseStatus, CourseLevel } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const syllabusItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number },
  order: { type: Number, required: true },
}, { _id: true });

const courseSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  summary: { type: String, required: true, maxlength: 500 },
  description: { type: String, maxlength: 10000 },
  type: { type: String, enum: Object.values(CourseType), required: true, index: true },
  level: { type: String, enum: Object.values(CourseLevel), default: CourseLevel.ALL_LEVELS },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0, default: null },
  currency: { type: String, default: 'IRR' },
  durationMinutes: { type: Number, required: true },
  sessionsCount: { type: Number, required: true },
  capacity: { type: Number, default: null },
  reservationCapacity: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  prerequisites: [{ type: String }],
  syllabus: [syllabusItemSchema],
  tags: [{ type: String }],
  coverImageUrl: { type: String, default: null },
  introVideoUrl: { type: String, default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  status: { type: String, enum: Object.values(CourseStatus), default: CourseStatus.DRAFT, index: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, {
  ...baseSchemaOptions,
  toJSON: {
    ...baseSchemaOptions.toJSON,
    transform(doc: any, ret: any) {
      const base = baseSchemaOptions.toJSON.transform(doc, ret);
      return base;
    },
  },
});

applySoftDelete(courseSchema);

courseSchema.index({ status: 1, isFeatured: -1 });
courseSchema.index({ teacherId: 1, status: 1 });
courseSchema.index({ branchId: 1, status: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ title: 'text', summary: 'text', tags: 'text' });

export interface CourseSyllabusItem {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  durationMinutes?: number;
  order: number;
}

export interface CourseDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  type: string;
  level: string;
  categoryId?: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  price: number;
  discountPrice?: number;
  currency: string;
  durationMinutes: number;
  sessionsCount: number;
  capacity?: number;
  reservationCapacity: number;
  enrolledCount: number;
  prerequisites?: string[];
  syllabus?: CourseSyllabusItem[];
  tags?: string[];
  coverImageUrl?: string;
  introVideoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  isFeatured: boolean;
  rating: number;
  ratingCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CourseModel = model<CourseDocument>('Course', courseSchema);

