import { z } from 'zod';

/** اعتبارسنجی ایجاد شعبه */
export const createBranchSchema = z.object({
  name: z.string().trim().min(2, 'نام شعبه الزامی است').max(100),
  address: z.string().trim().min(5, 'آدرس الزامی است').max(500),
  city: z.string().trim().min(2).max(50),
  province: z.string().trim().min(2).max(50),
  postalCode: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقمی باشد').optional(),
  phone: z.string().regex(/^\d{8,11}$/, 'شماره تلفن معتبر نیست'),
  mobile: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست').optional(),
  email: z.string().email('ایمیل معتبر نیست').optional(),
  managerId: z.string().optional(),
  openingHours: z.any().optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  facilities: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

/** اعتبارسنجی ایجاد کلاس */
export const createClassroomSchema = z.object({
  branchId: z.string().min(1, 'شعبه الزامی است'),
  name: z.string().trim().min(2).max(50),
  floor: z.number().int().min(-5).max(50).optional(),
  capacity: z.number().int().min(1, 'ظرفیت باید حداقل ۱ باشد').max(500),
  type: z.enum(['regular', 'computer', 'lab', 'conference', 'workshop']),
  facilities: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional(),
});

export const updateClassroomSchema = createClassroomSchema.partial();

/** اعتبارسنجی ایجاد دوره */
export const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'عنوان دوره الزامی است').max(200),
  summary: z.string().trim().min(10).max(500),
  description: z.string().max(10000).optional(),
  type: z.enum(['in_person', 'live_online', 'offline', 'hybrid']),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']),
  categoryId: z.string().optional(),
  teacherId: z.string().min(1, 'مدرس الزامی است'),
  branchId: z.string().optional(),
  price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  discountPrice: z.number().min(0).optional(),
  currency: z.string().default('IRR'),
  durationMinutes: z.number().int().min(1),
  sessionsCount: z.number().int().min(1),
  capacity: z.number().int().min(1).optional(),
  reservationCapacity: z.number().int().min(0).optional(),
  prerequisites: z.array(z.string()).optional(),
  syllabus: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    durationMinutes: z.number().int().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional(),
  introVideoUrl: z.string().url().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isFeatured: z.boolean().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

/** اعتبارسنجی ایجاد جلسه */
export const createSessionSchema = z.object({
  courseId: z.string().min(1),
  classroomId: z.string().optional(),
  branchId: z.string().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['in_person', 'live_online', 'offline']),
  date: z.coerce.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت زمان نادرست است'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت زمان نادرست است'),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().url().optional(),
});

export const updateSessionSchema = createSessionSchema.partial();

/** اعتبارسنجی ایجاد آزمون */
export const createExamSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(3).max(200),
  description: z.string().max(2000).optional(),
  durationMinutes: z.number().int().min(1).max(600),
  totalMarks: z.number().int().min(1),
  passingMarks: z.number().int().min(0),
  negativeMarking: z.boolean().default(false),
  negativeMarkValue: z.number().min(0).max(10).default(0),
  maxAttempts: z.number().int().min(1).max(10).default(1),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const updateExamSchema = createExamSchema.partial();

/** اعتبارسنجی ایجاد سوال */
export const createQuestionSchema = z.object({
  examId: z.string().min(1),
  type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank', 'file_based']),
  text: z.string().min(1, 'متن سوال الزامی است'),
  options: z.array(z.object({
    text: z.string().min(1),
    isCorrect: z.boolean(),
  })).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  marks: z.number().int().min(1),
  explanation: z.string().max(2000).optional(),
  order: z.number().int().min(0),
  fileUrl: z.string().url().optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

/** اعتبارسنجی ثبت نمره */
export const submitGradeSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
  grade: z.number().min(0),
  maxGrade: z.number().min(1),
  notes: z.string().max(1000).optional(),
});

/** اعتبارسنجی ثبت حضور و غیاب */
export const markAttendanceSchema = z.object({
  sessionId: z.string().min(1),
  studentId: z.string().min(1),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  method: z.enum(['qr_code', 'manual', 'online', 'biometric']),
  notes: z.string().max(500).optional(),
});

/** اعتبارسنجی ثبت‌نام */
export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  branchId: z.string().optional(),
  classroomId: z.string().optional(),
  seatId: z.string().optional(),
  type: z.enum(['online', 'offline', 'phone', 'walk_in']),
  notes: z.string().max(1000).optional(),
});

/** اعتبارسنجی ایجاد فاکتور */
export const createInvoiceSchema = z.object({
  userId: z.string().min(1),
  items: z.array(z.object({
    description: z.string().min(1),
    courseId: z.string().optional(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
    discount: z.number().min(0).default(0),
  })).min(1, 'حداقل یک آیتم الزامی است'),
  discount: z.number().min(0).default(0),
  discountCode: z.string().optional(),
  tax: z.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
  dueDate: z.coerce.date().optional(),
});

/** اعتبارسنجی ایجاد سرنخ */
export const createLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
  email: z.string().email().optional(),
  source: z.enum(['website', 'phone', 'walk_in', 'referral', 'social_media', 'advertisement', 'campaign', 'other']),
  interestedCourses: z.array(z.string()).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

/** اعتبارسنجی ایجاد تخفیف */
export const createDiscountSchema = z.object({
  code: z.string().trim().min(3).max(50).toUpperCase(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1),
  target: z.enum(['all', 'course', 'category', 'user', 'first_purchase']),
  targetIds: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const updateDiscountSchema = createDiscountSchema.partial();

/** اعتبارسنجی ایجاد کمپین */
export const createCampaignSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['sms', 'email', 'push']),
  targetAudience: z.array(z.string()).min(1),
  content: z.string().min(1).max(5000),
  scheduledAt: z.coerce.date().optional(),
});

/** اعتبارسنجی ایجاد مقاله */
export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(10).max(500),
  content: z.string().min(50),
  type: z.enum(['page', 'article', 'news', 'faq', 'banner', 'gallery', 'testimonial']),
  tags: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

/** اعتبارسنجی ایجاد بنر */
export const createBannerSchema = z.object({
  title: z.string().trim().min(1).max(100),
  subtitle: z.string().max(200).optional(),
  imageUrl: z.string().url('آدرس تصویر الزامی است'),
  linkUrl: z.string().url().optional(),
  type: z.enum(['hero', 'sidebar', 'popup', 'inline']),
  position: z.string().optional(),
  order: z.number().int().min(0).default(0),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();

/** اعتبارسنجی ایجاد پیام */
export const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  recipientId: z.string().min(1),
  content: z.string().min(1).max(5000),
  type: z.enum(['text', 'file', 'image']).default('text'),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

/** اعتبارسنجی پرداخت */
export const initiatePaymentSchema = z.object({
  invoiceId: z.string().min(1),
  provider: z.enum(['zarinpal', 'idpay', 'wallet']),
  callbackUrl: z.string().url().optional(),
});

/** اعتبارسنجی ایجاد تکلیف */
export const createAssignmentSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(3).max(200),
  description: z.string().max(5000).optional(),
  type: z.enum(['text', 'file', 'quiz', 'project']),
  totalMarks: z.number().int().min(1),
  deadline: z.coerce.date().optional(),
  attachments: z.array(z.object({
    fileName: z.string().min(1),
    fileUrl: z.string().url(),
    fileSize: z.number().int().min(0),
  })).optional(),
  rubric: z.array(z.object({
    criterion: z.string().min(1),
    maxScore: z.number().int().min(1),
    description: z.string().optional(),
  })).optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();
