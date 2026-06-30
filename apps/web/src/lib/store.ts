export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: 'admin' | 'staff' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  category: string;
  price: number;
  capacity: number;
  enrolledCount: number;
  status: 'active' | 'inactive' | 'draft';
  imageUrl: string;
  level: string;
  duration: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'all' | 'course' | 'individual';
  status: 'sent' | 'draft';
  read: boolean;
  date: string;
}

export interface Attendance {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  day: string;
  time: string;
  room: string;
}

export interface Review {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: 'open' | 'closed';
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  type: 'register' | 'login' | 'purchase' | 'review' | 'enrollment' | 'system';
  userId: string;
  userName: string;
  detail: string;
  meta?: string;
  timestamp: string;
}

const STORAGE_KEY = 'amz_db';

function getDB(): Record<string, any[]> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveDB(db: Record<string, any[]>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getCollection<T>(name: string): T[] {
  return (getDB()[name] || []) as T[];
}

function setCollection<T>(name: string, data: T[]) {
  const db = getDB();
  db[name] = data;
  saveDB(db);
}

function addItem<T extends { id: string }>(name: string, item: T): T {
  const items = getCollection<T>(name);
  items.push(item);
  setCollection(name, items);
  return item;
}

function updateItem<T extends { id: string }>(name: string, id: string, updates: Partial<T>): T | null {
  const items = getCollection<T>(name);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  setCollection(name, items);
  return items[index];
}

function deleteItem<T extends { id: string }>(name: string, id: string): boolean {
  const items = getCollection<T>(name);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  setCollection(name, filtered);
  return true;
}

// ──── SEED DATA ────

const SEED_USERS: User[] = [
  { id: 'u1', fullName: 'مدیر سیستم', email: 'admin@najvaaca.ir', mobile: '09131234567', password: 'admin', role: 'admin', status: 'active', joinDate: '۱۴۰۳/۰۱/۰۱' },
  { id: 'u2', fullName: 'دکتر احمد رضایی', email: 'rezaei@najvaaca.ir', mobile: '09132345678', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۲/۱۵' },
  { id: 'u3', fullName: 'سارا رضایی', email: 'sara@najvaaca.ir', mobile: '09133456789', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۳/۱۰' },
  { id: 'u4', fullName: 'لیلا نوری', email: 'nouri@najvaaca.ir', mobile: '09134567890', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۴/۰۵' },
  { id: 'u5', fullName: 'رضا عباسی', email: 'abbasi@najvaaca.ir', mobile: '09135678901', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۵/۲۰' },
  { id: 'u6', fullName: 'مریم حسینی', email: 'hosseini@najvaaca.ir', mobile: '09136789012', password: 'teacher', role: 'teacher', status: 'inactive', joinDate: '۱۴۰۳/۰۶/۰۱' },
  { id: 'u7', fullName: 'علی محمدی', email: 'ali@gmail.com', mobile: '09137890123', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۱/۱۰' },
  { id: 'u8', fullName: 'سارا احمدی', email: 'sara.ahmadi@gmail.com', mobile: '09138901234', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۱/۱۵' },
  { id: 'u9', fullName: 'رضا حسینی', email: 'reza.h@gmail.com', mobile: '09139012345', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۲/۰۱' },
  { id: 'u10', fullName: 'نیلوفر احمدی', email: 'niloofar@gmail.com', mobile: '09130123456', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۲/۲۰' },
  { id: 'u11', fullName: 'علی رضایی', email: 'ali.rezaei@gmail.com', mobile: '09131234500', password: 'user', role: 'student', status: 'pending', joinDate: '۱۴۰۴/۰۳/۰۵' },
  { id: 'u12', fullName: 'زهرا کریمی', email: 'zahra@gmail.com', mobile: '09132345600', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۳/۱۰' },
  { id: 'u13', fullName: 'امیر محمدی', email: 'amir@gmail.com', mobile: '09133456700', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۴/۰۱' },
  { id: 'u14', fullName: 'فاطمه عباسی', email: 'fateme@gmail.com', mobile: '09134567800', password: 'user', role: 'student', status: 'inactive', joinDate: '۱۴۰۴/۰۴/۱۵' },
  { id: 'u15', fullName: 'امین رستمی', email: 'amin@gmail.com', mobile: '09135678900', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۴/۰۵/۰۱' },
  { id: 'u16', fullName: ' Staff Test', email: 'staff@najvaaca.ir', mobile: '09136789000', password: 'staff', role: 'staff', status: 'active', joinDate: '۱۴۰۳/۰۷/۰۱' },
];

const TEACHER_IMAGES: Record<string, string> = {
  u2: '/images/teacher1.jpg',
  u3: '/images/teacher2.jpg',
  u4: '/images/teacher3.jpg',
  u5: '/images/teacher4.jpg',
  u6: '/images/teacher5.jpg',
};

const COURSE_IMAGES: Record<string, string> = {
  'ai': '/images/ai.jpg',
  'react': '/images/react.jpg',
  'web': '/images/web.jpg',
  'english': '/images/english.jpg',
  'robotics': '/images/robotics.jpg',
  'speech': '/images/speech.jpg',
  'painting': '/images/painting.jpg',
  'pm': '/images/pm.jpg',
  'graphics': '/images/graphics.jpg',
  'python': '/images/python.jpg',
  'database': '/images/database.jpg',
};

const SEED_COURSES: Course[] = [
  { id: 'c1', title: 'دوره جامع هوش مصنوعی', teacherId: 'u2', teacherName: 'دکتر احمد رضایی', category: 'هوش مصنوعی', price: 2500000, capacity: 20, enrolledCount: 45, status: 'active', imageUrl: COURSE_IMAGES.ai, level: 'پیشرفته', duration: '۳۰ جلسه' },
  { id: 'c2', title: 'طراحی سایت با React', teacherId: 'u3', teacherName: 'سارا رضایی', category: 'برنامه‌نویسی', price: 2000000, capacity: 25, enrolledCount: 38, status: 'active', imageUrl: COURSE_IMAGES.react, level: 'متوسط', duration: '۲۴ جلسه' },
  { id: 'c3', title: 'زبان انگلیسی تخصصی', teacherId: 'u4', teacherName: 'لیلا نوری', category: 'زبان', price: 1500000, capacity: 30, enrolledCount: 32, status: 'active', imageUrl: COURSE_IMAGES.english, level: 'همه سطوح', duration: '۲۰ جلسه' },
  { id: 'c4', title: 'رباتیک ویژه', teacherId: 'u5', teacherName: 'رضا عباسی', category: 'رباتیک', price: 1800000, capacity: 15, enrolledCount: 20, status: 'active', imageUrl: COURSE_IMAGES.robotics, level: 'متوسط', duration: '۱۶ جلسه' },
  { id: 'c5', title: 'فن بیان و ارائه', teacherId: 'u6', teacherName: 'مریم حسینی', category: 'مهارت', price: 800000, capacity: 20, enrolledCount: 25, status: 'active', imageUrl: COURSE_IMAGES.speech, level: 'مبتدی', duration: '۱۰ جلسه' },
  { id: 'c6', title: 'نقاشی دیجیتال', teacherId: 'u3', teacherName: 'سارا رضایی', category: 'هنر', price: 1200000, capacity: 15, enrolledCount: 15, status: 'active', imageUrl: COURSE_IMAGES.painting, level: 'مبتدی', duration: '۱۲ جلسه' },
  { id: 'c7', title: 'مدیریت پروژه', teacherId: 'u2', teacherName: 'دکتر احمد رضایی', category: 'مدیریت', price: 1000000, capacity: 25, enrolledCount: 18, status: 'active', imageUrl: COURSE_IMAGES.pm, level: 'متوسط', duration: '۱۴ جلسه' },
  { id: 'c8', title: 'طراحی گرافیک', teacherId: 'u3', teacherName: 'سارا رضایی', category: 'گرافیک', price: 1500000, capacity: 20, enrolledCount: 22, status: 'active', imageUrl: COURSE_IMAGES.graphics, level: 'مبتدی', duration: '۱۸ جلسه' },
  { id: 'c9', title: 'برنامه‌نویسی پایتون', teacherId: 'u2', teacherName: 'دکتر احمد رضایی', category: 'برنامه‌نویسی', price: 1800000, capacity: 20, enrolledCount: 28, status: 'active', imageUrl: COURSE_IMAGES.python, level: 'مبتدی', duration: '۲۲ جلسه' },
  { id: 'c10', title: 'پایگاه داده', teacherId: 'u5', teacherName: 'رضا عباسی', category: 'برنامه‌نویسی', price: 1200000, capacity: 20, enrolledCount: 12, status: 'draft', imageUrl: COURSE_IMAGES.database, level: 'متوسط', duration: '۱۶ جلسه' },
  { id: 'c11', title: 'مبانی طراحی وب', teacherId: 'u3', teacherName: 'سارا رضایی', category: 'برنامه‌نویسی', price: 900000, capacity: 30, enrolledCount: 35, status: 'active', imageUrl: COURSE_IMAGES.web, level: 'مبتدی', duration: '۱۲ جلسه' },
];

const SEED_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', studentId: 'u7', studentName: 'علی محمدی', courseId: 'c1', courseName: 'دوره جامع هوش مصنوعی', date: '۱۴۰۴/۰۶/۱۵', status: 'confirmed', amount: 2500000 },
  { id: 'e2', studentId: 'u8', studentName: 'سارا احمدی', courseId: 'c2', courseName: 'طراحی سایت با React', date: '۱۴۰۴/۰۶/۱۰', status: 'confirmed', amount: 2000000 },
  { id: 'e3', studentId: 'u9', studentName: 'رضا حسینی', courseId: 'c3', courseName: 'زبان انگلیسی تخصصی', date: '۱۴۰۴/۰۶/۰۵', status: 'confirmed', amount: 1500000 },
  { id: 'e4', studentId: 'u10', studentName: 'نیلوفر احمدی', courseId: 'c4', courseName: 'رباتیک ویژه', date: '۱۴۰۴/۰۵/۲۰', status: 'confirmed', amount: 1800000 },
  { id: 'e5', studentId: 'u11', studentName: 'علی رضایی', courseId: 'c5', courseName: 'فن بیان و ارائه', date: '۱۴۰۴/۰۵/۱۵', status: 'pending', amount: 800000 },
  { id: 'e6', studentId: 'u12', studentName: 'زهرا کریمی', courseId: 'c1', courseName: 'دوره جامع هوش مصنوعی', date: '۱۴۰۴/۰۵/۱۰', status: 'confirmed', amount: 2500000 },
  { id: 'e7', studentId: 'u13', studentName: 'امیر محمدی', courseId: 'c9', courseName: 'برنامه‌نویسی پایتون', date: '۱۴۰۴/۰۵/۰۵', status: 'confirmed', amount: 1800000 },
  { id: 'e8', studentId: 'u14', studentName: 'فاطمه عباسی', courseId: 'c6', courseName: 'نقاشی دیجیتال', date: '۱۴۰۴/۰۴/۲۰', status: 'cancelled', amount: 1200000 },
  { id: 'e9', studentId: 'u15', studentName: 'امین رستمی', courseId: 'c7', courseName: 'مدیریت پروژه', date: '۱۴۰۴/۰۴/۱۵', status: 'confirmed', amount: 1000000 },
  { id: 'e10', studentId: 'u7', studentName: 'علی محمدی', courseId: 'c9', courseName: 'برنامه‌نویسی پایتون', date: '۱۴۰۴/۰۴/۱۰', status: 'confirmed', amount: 1800000 },
];

const SEED_ATTENDANCE: Attendance[] = [
  { id: 'a1', courseId: 'c1', studentId: 'u7', studentName: 'علی محمدی', date: '۱۴۰۴/۰۶/۱۵', status: 'present' },
  { id: 'a2', courseId: 'c1', studentId: 'u12', studentName: 'زهرا کریمی', date: '۱۴۰۴/۰۶/۱۵', status: 'present' },
  { id: 'a3', courseId: 'c1', studentId: 'u7', studentName: 'علی محمدی', date: '۱۴۰۴/۰۶/۰۸', status: 'late' },
  { id: 'a4', courseId: 'c1', studentId: 'u12', studentName: 'زهرا کریمی', date: '۱۴۰۴/۰۶/۰۸', status: 'absent' },
  { id: 'a5', courseId: 'c2', studentId: 'u8', studentName: 'سارا احمدی', date: '۱۴۰۴/۰۶/۱۴', status: 'present' },
  { id: 'a6', courseId: 'c2', studentId: 'u8', studentName: 'سارا احمدی', date: '۱۴۰۴/۰۶/۰۷', status: 'present' },
  { id: 'a7', courseId: 'c9', studentId: 'u13', studentName: 'امیر محمدی', date: '۱۴۰۴/۰۶/۱۲', status: 'present' },
  { id: 'a8', courseId: 'c9', studentId: 'u7', studentName: 'علی محمدی', date: '۱۴۰۴/۰۶/۱۲', status: 'absent' },
];

const SEED_SCHEDULE: Schedule[] = [
  { id: 'sch1', courseId: 'c1', courseName: 'دوره جامع هوش مصنوعی', teacherId: 'u2', day: 'شنبه', time: '۱۶:۰۰ - ۱۸:۰۰', room: 'کلاس ۱' },
  { id: 'sch2', courseId: 'c7', courseName: 'مدیریت پروژه', teacherId: 'u2', day: 'یکشنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کلاس ۲' },
  { id: 'sch3', courseId: 'c9', courseName: 'برنامه‌نویسی پایتون', teacherId: 'u2', day: 'دوشنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کلاس ۱' },
  { id: 'sch4', courseId: 'c2', courseName: 'طراحی سایت با React', teacherId: 'u3', day: 'شنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کلاس ۳' },
  { id: 'sch5', courseId: 'c6', courseName: 'نقاشی دیجیتال', teacherId: 'u3', day: 'سه‌شنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کارگاه ۱' },
  { id: 'sch6', courseId: 'c8', courseName: 'طراحی گرافیک', teacherId: 'u3', day: 'چهارشنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کارگاه ۱' },
  { id: 'sch7', courseId: 'c11', courseName: 'مبانی طراحی وب', teacherId: 'u3', day: 'پنجشنبه', time: '۰۸:۰۰ - ۱۰:۰۰', room: 'کلاس ۳' },
  { id: 'sch8', courseId: 'c3', courseName: 'زبان انگلیسی تخصصی', teacherId: 'u4', day: 'یکشنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کلاس ۴' },
  { id: 'sch9', courseId: 'c4', courseName: 'رباتیک ویژه', teacherId: 'u5', day: 'دوشنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کارگاه رباتیک' },
];

const SEED_REVIEWS: Review[] = [
  { id: 'rv1', courseId: 'c1', courseName: 'دوره جامع هوش مصنوعی', studentId: 'u7', studentName: 'علی محمدی', rating: 5, comment: 'عالی بود، محتوا خیلی خوب و کاربردی بود', date: '۱۴۰۴/۰۶/۱۵' },
  { id: 'rv2', courseId: 'c1', courseName: 'دوره جامع هوش مصنوعی', studentId: 'u12', studentName: 'زهرا کریمی', rating: 4, comment: 'خیلی خوب بود ولی سرعت تدریس کمی بالا بود', date: '۱۴۰۴/۰۶/۱۰' },
  { id: 'rv3', courseId: 'c2', courseName: 'طراحی سایت با React', studentId: 'u8', studentName: 'سارا احمدی', rating: 5, comment: 'بهترین دوره‌ای بود که شرکت کردم', date: '۱۴۰۴/۰۶/۱۲' },
  { id: 'rv4', courseId: 'c9', courseName: 'برنامه‌نویسی پایتون', studentId: 'u13', studentName: 'امیر محمدی', rating: 4, comment: 'مطالب خوب بود، پروژه عملی هم داشت', date: '۱۴۰۴/۰۶/۰۸' },
  { id: 'rv5', courseId: 'c9', courseName: 'برنامه‌نویسی پایتون', studentId: 'u7', studentName: 'علی محمدی', rating: 3, comment: 'متوسط بود، انتظار بیشتری داشتم', date: '۱۴۰۴/۰۵/۲۰' },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', userId: 'u7', userName: 'علی محمدی', type: 'income', amount: 2500000, description: 'شهریه دوره هوش مصنوعی', date: '۱۴۰۴/۰۶/۱۵', status: 'completed', paymentMethod: 'آنلاین' },
  { id: 't2', userId: 'u8', userName: 'سارا احمدی', type: 'income', amount: 2000000, description: 'شهریه دوره React', date: '۱۴۰۴/۰۶/۱۰', status: 'completed', paymentMethod: 'کارت به کارت' },
  { id: 't3', userId: 'u9', userName: 'رضا حسینی', type: 'income', amount: 1500000, description: 'شهریه دوره زبان', date: '۱۴۰۴/۰۶/۰۵', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't4', userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 500000, description: 'اجاره محل', date: '۱۴۰۴/۰۶/۰۱', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't5', userId: 'u10', userName: 'نیلوفر احمدی', type: 'income', amount: 1800000, description: 'شهریه دوره رباتیک', date: '۱۴۰۴/۰۵/۲۰', status: 'completed', paymentMethod: 'آنلاین' },
  { id: 't6', userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 200000, description: 'تبلیغات اینستاگرام', date: '۱۴۰۴/۰۵/۱۵', status: 'completed', paymentMethod: 'کارت به کارت' },
  { id: 't7', userId: 'u12', userName: 'زهرا کریمی', type: 'income', amount: 2500000, description: 'شهریه دوره هوش مصنوعی', date: '۱۴۰۴/۰۵/۱۰', status: 'completed', paymentMethod: 'اقساطی' },
  { id: 't8', userId: 'u13', userName: 'امیر محمدی', type: 'income', amount: 1800000, description: 'شهریه دوره پایتون', date: '۱۴۰۴/۰۵/۰۵', status: 'completed', paymentMethod: 'آنلاین' },
  { id: 't9', userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 150000, description: 'لوازم التحریر', date: '۱۴۰۴/۰۴/۲۰', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't10', userId: 'u15', userName: 'امین رستمی', type: 'income', amount: 1000000, description: 'شهریه دوره مدیریت پروژه', date: '۱۴۰۴/۰۴/۱۵', status: 'completed', paymentMethod: 'نقدی' },
];

const SEED_BLOG_POSTS: BlogPost[] = [
  { id: 'bp1', title: 'آینده هوش مصنوعی در آموزش', excerpt: 'هوش مصنوعی در حال تغییر چهره آموزش است. از سیستم‌های توصیه‌گر شخصی‌سازی‌شده گرفته تا ارزیابی خودکار، این فناوری فرصت‌های بی‌نظیری برای یادگیرندگان فراهم می‌کند.', category: 'هوش مصنوعی', author: 'دکتر احمد رضایی', status: 'published', date: '۱۴۰۵/۰۳/۱۵' },
  { id: 'bp2', title: 'نکات کلیدی یادگیری برنامه‌نویسی', excerpt: 'برنامه‌نویسی یک مهارت ارزشمند در دنیای امروز است. در این مقاله با بهترین روش‌های یادگیری برنامه‌نویسی، از مبتدی تا پیشرفته، آشنا می‌شوید.', category: 'برنامه‌نویسی', author: 'سارا رضایی', status: 'published', date: '۱۴۰۵/۰۳/۱۰' },
  { id: 'bp3', title: 'چرا باید رباتیک یاد بگیریم؟', excerpt: 'رباتیک آینده صنعت و فناوری را شکل می‌دهد. یادگیری رباتیک نه تنها مهارت‌های فنی را تقویت می‌کند، بلکه تفکر خلاق و حل مسئله را نیز پرورش می‌دهد.', category: 'رباتیک', author: 'رضا عباسی', status: 'published', date: '۱۴۰۵/۰۳/۰۵' },
  { id: 'bp4', title: 'راهکارهای مؤثر یادگیری زبان انگلیسی', excerpt: 'یادگیری زبان انگلیسی نیازمند استمرار و تمرین منظم است. در این مقاله روش‌های علمی و کاربردی برای تسلط بر زبان انگلیسی ارائه شده است.', category: 'زبان', author: 'لیلا نوری', status: 'draft', date: '۱۴۰۵/۰۲/۲۸' },
  { id: 'bp5', title: 'مبانی طراحی وب مدرن', excerpt: 'طراحی وب با استفاده از فریمورک‌های مدرن مانند React و Tailwind CSS ساده‌تر از همیشه شده است. با مفاهیم پایه و اصول طراحی واکنش‌گرا آشنا شوید.', category: 'طراحی وب', author: 'سارا رضایی', status: 'published', date: '۱۴۰۵/۰۲/۲۰' },
  { id: 'bp6', title: 'نقش مدیریت پروژه در موفقیت آموزشی', excerpt: 'مدیریت پروژه مهارتی کلیدی برای هر دانشجو و حرفه‌ای است. با اصول مدیریت پروژه و ابزارهای مدرن آشنا شوید و بهره‌وری خود را افزایش دهید.', category: 'مدیریت', author: 'دکتر احمد رضایی', status: 'draft', date: '۱۴۰۵/۰۲/۱۵' },
];

const SEED_CHATS: Chat[] = [
  { id: 'ch1', userId: 'u7', userName: 'علی محمدی', subject: 'سوال درباره دوره React', status: 'open', unreadCount: 2, createdAt: '۱۴۰۴/۰۶/۱۵ ۱۰:۳۰', updatedAt: '۱۴۰۴/۰۶/۱۵ ۱۱:۰۰' },
  { id: 'ch2', userId: 'u8', userName: 'سارا احمدی', subject: 'مشکل پرداخت شهریه', status: 'open', unreadCount: 0, createdAt: '۱۴۰۴/۰۶/۱۴ ۱۴:۰۰', updatedAt: '۱۴۰۴/۰۶/۱۴ ۱۵:۳۰' },
  { id: 'ch3', userId: 'u9', userName: 'رضا حسینی', subject: 'زمان کلاس زبان', status: 'open', unreadCount: 1, createdAt: '۱۴۰۴/۰۶/۱۳ ۰۹:۰۰', updatedAt: '۱۴۰۴/۰۶/۱۳ ۰۹:۴۵' },
  { id: 'ch4', userId: 'u10', userName: 'نیلوفر احمدی', subject: 'شارژ کیف پول', status: 'closed', unreadCount: 0, createdAt: '۱۴۰۴/۰۶/۱۲ ۱۶:۰۰', updatedAt: '۱۴۰۴/۰۶/۱۲ ۱۶:۳۰' },
];

const SEED_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'cm1', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'سلام، میخواستم بدونم دوره React هنوز ثبت‌نام داره؟', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۳۰' },
  { id: 'cm2', chatId: 'ch1', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام علی جان، بله دوره React فعال هست و میتونید ثبت‌نام کنید.', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۳۵' },
  { id: 'cm3', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'ممنون. قیمت دوره چنده؟ امکان پرداخت اقساطی هست؟', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۴۰' },
  { id: 'cm4', chatId: 'ch1', sender: 'admin', senderName: 'پشتیبانی', text: 'قیمت دوره ۲,۰۰۰,۰۰۰ تومان هست. بله امکان پرداخت اقساطی هم داریم.', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۴۵' },
  { id: 'cm5', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'عالیه! پس من ثبت‌نام میکنم.', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۱:۰۰' },

  { id: 'cm6', chatId: 'ch2', sender: 'user', senderName: 'سارا احمدی', text: 'سلام، من شهریه دوره React رو پرداخت کردم ولی هنوز ثبت‌نامم تأیید نشده.', timestamp: '۱۴۰۴/۰۶/۱۴ ۱۴:۰۰' },
  { id: 'cm7', chatId: 'ch2', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام سارا خانم، لطفاً شماره پیگیری پرداختتون رو بفرستید.', timestamp: '۱۴۰۴/۰۶/۱۴ ۱۴:۰۵' },
  { id: 'cm8', chatId: 'ch2', sender: 'user', senderName: 'سارا احمدی', text: 'شماره پیگیری: ۱۲۳۴۵۶۷۸۹', timestamp: '۱۴۰۴/۰۶/۱۴ ۱۴:۱۰' },
  { id: 'cm9', chatId: 'ch2', sender: 'admin', senderName: 'پشتیبانی', text: 'ممنون، بررسی شد. ثبت‌نام شما تأیید شد. 🎉', timestamp: '۱۴۰۴/۰۶/۱۴ ۱۵:۳۰' },

  { id: 'cm10', chatId: 'ch3', sender: 'user', senderName: 'رضا حسینی', text: 'سلام، کلاس زبان فردا ساعت چنده؟', timestamp: '۱۴۰۴/۰۶/۱۳ ۰۹:۰۰' },
  { id: 'cm11', chatId: 'ch3', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام رضا جان، کلاس زبان فردا ساعت ۱۴:۰۰ هست.', timestamp: '۱۴۰۴/۰۶/۱۳ ۰۹:۰۵' },
  { id: 'cm12', chatId: 'ch3', sender: 'user', senderName: 'رضا حسینی', text: 'ممنون. اگه نتونم بیام مشکلی پیش نمیاد؟', timestamp: '۱۴۰۴/۰۶/۱۳ ۰۹:۴۵' },

  { id: 'cm13', chatId: 'ch4', sender: 'user', senderName: 'نیلوفر احمدی', text: 'میخواستم کیف پولم رو شارژ کنم ولی نمیتونم.', timestamp: '۱۴۰۴/۰۶/۱۲ ۱۶:۰۰' },
  { id: 'cm14', chatId: 'ch4', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام نیلوفر خانم، لطفاً اسکرین‌شات خطا رو بفرستید.', timestamp: '۱۴۰۴/۰۶/۱۲ ۱۶:۰۵' },
  { id: 'cm15', chatId: 'ch4', sender: 'user', senderName: 'نیلوفر احمدی', text: 'تصویر رو فرستادم. ممنون میشم کمک کنید.', timestamp: '۱۴۰۴/۰۶/۱۲ ۱۶:۱۵' },
  { id: 'cm16', chatId: 'ch4', sender: 'admin', senderName: 'پشتیبانی', text: 'مشکل بررسی و حل شد. الان میتونید شارژ کنید. موفق باشید! ✅', timestamp: '۱۴۰۴/۰۶/۱۲ ۱۶:۳۰' },
];

const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'al1', type: 'register', userId: 'u7', userName: 'علی محمدی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۰۰' },
  { id: 'al2', type: 'purchase', userId: 'u7', userName: 'علی محمدی', detail: 'خرید دوره «دوره جامع هوش مصنوعی»', meta: '۲,۵۰۰,۰۰۰ تومان', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۰:۱۵' },
  { id: 'al3', type: 'review', userId: 'u7', userName: 'علی محمدی', detail: 'امتیاز ۵ از ۵ به دوره «دوره جامع هوش مصنوعی»', meta: 'عالی بود، محتوا خیلی خوب و کاربردی بود', timestamp: '۱۴۰۴/۰۶/۱۵ ۱۱:۰۰' },
  { id: 'al4', type: 'login', userId: 'u7', userName: 'علی محمدی', detail: 'ورود به سیستم', timestamp: '۱۴۰۴/۰۶/۱۵ ۰۹:۵۵' },
  { id: 'al5', type: 'register', userId: 'u8', userName: 'سارا احمدی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۴/۰۶/۱۰ ۰۹:۰۰' },
  { id: 'al6', type: 'purchase', userId: 'u8', userName: 'سارا احمدی', detail: 'خرید دوره «طراحی سایت با React»', meta: '۲,۰۰۰,۰۰۰ تومان', timestamp: '۱۴۰۴/۰۶/۱۰ ۰۹:۳۰' },
  { id: 'al7', type: 'review', userId: 'u8', userName: 'سارا احمدی', detail: 'امتیاز ۵ از ۵ به دوره «طراحی سایت با React»', meta: 'بهترین دوره‌ای بود که شرکت کردم', timestamp: '۱۴۰۴/۰۶/۱۲ ۱۴:۰۰' },
  { id: 'al8', type: 'login', userId: 'u8', userName: 'سارا احمدی', detail: 'ورود به سیستم', timestamp: '۱۴۰۴/۰۶/۱۰ ۰۸:۵۵' },
  { id: 'al9', type: 'register', userId: 'u9', userName: 'رضا حسینی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۴/۰۶/۰۵ ۰۸:۰۰' },
  { id: 'al10', type: 'purchase', userId: 'u9', userName: 'رضا حسینی', detail: 'خرید دوره «زبان انگلیسی تخصصی»', meta: '۱,۵۰۰,۰۰۰ تومان', timestamp: '۱۴۰۴/۰۶/۰۵ ۰۸:۳۰' },
  { id: 'al11', type: 'login', userId: 'u9', userName: 'رضا حسینی', detail: 'ورود به سیستم', timestamp: '۱۴۰۴/۰۶/۰۵ ۰۷:۵۵' },
  { id: 'al12', type: 'register', userId: 'u10', userName: 'نیلوفر احمدی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۴/۰۵/۲۰ ۱۵:۰۰' },
  { id: 'al13', type: 'purchase', userId: 'u10', userName: 'نیلوفر احمدی', detail: 'خرید دوره «رباتیک ویژه»', meta: '۱,۸۰۰,۰۰۰ تومان', timestamp: '۱۴۰۴/۰۵/۲۰ ۱۵:۳۰' },
  { id: 'al14', type: 'login', userId: 'u10', userName: 'نیلوفر احمدی', detail: 'ورود به سیستم', timestamp: '۱۴۰۴/۰۵/۲۰ ۱۴:۵۵' },
  { id: 'al15', type: 'register', userId: 'u12', userName: 'زهرا کریمی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۴/۰۵/۱۰ ۱۲:۰۰' },
  { id: 'al16', type: 'purchase', userId: 'u12', userName: 'زهرا کریمی', detail: 'خرید دوره «دوره جامع هوش مصنوعی»', meta: '۲,۵۰۰,۰۰۰ تومان', timestamp: '۱۴۰۴/۰۵/۱۰ ۱۲:۳۰' },
  { id: 'al17', type: 'review', userId: 'u12', userName: 'زهرا کریمی', detail: 'امتیاز ۴ از ۵ به دوره «دوره جامع هوش مصنوعی»', meta: 'خیلی خوب بود ولی سرعت تدریس کمی بالا بود', timestamp: '۱۴۰۴/۰۶/۱۰ ۱۶:۰۰' },
  { id: 'al18', type: 'system', userId: 'u1', userName: 'مدیر سیستم', detail: 'تنظیمات پرداخت به‌روزرسانی شد', timestamp: '۱۴۰۴/۰۶/۰۱ ۱۰:۰۰' },
  { id: 'al19', type: 'system', userId: 'u1', userName: 'مدیر سیستم', detail: 'دوره جدید «پایگاه داده» ایجاد شد', timestamp: '۱۴۰۴/۰۵/۲۵ ۱۴:۰۰' },
  { id: 'al20', type: 'system', userId: 'u1', userName: 'مدیر سیستم', detail: 'کد تخفیف «نجمایی۱۰» فعال شد', timestamp: '۱۴۰۴/۰۵/۱۵ ۱۱:۰۰' },
];

// ──── INITIALIZE ────

export function initializeDB() {
  const db = getDB();
  if (!db.users || db.users.length === 0) {
    setCollection('users', SEED_USERS);
    setCollection('courses', SEED_COURSES);
    setCollection('enrollments', SEED_ENROLLMENTS);
    setCollection('transactions', SEED_TRANSACTIONS);
    setCollection('attendance', SEED_ATTENDANCE);
    setCollection('schedule', SEED_SCHEDULE);
    setCollection('reviews', SEED_REVIEWS);
    setCollection('notifications', []);
    setCollection('blogPosts', SEED_BLOG_POSTS);
    setCollection('discounts', [
      { id: 'd1', code: 'نجمایی۱۰', percent: 10, maxDiscount: 200000, minAmount: 500000, usedCount: 45, status: 'active', expires: '۱۴۰۵/۰۶/۳۱' },
      { id: 'd2', code: 'خوش‌آمدید', percent: 15, maxDiscount: 300000, minAmount: 1000000, usedCount: 28, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
      { id: 'd3', code: 'دانشجو۵', percent: 5, maxDiscount: 100000, minAmount: 200000, usedCount: 120, status: 'active', expires: '۱۴۰۵/۰۹/۳۰' },
    ]);
    setCollection('suggestions', [
      { id: 's1', title: 'اپلیکیشن موبایل', description: 'ساخت اپلیکیشن موبایل', author: 'علی محمدی', date: '۱۴۰۴/۰۵/۰۱', votes: 42, status: 'pending' },
      { id: 's2', title: 'کلاس شبانه', description: 'برگزاری کلاس‌ها در ساعات عصر', author: 'سارا احمدی', date: '۱۴۰۴/۰۴/۱۵', votes: 18, status: 'accepted' },
    ]);
    setCollection('chats', SEED_CHATS);
    setCollection('chatMessages', SEED_CHAT_MESSAGES);
    setCollection('activityLogs', SEED_ACTIVITY_LOGS);
  } else {
    const users = db.users as User[];
    const hasAdmin = users.some((u) => u.role === 'admin');
    if (!hasAdmin) {
      users.unshift(...SEED_USERS.filter((su) => su.role === 'admin'));
      saveDB(db);
    }
    if (!db.courses || db.courses.length === 0) {
      setCollection('courses', SEED_COURSES);
    }
    if (!db.enrollments || db.enrollments.length === 0) {
      setCollection('enrollments', SEED_ENROLLMENTS);
    }
    if (!db.transactions || db.transactions.length === 0) {
      setCollection('transactions', SEED_TRANSACTIONS);
    }
    if (!db.attendance || db.attendance.length === 0) {
      setCollection('attendance', SEED_ATTENDANCE);
    }
    if (!db.schedule || db.schedule.length === 0) {
      setCollection('schedule', SEED_SCHEDULE);
    }
    if (!db.reviews || db.reviews.length === 0) {
      setCollection('reviews', SEED_REVIEWS);
    }
    if (!db.notifications) {
      setCollection('notifications', []);
    }
    if (!db.blogPosts || db.blogPosts.length === 0) {
      setCollection('blogPosts', SEED_BLOG_POSTS);
    }
    if (!db.discounts) {
      setCollection('discounts', [
        { id: 'd1', code: 'نجمایی۱۰', percent: 10, maxDiscount: 200000, minAmount: 500000, usedCount: 45, status: 'active', expires: '۱۴۰۵/۰۶/۳۱' },
        { id: 'd2', code: 'خوش‌آمدید', percent: 15, maxDiscount: 300000, minAmount: 1000000, usedCount: 28, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
        { id: 'd3', code: 'دانشجو۵', percent: 5, maxDiscount: 100000, minAmount: 200000, usedCount: 120, status: 'active', expires: '۱۴۰۵/۰۹/۳۰' },
      ]);
    }
    if (!db.suggestions) {
      setCollection('suggestions', [
        { id: 's1', title: 'اپلیکیشن موبایل', description: 'ساخت اپلیکیشن موبایل', author: 'علی محمدی', date: '۱۴۰۴/۰۵/۰۱', votes: 42, status: 'pending' },
        { id: 's2', title: 'کلاس شبانه', description: 'برگزاری کلاس‌ها در ساعات عصر', author: 'سارا احمدی', date: '۱۴۰۴/۰۴/۱۵', votes: 18, status: 'accepted' },
      ]);
    }
    if (!db.chats || db.chats.length === 0) {
      setCollection('chats', SEED_CHATS);
      setCollection('chatMessages', SEED_CHAT_MESSAGES);
    }
    if (!db.chatMessages || db.chatMessages.length === 0) {
      setCollection('chatMessages', SEED_CHAT_MESSAGES);
    }
    if (!db.activityLogs || db.activityLogs.length === 0) {
      setCollection('activityLogs', SEED_ACTIVITY_LOGS);
    }
  }
}

// ──── PUBLIC API ────

export const db = {
  // Users
  getUsers: () => getCollection<User>('users'),
  getUserById: (id: string) => getCollection<User>('users').find((u) => u.id === id),
  getUserByCredentials: (identifier: string, password: string) =>
    getCollection<User>('users').find((u) => (u.email === identifier || u.mobile === identifier) && u.password === password),
  addUser: (user: Omit<User, 'id'>) => addItem<User>('users', { ...user, id: generateId('u') }),
  updateUser: (id: string, updates: Partial<User>) => updateItem<User>('users', id, updates),
  deleteUser: (id: string) => deleteItem<User>('users', id),
  changeUserRole: (id: string, role: User['role']) => updateItem<User>('users', id, { role }),

  // Courses
  getCourses: () => getCollection<Course>('courses'),
  getCourseById: (id: string) => getCollection<Course>('courses').find((c) => c.id === id),
  addCourse: (course: Omit<Course, 'id'>) => addItem<Course>('courses', { ...course, id: generateId('c') }),
  updateCourse: (id: string, updates: Partial<Course>) => updateItem<Course>('courses', id, updates),
  deleteCourse: (id: string) => deleteItem<Course>('courses', id),

  // Enrollments
  getEnrollments: () => getCollection<Enrollment>('enrollments'),
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => addItem<Enrollment>('enrollments', { ...enrollment, id: generateId('e') }),

  // Transactions
  getTransactions: () => getCollection<Transaction>('transactions'),
  addTransaction: (tx: Omit<Transaction, 'id'>) => addItem<Transaction>('transactions', { ...tx, id: generateId('t') }),
  deleteTransaction: (id: string) => deleteItem<Transaction>('transactions', id),

  // Notifications
  getNotifications: () => getCollection<Notification>('notifications'),
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => addItem<Notification>('notifications', { ...n, id: generateId('n'), read: false, status: n.status || 'draft', target: n.target || 'all' }),
  updateNotification: (id: string, updates: Partial<Notification>) => updateItem<Notification>('notifications', id, updates),
  deleteNotification: (id: string) => deleteItem<Notification>('notifications', id),

  // Attendance
  getAttendance: () => getCollection<Attendance>('attendance'),
  getAttendanceByCourse: (courseId: string) => getCollection<Attendance>('attendance').filter((a) => a.courseId === courseId),
  addAttendance: (a: Omit<Attendance, 'id'>) => addItem<Attendance>('attendance', { ...a, id: generateId('a') }),

  // Schedule
  getSchedule: () => getCollection<Schedule>('schedule'),
  getScheduleByTeacher: (teacherId: string) => getCollection<Schedule>('schedule').filter((s) => s.teacherId === teacherId),

  // Reviews
  getReviews: () => getCollection<Review>('reviews'),
  getReviewsByCourse: (courseId: string) => getCollection<Review>('reviews').filter((r) => r.courseId === courseId),
  getReviewsByTeacher: (teacherId: string) => {
    const courses = getCollection<Course>('courses').filter((c) => c.teacherId === teacherId);
    const courseIds = courses.map((c) => c.id);
    return getCollection<Review>('reviews').filter((r) => courseIds.includes(r.courseId));
  },
  addReview: (r: Omit<Review, 'id'>) => addItem<Review>('reviews', { ...r, id: generateId('rv') }),

  // Blog Posts
  getBlogPosts: () => getCollection<BlogPost>('blogPosts'),
  getBlogPostById: (id: string) => getCollection<BlogPost>('blogPosts').find((p) => p.id === id),
  addBlogPost: (post: Omit<BlogPost, 'id'>) => addItem<BlogPost>('blogPosts', { ...post, id: generateId('bp') }),
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => updateItem<BlogPost>('blogPosts', id, updates),
  deleteBlogPost: (id: string) => deleteItem<BlogPost>('blogPosts', id),
  toggleBlogPostStatus: (id: string) => {
    const post = getCollection<BlogPost>('blogPosts').find((p) => p.id === id);
    if (!post) return null;
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    return updateItem<BlogPost>('blogPosts', id, { status: newStatus });
  },

  // Chats
  getChats: () => getCollection<Chat>('chats'),
  getChatById: (id: string) => getCollection<Chat>('chats').find((c) => c.id === id),
  addChat: (chat: Omit<Chat, 'id'>) => addItem<Chat>('chats', { ...chat, id: generateId('ch') }),
  updateChat: (id: string, updates: Partial<Chat>) => updateItem<Chat>('chats', id, updates),
  deleteChat: (id: string) => {
    deleteItem<Chat>('chats', id);
    const msgs = getCollection<ChatMessage>('chatMessages').filter((m) => m.chatId !== id);
    setCollection('chatMessages', msgs);
  },

  // Chat Messages
  getChatMessages: (chatId: string) => getCollection<ChatMessage>('chatMessages').filter((m) => m.chatId === chatId),
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => {
    const newMsg = addItem<ChatMessage>('chatMessages', { ...msg, id: generateId('cm') });
    const now = new Date();
    const ts = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    updateItem<Chat>('chats', msg.chatId, {
      updatedAt: ts,
      unreadCount: msg.sender === 'user' ? (getCollection<Chat>('chats').find((c) => c.id === msg.chatId)?.unreadCount ?? 0) + 1 : (getCollection<Chat>('chats').find((c) => c.id === msg.chatId)?.unreadCount ?? 0),
    });
    return newMsg;
  },

  // Teacher helpers
  getCoursesByTeacher: (teacherId: string) => getCollection<Course>('courses').filter((c) => c.teacherId === teacherId),
  getStudentsByTeacher: (teacherId: string) => {
    const courses = getCollection<Course>('courses').filter((c) => c.teacherId === teacherId);
    const courseIds = courses.map((c) => c.id);
    const enrollments = getCollection<Enrollment>('enrollments').filter((e) => courseIds.includes(e.courseId));
    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
    return getCollection<User>('users').filter((u) => studentIds.includes(u.id));
  },

  // Activity Logs
  getActivityLogs: () => getCollection<ActivityLog>('activityLogs'),
  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const ts = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return addItem<ActivityLog>('activityLogs', { ...log, id: generateId('al'), timestamp: ts });
  },

  // Generic
  getCollection,
  setCollection,
};
