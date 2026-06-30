import type { CertificateStatus } from '../enums/index.js';

/** DTO گواهینامه */
export interface CertificateDto {
  id: string;
  serialNumber: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  teacherId?: string;
  teacherName?: string;
  branchId?: string;
  branchName?: string;
  issueDate: Date;
  expiryDate?: Date;
  status: CertificateStatus;
  pdfUrl?: string;
  qrCode?: string;
  verificationUrl?: string;
  digitalSignature?: string;
  metadata?: CertificateMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/** متادیتای گواهینامه */
export interface CertificateMetadata {
  courseDuration?: number;
  courseHours?: number;
  finalGrade?: number;
  attendanceRate?: number;
  skills?: string[];
}

/** درخواست استعلام گواهینامه */
export interface CertificateVerificationDto {
  serialNumber: string;
  isValid: boolean;
  studentName?: string;
  courseName?: string;
  issueDate?: Date;
  status?: CertificateStatus;
  message: string;
}
