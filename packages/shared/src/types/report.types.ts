import type {
  UserRole,
  CourseType,
  CourseStatus,
  CourseLevel,
  EnrollmentStatus,
  PaymentStatus,
  TransactionType,
  LeadStatus,
  NotificationType,
} from '../enums/index.js';

/** گزارش داشبورد مدیریت */
export interface DashboardStats {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalBranches: number;
    activeEnrollments: number;
    totalRevenue: number;
    monthlyRevenue: number;
    dailyRevenue: number;
  };
  charts: {
    revenueChart: ChartDataPoint[];
    enrollmentChart: ChartDataPoint[];
    studentGrowthChart: ChartDataPoint[];
    coursePopularityChart: ChartDataPoint[];
  };
  recentActivity: ActivityItem[];
  topCourses: TopCourseStats[];
  teacherPerformance: TeacherPerformanceStats[];
}

/** نقطه داده نمودار */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

/** آیتم فعالیت اخیر */
export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
}

/** آمار دوره محبوب */
export interface TopCourseStats {
  courseId: string;
  courseName: string;
  enrollmentsCount: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

/** آمار عملکرد استاد */
export interface TeacherPerformanceStats {
  teacherId: string;
  teacherName: string;
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  completionRate: number;
  totalRevenue: number;
}

/** گزارش حضور و غیاب */
export interface AttendanceReport {
  courseId: string;
  courseName: string;
  sessionId: string;
  sessionTitle: string;
  sessionDate: Date;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
}

/** گزارش عملکرد دانشجو */
export interface StudentPerformanceReport {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  attendanceRate: number;
  averageGrade: number;
  examsTaken: number;
  assignmentsSubmitted: number;
  overallScore: number;
  rank?: number;
}

/** فیلتر پیشرفته دوره */
export interface CourseFilter {
  type?: CourseType[];
  level?: CourseLevel[];
  status?: CourseStatus[];
  teacherId?: string;
  branchId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  search?: string;
}

/** فیلتر پیشرفته کاربر */
export interface UserFilter {
  role?: UserRole[];
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

/** فیلتر پیشرفته ثبت‌نام */
export interface EnrollmentFilter {
  status?: EnrollmentStatus[];
  courseId?: string;
  studentId?: string;
  branchId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/** فیلتر پیشرفته مالی */
export interface FinancialFilter {
  type?: TransactionType[];
  status?: PaymentStatus[];
  userId?: string;
  courseId?: string;
  branchId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

/** فیلتر سرنخ */
export interface LeadFilter {
  status?: LeadStatus[];
  source?: string[];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

/** فیلتر اعلان */
export interface NotificationFilter {
  type?: NotificationType[];
  isRead?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

/** پاسخ استاندارد لیست */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** پاسخ استاندارد تک آیتم */
export interface SingleResponse<T> {
  item: T;
}

/** خروجی ایجاد */
export interface CreatedResponse<T> {
  item: T;
  message: string;
}

/** خروجی به‌روزرسانی */
export interface UpdatedResponse<T> {
  item: T;
  message: string;
}

/** خروجی حذف */
export interface DeletedResponse {
  message: string;
}
