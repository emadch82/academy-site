import mongoose from 'mongoose';
import { SessionStatus, SessionType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const sessionMaterialSchema = new Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

const classSessionSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', default: null },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  type: { type: String, enum: Object.values(SessionType), required: true },
  status: { type: String, enum: Object.values(SessionStatus), default: SessionStatus.SCHEDULED, index: true },
  date: { type: Date, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  meetingUrl: { type: String, default: null },
  recordingUrl: { type: String, default: null },
  materials: [sessionMaterialSchema],
  attendanceCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(classSessionSchema);

classSessionSchema.index({ courseId: 1, date: 1 });
classSessionSchema.index({ teacherId: 1, date: 1 });
classSessionSchema.index({ status: 1, date: 1 });

export interface ClassSessionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  classroomId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: string;
  status: string;
  date: Date;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingUrl?: string;
  recordingUrl?: string;
  materials?: Array<{
    _id?: mongoose.Types.ObjectId;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
  }>;
  attendanceCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ClassSessionModel = model<ClassSessionDocument>('ClassSession', classSessionSchema);

