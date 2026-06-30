import mongoose from 'mongoose';
import { AssignmentStatus, AssignmentSubmissionStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const assignmentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'ClassSession', default: null },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 5000 },
  status: { type: String, enum: Object.values(AssignmentStatus), default: AssignmentStatus.DRAFT, index: true },
  dueDate: { type: Date, required: true },
  totalMarks: { type: Number, required: true },
  allowedFileTypes: [{ type: String }],
  maxFileSize: { type: Number, default: 10485760 }, // 10MB
  maxSubmissions: { type: Number, default: 1 },
  submissionsCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(assignmentSchema);

assignmentSchema.index({ courseId: 1, status: 1 });

export interface AssignmentDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  dueDate: Date;
  totalMarks: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxSubmissions?: number;
  submissionsCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const AssignmentModel = model<AssignmentDocument>('Assignment', assignmentSchema);


const submissionFileSchema = new Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
}, { _id: true });

const assignmentSubmissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: Object.values(AssignmentSubmissionStatus), default: AssignmentSubmissionStatus.SUBMITTED },
  files: [submissionFileSchema],
  notes: { type: String, maxlength: 2000 },
  grade: { type: Number, default: null },
  feedback: { type: String, maxlength: 2000 },
  gradedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  gradedAt: { type: Date, default: null },
  submittedAt: { type: Date, default: Date.now },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(assignmentSubmissionSchema);

assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export interface AssignmentSubmissionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: string;
  files: Array<{
    _id?: mongoose.Types.ObjectId;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  notes?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
  submittedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const AssignmentSubmissionModel = model<AssignmentSubmissionDocument>('AssignmentSubmission', assignmentSubmissionSchema);

