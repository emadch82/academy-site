import mongoose from 'mongoose';
import { BranchStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const dayHoursSchema = new Schema({
  open: { type: String, default: null },
  close: { type: String, default: null },
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const branchSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 50 },
  province: { type: String, required: true, trim: true, maxlength: 50 },
  postalCode: { type: String, default: null },
  phone: { type: String, required: true, trim: true },
  mobile: { type: String, default: null },
  email: { type: String, default: null },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: Object.values(BranchStatus), default: BranchStatus.ACTIVE },
  openingHours: {
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  facilities: [{ type: String }],
  coverImageUrl: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(branchSchema);

branchSchema.index({ city: 1, province: 1 });
branchSchema.index({ isActive: 1 });

export interface BranchDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  phone: string;
  mobile?: string;
  email?: string;
  managerId?: mongoose.Types.ObjectId;
  status: string;
  openingHours?: Record<string, { open?: string; close?: string; isClosed?: boolean }>;
  coordinates?: { latitude: number; longitude: number };
  facilities?: string[];
  coverImageUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const BranchModel = model<BranchDocument>('Branch', branchSchema);

