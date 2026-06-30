import type { UserRole } from '../enums/index.js';

/** DTO کاربر عمومی (بدون داده‌ی حساس) */
export interface UserDto {
  id: string;
  email: string;
  mobile: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO کاربر برای پنل مدیریت */
export interface UserAdminDto extends UserDto {
  lastLoginAt?: Date;
  loginAttempts: number;
  isLocked: boolean;
}

/** DTO ثبت‌نام */
export interface RegisterUserDto {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

/** DTO ورود */
export interface LoginUserDto {
  identifier: string;
  password: string;
}

/** DTO به‌روزرسانی کاربر */
export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  mobile?: string;
  avatarUrl?: string;
  role?: UserRole;
  isActive?: boolean;
}

/** DTO تغییر رمز */
export interface ChangePasswordUserDto {
  currentPassword: string;
  newPassword: string;
}

/** پروفایل استاد */
export interface TeacherProfileDto {
  userId: string;
  bio?: string;
  specialties: string[];
  qualifications: string[];
  experience: number; // years
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
}

/** پروفایل دانشجو */
export interface StudentProfileDto {
  userId: string;
  studentId?: string; // student number
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  enrollments: number;
  completedCourses: number;
  certificates: number;
}
