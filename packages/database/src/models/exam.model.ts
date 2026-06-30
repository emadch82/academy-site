import mongoose from 'mongoose';
import { QuestionType, ExamStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const questionOptionSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
}, { _id: true });

const questionSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  type: { type: String, enum: Object.values(QuestionType), required: true },
  text: { type: String, required: true },
  options: [questionOptionSchema],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  marks: { type: Number, required: true, min: 1 },
  explanation: { type: String, maxlength: 2000 },
  order: { type: Number, required: true },
  fileUrl: { type: String, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(questionSchema);

questionSchema.index({ examId: 1, order: 1 });

export interface QuestionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  type: string;
  text: string;
  options?: Array<{
    _id?: mongoose.Types.ObjectId;
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer: string | string[];
  marks: number;
  explanation?: string;
  order: number;
  fileUrl?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const QuestionModel = model<QuestionDocument>('Question', questionSchema);


const examSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  status: { type: String, enum: Object.values(ExamStatus), default: ExamStatus.DRAFT, index: true },
  durationMinutes: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  negativeMarking: { type: Boolean, default: false },
  negativeMarkValue: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 1 },
  shuffleQuestions: { type: Boolean, default: false },
  showResults: { type: Boolean, default: true },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  questionsCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(examSchema);

examSchema.index({ courseId: 1, status: 1 });

export interface ExamDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  startTime?: Date;
  endTime?: Date;
  questionsCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ExamModel = model<ExamDocument>('Exam', examSchema);

