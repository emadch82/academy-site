import mongoose from 'mongoose';

/** فیلدهای مشترک هر سند (timestamps + soft delete + audit) */
export interface IBaseDocument {
  createdAt: Date;
  updatedAt: Date;
  /** soft delete */
  deletedAt?: Date | null;
  isDeleted: boolean;
  /** چه کسی ایجاد کرده (audit) */
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

export type BaseDocument<T = unknown> = mongoose.Document<unknown, unknown, T & IBaseDocument> &
  IBaseDocument &
  T;

/**
 * BaseSchema — شامل timestamps، soft-delete و فیلدهای audit.
 * همه‌ی schema های اصلی این فیلدها را به‌صورت مستقیم در schema خود اضافه می‌کنند
 * (ترجیح بر تعریف یکپارچه به‌جای clone برای حفظ type-safety).
 */
export const baseSchemaFields = {
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
} as const;

/** گزینه‌های مشترک schema (timestamps + transform پاک‌سازی) */
export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.deletedAt;
      return ret;
    },
  },
  toObject: { virtuals: true },
} as const;

/** متدها و قلاب‌های soft-delete که روی هر schema اعمال می‌شوند */
export function applySoftDelete(schema: mongoose.Schema): void {
  schema.methods.deleteSoft = function (this: mongoose.Document & {
    isDeleted: boolean;
    deletedAt: Date | null;
  }) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function (this: mongoose.Document & {
    isDeleted: boolean;
    deletedAt: Date | null;
  }) {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  // به‌صورت پیش‌فرض اسناد حذف‌شده را فیلتر کن
  schema.pre('find', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = this as any;
    if (q.getOptions?.().includeDeleted) return next();
    q.where({ isDeleted: { $ne: true } });
    next();
  });
  schema.pre('findOne', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = this as any;
    if (q.getOptions?.().includeDeleted) return next();
    q.where({ isDeleted: { $ne: true } });
    next();
  });
  schema.pre('countDocuments', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).where({ isDeleted: { $ne: true } });
    next();
  });
}

declare module 'mongoose' {
  interface Document {
    deleteSoft(): Promise<this>;
    restore(): Promise<this>;
  }
}
