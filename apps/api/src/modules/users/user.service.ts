import type { FilterQuery } from 'mongoose';
import { UserModel, type UserDocument } from '@amozesh/database';
import {
  Errors,
  UserRole,
  type PaginationQueryInput,
  type PaginatedResult,
  type PaginationMeta,
} from '@amozesh/shared';
import { passwordSchema } from '@amozesh/shared';

/** DTO خروجی کاربر (بدون داده‌ی حساس) */
export interface UserOutDto {
  id: string;
  email: string;
  mobile: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** ورودی sade baraye toDto — ham Document asli, ham FlattenMaps ba lean() */
interface UserPlain {
  _id: { toString(): string };
  email: string;
  mobile: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function toDto(user: UserPlain): UserOutDto {
  return {
    id: user._id.toString(),
    email: user.email,
    mobile: user.mobile,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/** لیست کاربران با صفحه‌بندی، جستجو و فیلتر */
export async function listUsers(
  query: PaginationQueryInput,
  filters: { role?: string; isActive?: boolean } = {},
): Promise<PaginatedResult<UserOutDto>> {
  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.min(query.limit ?? 20, 100);
  const skip = (page - 1) * limit;

  const filter: FilterQuery<UserDocument> = {};
  if (filters.role) filter.role = filters.role;
  if (typeof filters.isActive === 'boolean') filter.isActive = filters.isActive;
  if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { mobile: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortField = query.sort ?? 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;

  const [items, total] = await Promise.all([
    UserModel.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
    UserModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const meta: PaginationMeta = { page, limit, total, totalPages };

  return { items: items.map(toDto), meta };
}

/** گرفتن یک کاربر بر اساس id */
export async function getUserById(id: string): Promise<UserOutDto> {
  const user = await UserModel.findById(id).lean();
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  return toDto(user);
}

/** داده‌ی کاربر جاری (me) */
export async function getMe(userId: string): Promise<UserOutDto> {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  return toDto(user);
}

export interface UpdateUserInput {
  fullName?: string;
  avatarUrl?: string;
}

/** به‌روزرسانی پروفایل (فقط فیلدهای مجاز) */
export async function updateUser(userId: string, input: UpdateUserInput): Promise<UserOutDto> {
  const update: Record<string, unknown> = {};
  if (input.fullName !== undefined) update.fullName = input.fullName.trim();
  if (input.avatarUrl !== undefined) update.avatarUrl = input.avatarUrl;

  const user = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true });
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  return toDto(user);
}

/** به‌روزرسانی نقش (فقط ادمین) */
export async function updateUserRole(userId: string, role: UserRole): Promise<UserOutDto> {
  if (!Object.values(UserRole).includes(role)) {
    throw Errors.badRequest('نقش نامعتبر است');
  }
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true },
  );
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  return toDto(user);
}

/** فعال/غیرفعال‌سازی کاربر */
export async function setUserActive(userId: string, isActive: boolean): Promise<UserOutDto> {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { isActive } },
    { new: true },
  );
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  return toDto(user);
}

/** تغییر رمز عبور */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  // اعتبارسنجی رمز جدید
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) {
    throw Errors.badRequest('رمز جدید ضعیف است', { errors: parsed.error.flatten().fieldErrors });
  }

  const user = await UserModel.findById(userId).select('+password');
  if (!user) throw Errors.notFound('کاربر یافت نشد');

  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw Errors.unauthorized('رمز فعلی نادرست است');

  user.password = newPassword;
  await user.save();
}

/** حذف نرم کاربر */
export async function deleteUser(userId: string): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) throw Errors.notFound('کاربر یافت نشد');
  await user.deleteSoft();
}
