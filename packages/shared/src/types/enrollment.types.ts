import type {
  EnrollmentStatus,
  EnrollmentType,
} from '../enums/index.js';

/** DTO ثبت‌نام */
export interface EnrollmentDto {
  id: string;
  studentId: string;
  studentName?: string;
  studentMobile?: string;
  courseId: string;
  courseName?: string;
  branchId?: string;
  branchName?: string;
  classroomId?: string;
  classroomName?: string;
  seatId?: string;
  seatLabel?: string;
  status: EnrollmentStatus;
  type: EnrollmentType;
  startDate: Date;
  endDate?: Date;
  invoiceId?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO برنامه هفتگی */
export interface CourseScheduleDto {
  id: string;
  courseId: string;
  courseName?: string;
  classroomId: string;
  classroomName?: string;
  branchId: string;
  branchName?: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  teacherId: string;
  teacherName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
