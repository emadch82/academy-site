import mongoose from 'mongoose';
import { baseSchemaFields, baseSchemaOptions, applySoftDelete } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const seatSchema = new Schema({
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true, index: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  label: { type: String, required: true },
  isOccupied: { type: Boolean, default: false },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(seatSchema);

seatSchema.index({ classroomId: 1, row: 1, column: 1 }, { unique: true });
seatSchema.index({ classroomId: 1, isOccupied: 1 });

export interface SeatDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  classroomId: mongoose.Types.ObjectId;
  row: number;
  column: number;
  label: string;
  isOccupied: boolean;
  studentId?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const SeatModel = model<SeatDocument>('Seat', seatSchema);


const courseScheduleSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(courseScheduleSchema);

courseScheduleSchema.index({ courseId: 1, dayOfWeek: 1 });
courseScheduleSchema.index({ classroomId: 1, dayOfWeek: 1 });
courseScheduleSchema.index({ teacherId: 1, dayOfWeek: 1 });

export interface CourseScheduleDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  classroomId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherId: mongoose.Types.ObjectId;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CourseScheduleModel = model<CourseScheduleDocument>('CourseSchedule', courseScheduleSchema);

