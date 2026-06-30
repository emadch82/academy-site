import mongoose from 'mongoose';
import { CertificateStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const certificateSchema = new Schema({
  serialNumber: { type: String, required: true, unique: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, default: null },
  status: { type: String, enum: Object.values(CertificateStatus), default: CertificateStatus.PENDING },
  pdfUrl: { type: String, default: null },
  qrCode: { type: String, default: null },
  verificationUrl: { type: String, default: null },
  digitalSignature: { type: String, default: null },
  metadata: {
    courseDuration: { type: Number },
    courseHours: { type: Number },
    finalGrade: { type: Number },
    attendanceRate: { type: Number },
    skills: [{ type: String }],
  },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(certificateSchema);

certificateSchema.index({ studentId: 1, courseId: 1 });
certificateSchema.index({ serialNumber: 1 });

export interface CertificateDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  serialNumber: string;
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  issueDate: Date;
  expiryDate?: Date;
  status: string;
  pdfUrl?: string;
  qrCode?: string;
  verificationUrl?: string;
  digitalSignature?: string;
  metadata?: {
    courseDuration?: number;
    courseHours?: number;
    finalGrade?: number;
    attendanceRate?: number;
    skills?: string[];
  };
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CertificateModel = model<CertificateDocument>('Certificate', certificateSchema);

