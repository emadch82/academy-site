import mongoose from 'mongoose';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, maxlength: 500 },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
  icon: { type: String, default: null },
  imageUrl: { type: String, default: null },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  courseCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(categorySchema);

categorySchema.index({ parentId: 1, isActive: 1, order: 1 });

export interface CategoryDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId;
  icon?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  courseCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CategoryModel = model<CategoryDocument>('Category', categorySchema);


const teacherPayoutSchema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IRR' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending', index: true },
  period: {
    from: { type: Date },
    to: { type: Date },
  },
  transactionsCount: { type: Number, default: 0 },
  paidAt: { type: Date, default: null },
  notes: { type: String, maxlength: 1000 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(teacherPayoutSchema);

teacherPayoutSchema.index({ teacherId: 1, status: 1 });

export interface TeacherPayoutDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  period?: { from?: Date; to?: Date };
  transactionsCount: number;
  paidAt?: Date;
  notes?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const TeacherPayoutModel = model<TeacherPayoutDocument>('TeacherPayout', teacherPayoutSchema);

