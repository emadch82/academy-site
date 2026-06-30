import type {
  QuestionType,
  ExamStatus,
  ExamSubmissionStatus,
  AssignmentStatus,
  AssignmentSubmissionStatus,
} from '../enums/index.js';

/** DTO آزمون */
export interface ExamDto {
  id: string;
  courseId: string;
  courseName?: string;
  title: string;
  description?: string;
  status: ExamStatus;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  startTime?: Date;
  endTime?: Date;
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO سوال */
export interface QuestionDto {
  id: string;
  examId: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  marks: number;
  explanation?: string;
  order: number;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** گزینه سوال */
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** DTO تکمیل آزمون */
export interface ExamSubmissionDto {
  id: string;
  examId: string;
  examTitle?: string;
  studentId: string;
  studentName?: string;
  status: ExamSubmissionStatus;
  answers: ExamAnswer[];
  score?: number;
  percentage?: number;
  isPassed?: boolean;
  startTime: Date;
  submitTime?: Date;
  durationMinutes?: number;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** پاسخ دانشجو */
export interface ExamAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  marks?: number;
}

/** DTO تکلیف */
export interface AssignmentDto {
  id: string;
  courseId: string;
  courseName?: string;
  sessionId?: string;
  sessionTitle?: string;
  title: string;
  description?: string;
  status: AssignmentStatus;
  dueDate: Date;
  totalMarks: number;
  allowedFileTypes?: string[];
  maxFileSize?: number; // bytes
  maxSubmissions?: number;
  submissionsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO تحویل تکلیف */
export interface AssignmentSubmissionDto {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentId: string;
  studentName?: string;
  status: AssignmentSubmissionStatus;
  files: SubmissionFile[];
  notes?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedByName?: string;
  gradedAt?: Date;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** فایل تحویلی */
export interface SubmissionFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}
