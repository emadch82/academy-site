import mongoose from 'mongoose';
import { PaymentStatus, PaymentProvider, TransactionType } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const invoiceItemSchema = new Schema({
  description: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: true });

const invoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountCode: { type: String, default: null },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'IRR' },
  status: { type: String, enum: ['draft', 'issued', 'paid', 'void'], default: 'draft', index: true },
  issuedAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  notes: { type: String, maxlength: 1000 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(invoiceSchema);

invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ invoiceNumber: 1 });

export interface InvoiceDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId;
  items: Array<{
    _id?: mongoose.Types.ObjectId;
    description: string;
    courseId?: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax: number;
  total: number;
  currency: string;
  status: string;
  issuedAt: Date;
  paidAt?: Date;
  dueDate?: Date;
  notes?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const InvoiceModel = model<InvoiceDocument>('Invoice', invoiceSchema);


const paymentSchema = new Schema({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IRR' },
  provider: { type: String, enum: Object.values(PaymentProvider), required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING, index: true },
  trackingCode: { type: String, default: null },
  referenceCode: { type: String, default: null },
  cardNumber: { type: String, default: null },
  paymentUrl: { type: String, default: null },
  callbackUrl: { type: String, default: null },
  metadata: { type: Schema.Types.Mixed, default: null },
  paidAt: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(paymentSchema);

paymentSchema.index({ invoiceId: 1, status: 1 });
paymentSchema.index({ trackingCode: 1 });

export interface PaymentDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  trackingCode?: string;
  referenceCode?: string;
  cardNumber?: string;
  paymentUrl?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentModel = model<PaymentDocument>('Payment', paymentSchema);


const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: Object.values(TransactionType), required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IRR' },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  provider: { type: String, enum: Object.values(PaymentProvider), default: PaymentProvider.ZARINPAL },
  trackingCode: { type: String, default: null },
  referenceCode: { type: String, default: null },
  description: { type: String, maxlength: 500 },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
  metadata: { type: Schema.Types.Mixed, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(transactionSchema);

transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ createdAt: -1 });

export interface TransactionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  trackingCode?: string;
  referenceCode?: string;
  description?: string;
  courseId?: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const TransactionModel = model<TransactionDocument>('Transaction', transactionSchema);

