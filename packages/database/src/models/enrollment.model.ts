import mongoose from 'mongoose';
import { EnrollmentStatus, EnrollmentType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const enrollmentSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', default: null },
  seatId: { type: Schema.Types.ObjectId, default: null },
  status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.PENDING, index: true },
  type: { type: String, enum: Object.values(EnrollmentType), required: true },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  notes: { type: String, maxlength: 1000 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(enrollmentSchema);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ branchId: 1, status: 1 });

export interface EnrollmentDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  classroomId?: mongoose.Types.ObjectId;
  seatId?: mongoose.Types.ObjectId;
  status: string;
  type: string;
  invoiceId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const EnrollmentModel = model<EnrollmentDocument>('Enrollment', enrollmentSchema);

