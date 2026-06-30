import type {
  SessionStatus,
  SessionType,
  AttendanceStatus,
  AttendanceMethod,
} from '../enums/index.js';

/** DTO جلسه کلاس */
export interface ClassSessionDto {
  id: string;
  courseId: string;
  courseName?: string;
  classroomId?: string;
  classroomName?: string;
  branchId?: string;
  branchName?: string;
  teacherId: string;
  teacherName?: string;
  title: string;
  description?: string;
  type: SessionType;
  status: SessionStatus;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isOnline: boolean;
  meetingUrl?: string;
  recordingUrl?: string;
  materials?: SessionMaterial[];
  attendanceCount?: number;
  totalStudents?: number;
  createdAt: Date;
  updatedAt: Date;
}

/** فایل ضمیمه جلسه */
export interface SessionMaterial {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

/** DTO حضور و غیاب */
export interface AttendanceDto {
  id: string;
  sessionId: string;
  sessionTitle?: string;
  studentId: string;
  studentName?: string;
  studentMobile?: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  markedBy?: string;
  markedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** گزارش حضور و غیاب دانشجو */
export interface AttendanceReportDto {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number; // percentage
}
