import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

/** مقادیر enum به‌صورت یک آرایه از string برای mongoose */
const roleValues = Object.values(UserRole) as string[];

/** زیر-schema توکن‌های refresh (rotation + revoke) */
const refreshTokenSchema = new Schema(
  {
    tokenId: { type: String, required: true },
    deviceId: { type: String, default: null },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: roleValues, default: UserRole.STUDENT, index: true },
    avatarUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    mobileVerifiedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    refreshTokens: { type: [refreshTokenSchema], default: [], select: false },
    ...baseSchemaFields,
  },
  baseSchemaOptions,
);

applySoftDelete(userSchema);

/** مجازی: آیا حساب قفل است؟ */
userSchema.virtual('isLocked').get(function (this: UserDocument) {
  return !!(this.lockUntil && this.lockUntil instanceof Date && this.lockUntil > new Date());
});

/** رمز عبور را قبل از ذخیره hash کن */
userSchema.pre('save', async function hashPassword(next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = this as any;
  if (!doc.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  doc.password = await bcrypt.hash(doc.password, salt);
  next();
});

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt: Date | null;
  mobileVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  loginAttempts: number;
  lockUntil: Date | null;
  refreshTokens: Array<{
    tokenId: string;
    deviceId: string | null;
    expiresAt: Date;
    createdAt: Date;
    revokedAt: Date | null;
  }>;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  isLocked: boolean;
  comparePassword(candidate: string): Promise<boolean>;
  cleanupRefreshTokens(): this;
}

/** روش استفاده از متدهای نمونه — روی prototype تعریف می‌شوند */
userSchema.methods.comparePassword = function (this: UserDocument, candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.cleanupRefreshTokens = function (this: UserDocument) {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter((t) => t.expiresAt > now && !t.revokedAt);
  return this;
};

export const UserModel = model<UserDocument>('User', userSchema);


