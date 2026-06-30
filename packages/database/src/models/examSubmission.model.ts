import mongoose from 'mongoose';
import { ExamSubmissionStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const examAnswerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, default: null },
  marks: { type: Number, default: null },
}, { _id: false });

const examSubmissionSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: Object.values(ExamSubmissionStatus), default: ExamSubmissionStatus.IN_PROGRESS },
  answers: [examAnswerSchema],
  score: { type: Number, default: null },
  percentage: { type: Number, default: null },
  isPassed: { type: Boolean, default: null },
  startTime: { type: Date, default: Date.now },
  submitTime: { type: Date, default: null },
  durationMinutes: { type: Number, default: null },
  ipAddress: { type: String, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(examSubmissionSchema);

examSubmissionSchema.index({ examId: 1, studentId: 1 });
examSubmissionSchema.index({ studentId: 1, status: 1 });

export interface ExamSubmissionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: string;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    answer: string | string[];
    isCorrect?: boolean;
    marks?: number;
  }>;
  score?: number;
  percentage?: number;
  isPassed?: boolean;
  startTime: Date;
  submitTime?: Date;
  durationMinutes?: number;
  ipAddress?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ExamSubmissionModel = model<ExamSubmissionDocument>('ExamSubmission', examSubmissionSchema);

