import mongoose from 'mongoose';
import { ClassroomStatus, ClassroomType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const classroomSchema = new Schema({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  floor: { type: Number, default: 0 },
  capacity: { type: Number, required: true, min: 1 },
  reservedSeats: { type: Number, default: 0 },
  type: { type: String, enum: Object.values(ClassroomType), default: ClassroomType.REGULAR },
  status: { type: String, enum: Object.values(ClassroomStatus), default: ClassroomStatus.AVAILABLE },
  facilities: [{ type: String }],
  coverImageUrl: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(classroomSchema);

classroomSchema.virtual('availableSeats').get(function (this: ClassroomDocument) {
  return this.capacity - this.reservedSeats;
});

classroomSchema.index({ branchId: 1, isActive: 1 });

export interface ClassroomDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  name: string;
  floor?: number;
  capacity: number;
  reservedSeats: number;
  type: string;
  status: string;
  facilities?: string[];
  coverImageUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  availableSeats: number;
}

export const ClassroomModel = model<ClassroomDocument>('Classroom', classroomSchema);

