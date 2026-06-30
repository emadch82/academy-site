import mongoose from 'mongoose';
import { AttendanceStatus, AttendanceMethod } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const attendanceSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ClassSession', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: Object.values(AttendanceStatus), required: true },
  method: { type: String, enum: Object.values(AttendanceMethod), required: true },
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
  notes: { type: String, maxlength: 500 },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(attendanceSchema);

attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ studentId: 1, status: 1 });

export interface AttendanceDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: string;
  method: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  markedBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const AttendanceModel = model<AttendanceDocument>('Attendance', attendanceSchema);

