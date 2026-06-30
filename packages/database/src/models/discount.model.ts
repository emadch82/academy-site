import mongoose from 'mongoose';
import { DiscountType, DiscountStatus, DiscountTarget } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const discountCodeSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  type: { type: String, enum: Object.values(DiscountType), required: true },
  value: { type: Number, required: true, min: 0 },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null },
  usageLimit: { type: Number, required: true, min: 1 },
  usedCount: { type: Number, default: 0 },
  target: { type: String, enum: Object.values(DiscountTarget), default: DiscountTarget.ALL },
  targetIds: [{ type: Schema.Types.ObjectId }],
  status: { type: String, enum: Object.values(DiscountStatus), default: DiscountStatus.ACTIVE, index: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(discountCodeSchema);

discountCodeSchema.index({ code: 1 });
discountCodeSchema.index({ status: 1, startDate: 1, endDate: 1 });

export interface DiscountCodeDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  target: string;
  targetIds?: mongoose.Types.ObjectId[];
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const DiscountCodeModel = model<DiscountCodeDocument>('DiscountCode', discountCodeSchema);

