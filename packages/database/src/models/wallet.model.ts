import mongoose from 'mongoose';
import { WalletStatus, WalletTransactionType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const walletTransactionSchema = new Schema({
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
  type: { type: String, enum: Object.values(WalletTransactionType), required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  description: { type: String, maxlength: 500 },
  referenceId: { type: Schema.Types.ObjectId, default: null },
  referenceType: { type: String, default: null },
}, { _id: true, timestamps: true });

const walletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  balance: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'IRR' },
  status: { type: String, enum: Object.values(WalletStatus), default: WalletStatus.ACTIVE },
  transactions: [walletTransactionSchema],
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(walletSchema);

export interface WalletDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  status: string;
  transactions: Array<{
    _id?: mongoose.Types.ObjectId;
    walletId: mongoose.Types.ObjectId;
    type: string;
    amount: number;
    balanceAfter: number;
    description?: string;
    referenceId?: mongoose.Types.ObjectId;
    referenceType?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const WalletModel = model<WalletDocument>('Wallet', walletSchema);

