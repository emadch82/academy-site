import { blogPosts as STATIC_BLOG_POSTS } from './blog-data';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toEnDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));

function div(a: number, b: number) {
  return ~~(a / b);
}
function mod(a: number, b: number) {
  return a - ~~(a / b) * b;
}

function jalCal(jy: number) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < breaks.length; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
  const gy = d2g(jdn);
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return gy;
}

export function parseFaDate(faDate: string): Date | null {
  const parts = toEnDigits(faDate).split('/');
  if (parts.length !== 3) return null;
  const jy = parseInt(parts[0], 10);
  const jm = parseInt(parts[1], 10);
  const jd = parseInt(parts[2], 10);
  if (!jy || !jm || !jd) return null;
  return new Date(g2d(jy, jm, jd) * 86400000);
}

export function faWeekdayIndex(faDate: string): number {
  const parts = toEnDigits(faDate).split('/');
  if (parts.length !== 3) return -1;
  const jy = parseInt(parts[0], 10);
  const jm = parseInt(parts[1], 10);
  const jd = parseInt(parts[2], 10);
  if (!jy || !jm || !jd) return -1;
  const jdn = j2d(jy, jm, jd);
  const mondayIndex = mod(jdn, 7);
  return mod(mondayIndex + 2, 7);
}

export function faDateFromJdn(jdn: number): string {
  const { jy, jm, jd } = d2j(jdn);
  const mm = jm < 10 ? `0${jm}` : `${jm}`;
  const dd = jd < 10 ? `0${jd}` : `${jd}`;
  return `${jy}/${mm}/${dd}`;
}

export function todayFa(): string {
  return faDateFromJdn(div(Date.now() / 86400000, 1) + 2440588);
}

export function faFromGregorian(isoDate: string): string {
  const parts = isoDate.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((p) => !p)) return isoDate;
  return faDateFromJdn(g2d(parts[0], parts[1], parts[2]));
}

export function addDaysFa(faDate: string, days: number): string {
  const parts = toEnDigits(faDate).split('/');
  if (parts.length !== 3) return faDate;
  const jy = parseInt(parts[0], 10);
  const jm = parseInt(parts[1], 10);
  const jd = parseInt(parts[2], 10);
  if (!jy || !jm || !jd) return faDate;
  return faDateFromJdn(j2d(jy, jm, jd) + days);
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
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
  recipientId?: string;
  recipientName?: string;
  link?: string;
}

export interface Attendance {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  absenceReason?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  comment?: string;
  createdAt: string;
  notified: boolean;
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
  content: string;
  imageUrl: string;
  readTime: string;
  authorId?: string;
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

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  sessions: number;
  attendedCount: number;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  courseId: string;
  courseName: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  isToday?: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  courseId: string;
  description: string;
  createdAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  duration: number;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Material {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  studentId?: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'file';
  url: string;
  addedAt: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  date: string;
  code: string;
}

const STORAGE_KEY = 'amz_db';
const DB_VERSION_KEY = 'amz_db_version';
const CURRENT_DB_VERSION = 4;

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
  { id: 'u1', fullName: 'مدیر سیستم', email: 'admin@viraacademyesf.ir', mobile: '09132019139', password: 'admin', role: 'admin', status: 'active', joinDate: '۱۴۰۳/۰۱/۰۱' },
  { id: 'u2', fullName: 'غزال امیرسلیمانی', email: 'ghazal@viraacademyesf.ir', mobile: '09132019100', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۲/۱۵' },
  { id: 'u3', fullName: 'نسیم خدابخش', email: 'nasim@viraacademyesf.ir', mobile: '09132019101', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۳/۱۰' },
  { id: 'u4', fullName: 'زهرا مردانی', email: 'zahra@viraacademyesf.ir', mobile: '09132019102', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۴/۰۵' },
  { id: 'u5', fullName: 'سوگل سرشوقی', email: 'sogol@viraacademyesf.ir', mobile: '09132019103', password: 'teacher', role: 'teacher', status: 'active', joinDate: '۱۴۰۳/۰۵/۲۰' },
  { id: 'u7', fullName: 'علی محمدی', email: 'ali@gmail.com', mobile: '09137890123', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۱/۱۰' },
  { id: 'u8', fullName: 'سارا احمدی', email: 'sara.ahmadi@gmail.com', mobile: '09138901234', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۱/۱۵' },
  { id: 'u9', fullName: 'رضا حسینی', email: 'reza.h@gmail.com', mobile: '09139012345', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۲/۰۱' },
  { id: 'u10', fullName: 'نیلوفر احمدی', email: 'niloofar@gmail.com', mobile: '09130123456', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۲/۲۰' },
  { id: 'u11', fullName: 'علی رضایی', email: 'ali.rezaei@gmail.com', mobile: '09131234500', password: 'user', role: 'student', status: 'pending', joinDate: '۱۴۰۵/۰۳/۰۵' },
  { id: 'u12', fullName: 'زهرا کریمی', email: 'zahra.k@gmail.com', mobile: '09132345600', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۳/۱۰' },
  { id: 'u13', fullName: 'امیر محمدی', email: 'amir@gmail.com', mobile: '09133456700', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۴/۰۱' },
  { id: 'u14', fullName: 'فاطمه عباسی', email: 'fateme@gmail.com', mobile: '09134567800', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۴/۱۵' },
  { id: 'u15', fullName: 'امین رستمی', email: 'amin@gmail.com', mobile: '09135678900', password: 'user', role: 'student', status: 'active', joinDate: '۱۴۰۵/۰۵/۰۱' },
];

const TEACHER_IMAGES: Record<string, string> = {
  u2: '/images/female-avatar.png',
  u3: '/images/nasim.jpg',
  u4: '/images/zahra.jpg',
  u5: '/images/female-avatar.png',
};

const COURSE_IMAGES: Record<string, string> = {
  'children': '/images/children.jpg',
  'junior': '/images/junior.jpg',
  'adult': '/images/adult.jpg',
  'conversation': '/images/conversation.jpg',
  'ttc': '/images/ttc.jpg',
  'moc': '/images/moc.jpg',
  'online': '/images/online.jpg',
  'book-movie': '/images/book-movie.jpg',
};

const SEED_COURSES: Course[] = [
  { id: 'c1', title: 'دوره کودکان', teacherId: 'u2', teacherName: 'غزال امیرسلیمانی', category: 'کودکان', price: 0, capacity: 15, enrolledCount: 12, status: 'active', imageUrl: COURSE_IMAGES.children, level: 'مبتدی', duration: '۲۰ جلسه' },
  { id: 'c2', title: 'دوره نوجوانان', teacherId: 'u2', teacherName: 'غزال امیرسلیمانی', category: 'نوجوانان', price: 0, capacity: 15, enrolledCount: 10, status: 'active', imageUrl: COURSE_IMAGES.junior, level: 'متوسط', duration: '۲۰ جلسه' },
  { id: 'c3', title: 'دوره بزرگسالان', teacherId: 'u4', teacherName: 'زهرا مردانی', category: 'بزرگسالان', price: 0, capacity: 20, enrolledCount: 18, status: 'active', imageUrl: COURSE_IMAGES.adult, level: 'همه سطوح', duration: '۲۴ جلسه' },
  { id: 'c4', title: 'دوره مکالمه SPO', teacherId: 'u4', teacherName: 'زهرا مردانی', category: 'مکالمه', price: 0, capacity: 12, enrolledCount: 10, status: 'active', imageUrl: COURSE_IMAGES.conversation, level: 'متوسط', duration: '۱۶ جلسه' },
  { id: 'c5', title: 'دوره TTC', teacherId: 'u4', teacherName: 'زهرا مردانی', category: 'TTC', price: 0, capacity: 10, enrolledCount: 8, status: 'active', imageUrl: COURSE_IMAGES.ttc, level: 'پیشرفته', duration: '۳۰ جلسه' },
  { id: 'c6', title: 'آزمون MOC (آیلتس)', teacherId: 'u3', teacherName: 'نسیم خدابخش', category: 'آزمون', price: 0, capacity: 15, enrolledCount: 12, status: 'active', imageUrl: COURSE_IMAGES.moc, level: 'پیشرفته', duration: '۲۰ جلسه' },
  { id: 'c7', title: 'دوره آنلاین', teacherId: 'u3', teacherName: 'نسیم خدابخش', category: 'آنلاین', price: 0, capacity: 25, enrolledCount: 20, status: 'active', imageUrl: COURSE_IMAGES.online, level: 'همه سطوح', duration: '۲۰ جلسه' },
  { id: 'c8', title: 'معرفی کتاب و فیلم', teacherId: 'u3', teacherName: 'نسیم خدابخش', category: 'فرهنگی', price: 0, capacity: 20, enrolledCount: 15, status: 'active', imageUrl: COURSE_IMAGES['book-movie'], level: 'همه سطوح', duration: '۱۰ جلسه' },
];

const SEED_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', studentId: 'u7', studentName: 'علی محمدی', courseId: 'c1', courseName: 'دوره کودکان', date: '۱۴۰۵/۰۴/۱۵', status: 'confirmed', amount: 0 },
  { id: 'e2', studentId: 'u8', studentName: 'سارا احمدی', courseId: 'c3', courseName: 'دوره بزرگسالان', date: '۱۴۰۵/۰۴/۱۰', status: 'confirmed', amount: 0 },
  { id: 'e3', studentId: 'u9', studentName: 'رضا حسینی', courseId: 'c4', courseName: 'دوره مکالمه SPO', date: '۱۴۰۵/۰۴/۰۵', status: 'confirmed', amount: 0 },
  { id: 'e4', studentId: 'u10', studentName: 'نیلوفر احمدی', courseId: 'c5', courseName: 'دوره TTC', date: '۱۴۰۵/۰۳/۲۰', status: 'confirmed', amount: 0 },
  { id: 'e5', studentId: 'u11', studentName: 'علی رضایی', courseId: 'c6', courseName: 'آزمون MOC (آیلتس)', date: '۱۴۰۵/۰۳/۱۵', status: 'pending', amount: 0 },
  { id: 'e6', studentId: 'u12', studentName: 'زهرا کریمی', courseId: 'c2', courseName: 'دوره نوجوانان', date: '۱۴۰۵/۰۲/۱۰', status: 'confirmed', amount: 0 },
  { id: 'e7', studentId: 'u13', studentName: 'امیر محمدی', courseId: 'c7', courseName: 'دوره آنلاین', date: '۱۴۰۵/۰۲/۰۵', status: 'confirmed', amount: 0 },
  { id: 'e8', studentId: 'u14', studentName: 'فاطمه عباسی', courseId: 'c8', courseName: 'معرفی کتاب و فیلم', date: '۱۴۰۵/۰۱/۲۰', status: 'confirmed', amount: 0 },
  { id: 'e9', studentId: 'u15', studentName: 'امین رستمی', courseId: 'c3', courseName: 'دوره بزرگسالان', date: '۱۴۰۵/۰۱/۱۵', status: 'confirmed', amount: 0 },
];

const SEED_ATTENDANCE: Attendance[] = [
  { id: 'a1', courseId: 'c1', studentId: 'u7', studentName: 'علی محمدی', date: '۱۴۰۵/۰۴/۱۵', status: 'present' },
  { id: 'a2', courseId: 'c1', studentId: 'u12', studentName: 'زهرا کریمی', date: '۱۴۰۵/۰۴/۱۵', status: 'present' },
  { id: 'a3', courseId: 'c3', studentId: 'u8', studentName: 'سارا احمدی', date: '۱۴۰۵/۰۴/۱۰', status: 'present' },
  { id: 'a4', courseId: 'c3', studentId: 'u15', studentName: 'امین رستمی', date: '۱۴۰۵/۰۴/۱۰', status: 'late' },
  { id: 'a5', courseId: 'c4', studentId: 'u9', studentName: 'رضا حسینی', date: '۱۴۰۵/۰۴/۰۵', status: 'present' },
  { id: 'a6', courseId: 'c7', studentId: 'u13', studentName: 'امیر محمدی', date: '۱۴۰۵/۰۴/۰۱', status: 'present' },
];

const SEED_SCHEDULE: Schedule[] = [
  { id: 'sch1', courseId: 'c1', courseName: 'دوره کودکان', teacherId: 'u2', day: 'شنبه', time: '۱۶:۰۰ - ۱۸:۰۰', room: 'کلاس ۱' },
  { id: 'sch2', courseId: 'c2', courseName: 'دوره نوجوانان', teacherId: 'u2', day: 'یکشنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کلاس ۲' },
  { id: 'sch3', courseId: 'c3', courseName: 'دوره بزرگسالان', teacherId: 'u4', day: 'دوشنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کلاس ۱' },
  { id: 'sch4', courseId: 'c4', courseName: 'دوره مکالمه SPO', teacherId: 'u4', day: 'شنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کلاس ۳' },
  { id: 'sch5', courseId: 'c5', courseName: 'دوره TTC', teacherId: 'u4', day: 'سه‌شنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کلاس ۲' },
  { id: 'sch6', courseId: 'c6', courseName: 'آزمون MOC (آیلتس)', teacherId: 'u3', day: 'چهارشنبه', time: '۱۰:۰۰ - ۱۲:۰۰', room: 'کلاس ۴' },
  { id: 'sch7', courseId: 'c7', courseName: 'دوره آنلاین', teacherId: 'u3', day: 'پنجشنبه', time: '۰۸:۰۰ - ۱۰:۰۰', room: 'آنلاین' },
  { id: 'sch8', courseId: 'c8', courseName: 'معرفی کتاب و فیلم', teacherId: 'u3', day: 'یکشنبه', time: '۱۴:۰۰ - ۱۶:۰۰', room: 'کلاس ۱' },
];

const SEED_REVIEWS: Review[] = [
  { id: 'rv1', courseId: 'c1', courseName: 'دوره کودکان', studentId: 'u7', studentName: 'علی محمدی', rating: 5, comment: 'محیط خیلی خوبی برای کودکان دارید، پسرم عاشق کلاسا شده', date: '۱۴۰۵/۰۴/۱۵' },
  { id: 'rv2', courseId: 'c3', courseName: 'دوره بزرگسالان', studentId: 'u8', studentName: 'سارا احمدی', rating: 5, comment: 'بهترین آموزشگاه زبانی هست که تا حالا رفتم', date: '۱۴۰۵/۰۴/۱۰' },
  { id: 'rv3', courseId: 'c4', courseName: 'دوره مکالمه SPO', studentId: 'u9', studentName: 'رضا حسینی', rating: 4, comment: 'خیلی مفید بود، مکالمه‌ام خیلی بهتر شده', date: '۱۴۰۵/۰۴/۰۵' },
  { id: 'rv4', courseId: 'c5', courseName: 'دوره TTC', studentId: 'u10', studentName: 'نیلوفر احمدی', rating: 5, comment: 'دوره عالی بود، خانم مردانی فوق‌العاده تدریس می‌کنن', date: '۱۴۰۵/۰۳/۲۰' },
  { id: 'rv5', courseId: 'c7', courseName: 'دوره آنلاین', studentId: 'u13', studentName: 'امیر محمدی', rating: 4, comment: 'کلاس آنلاین خیلی راحت و با کیفیت بود', date: '۱۴۰۵/۰۳/۱۰' },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', userId: 'u7', userName: 'علی محمدی', type: 'income', amount: 2500000, description: 'شهریه دوره کودکان', date: '۱۴۰۵/۰۴/۱۵', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't2', userId: 'u8', userName: 'سارا احمدی', type: 'income', amount: 2000000, description: 'شهریه دوره بزرگسالان', date: '۱۴۰۵/۰۴/۱۰', status: 'completed', paymentMethod: 'کارت به کارت' },
  { id: 't3', userId: 'u9', userName: 'رضا حسینی', type: 'income', amount: 1500000, description: 'شهریه دوره مکالمه SPO', date: '۱۴۰۵/۰۴/۰۵', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't4', userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 8000000, description: 'اجاره محل آموزشگاه', date: '۱۴۰۵/۰۴/۰۱', status: 'completed', paymentMethod: 'نقدی' },
  { id: 't5', userId: 'u10', userName: 'نیلوفر احمدی', type: 'income', amount: 3000000, description: 'شهریه دوره TTC', date: '۱۴۰۵/۰۳/۲۰', status: 'completed', paymentMethod: 'آنلاین' },
  { id: 't6', userId: 'u0', userName: 'آموزشگاه', type: 'expense', amount: 500000, description: 'تبلیغات اینستاگرام', date: '۱۴۰۵/۰۳/۱۵', status: 'completed', paymentMethod: 'کارت به کارت' },
  { id: 't7', userId: 'u12', userName: 'زهرا کریمی', type: 'income', amount: 2000000, description: 'شهریه دوره نوجوانان', date: '۱۴۰۵/۰۲/۱۰', status: 'completed', paymentMethod: 'اقساطی' },
  { id: 't8', userId: 'u13', userName: 'امیر محمدی', type: 'income', amount: 1500000, description: 'شهریه دوره آنلاین', date: '۱۴۰۵/۰۲/۰۵', status: 'completed', paymentMethod: 'آنلاین' },
];

const DRAFT_BLOG_TITLES = ['مزایای شرکت در دوره TTC'];

const SEED_BLOG_POSTS: BlogPost[] = STATIC_BLOG_POSTS.map((p) => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  author: p.author,
  status: DRAFT_BLOG_TITLES.includes(p.title) ? 'draft' : 'published',
  date: p.date,
  content: p.content,
  imageUrl: p.imageUrl,
  readTime: p.readTime,
}));

const SEED_CHATS: Chat[] = [
  { id: 'ch1', userId: 'u7', userName: 'علی محمدی', subject: 'سوال درباره دوره کودکان', status: 'open', unreadCount: 2, createdAt: '۱۴۰۵/۰۴/۱۵ ۱۰:۳۰', updatedAt: '۱۴۰۵/۰۴/۱۵ ۱۱:۰۰' },
  { id: 'ch2', userId: 'u8', userName: 'سارا احمدی', subject: 'زمان کلاس بزرگسالان', status: 'open', unreadCount: 0, createdAt: '۱۴۰۵/۰۴/۱۰ ۱۴:۰۰', updatedAt: '۱۴۰۵/۰۴/۱۰ ۱۵:۳۰' },
  { id: 'ch3', userId: 'u9', userName: 'رضا حسینی', subject: 'شرایط دوره مکالمه', status: 'open', unreadCount: 1, createdAt: '۱۴۰۵/۰۴/۰۵ ۰۹:۰۰', updatedAt: '۱۴۰۵/۰۴/۰۵ ۰۹:۴۵' },
  { id: 'ch4', userId: 'u10', userName: 'نیلوفر احمدی', subject: 'ثبت‌نام دوره TTC', status: 'closed', unreadCount: 0, createdAt: '۱۴۰۵/۰۳/۲۰ ۱۶:۰۰', updatedAt: '۱۴۰۵/۰۳/۲۰ ۱۶:۳۰' },
];

const SEED_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'cm1', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'سلام، میخواستم بدونم دوره کودکان هنوز ثبت‌نام داره؟', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۳۰' },
  { id: 'cm2', chatId: 'ch1', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام علی جان، بله دوره کودکان فعال هست و میتونید ثبت‌نام کنید.', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۳۵' },
  { id: 'cm3', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'عالیه! سن مناسب برای ثبت‌نام چنده؟', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۴۰' },
  { id: 'cm4', chatId: 'ch1', sender: 'admin', senderName: 'پشتیبانی', text: 'سن ۵ تا ۱۰ سال مناسب این دوره هست.', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۴۵' },
  { id: 'cm5', chatId: 'ch1', sender: 'user', senderName: 'علی محمدی', text: 'عالیه! پس ثبت‌نام میکنم.', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۱:۰۰' },

  { id: 'cm6', chatId: 'ch2', sender: 'user', senderName: 'سارا احمدی', text: 'سلام، کلاس بزرگسالان ساعت چنده؟', timestamp: '۱۴۰۵/۰۴/۱۰ ۱۴:۰۰' },
  { id: 'cm7', chatId: 'ch2', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام سارا خانم، کلاس بزرگسالان شنبه تا پنجشنبه ساعت‌های مختلف برگزار می‌شه.', timestamp: '۱۴۰۵/۰۴/۱۰ ۱۴:۰۵' },
  { id: 'cm8', chatId: 'ch2', sender: 'user', senderName: 'سارا احمدی', text: 'ممنون، میتونم ساعت ۱۶ ثبت‌نام کنم؟', timestamp: '۱۴۰۵/۰۴/۱۰ ۱۴:۱۰' },
  { id: 'cm9', chatId: 'ch2', sender: 'admin', senderName: 'پشتیبانی', text: 'بله، کلاس ساعت ۱۶ هم فعال هست. 🎉', timestamp: '۱۴۰۵/۰۴/۱۰ ۱۵:۳۰' },

  { id: 'cm10', chatId: 'ch3', sender: 'user', senderName: 'رضا حسینی', text: 'سلام، شرایط دوره مکالمه SPO چیه؟', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۹:۰۰' },
  { id: 'cm11', chatId: 'ch3', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام رضا جان، دوره مکالمه ویژه تقویت Listening و Speaking هست.', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۹:۰۵' },
  { id: 'cm12', chatId: 'ch3', sender: 'user', senderName: 'رضا حسینی', text: 'عالیه، پیش‌نیاز خاصی داره؟', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۹:۴۵' },

  { id: 'cm13', chatId: 'ch4', sender: 'user', senderName: 'نیلوفر احمدی', text: 'میخواستم درباره دوره TTC سوال کنم.', timestamp: '۱۴۰۵/۰۳/۲۰ ۱۶:۰۰' },
  { id: 'cm14', chatId: 'ch4', sender: 'admin', senderName: 'پشتیبانی', text: 'سلام نیلوفر خانم، دوره TTC ویژه مدرسان زبان هست.', timestamp: '۱۴۰۵/۰۳/۲۰ ۱۶:۰۵' },
  { id: 'cm15', chatId: 'ch4', sender: 'user', senderName: 'نیلوفر احمدی', text: 'ممنون، ثبت‌نام کردم.', timestamp: '۱۴۰۵/۰۳/۲۰ ۱۶:۱۵' },
  { id: 'cm16', chatId: 'ch4', sender: 'admin', senderName: 'پشتیبانی', text: 'خوش‌آمدید! موفق باشید! ✅', timestamp: '۱۴۰۵/۰۳/۲۰ ۱۶:۳۰' },
];

const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'al1', type: 'register', userId: 'u7', userName: 'علی محمدی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۰۰' },
  { id: 'al2', type: 'purchase', userId: 'u7', userName: 'علی محمدی', detail: 'خرید دوره «دوره کودکان»', meta: 'ثبت‌نام رایگان', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۰:۱۵' },
  { id: 'al3', type: 'review', userId: 'u7', userName: 'علی محمدی', detail: 'امتیاز ۵ از ۵ به دوره «دوره کودکان»', meta: 'محیط خیلی خوبی برای کودکان دارید', timestamp: '۱۴۰۵/۰۴/۱۵ ۱۱:۰۰' },
  { id: 'al4', type: 'login', userId: 'u7', userName: 'علی محمدی', detail: 'ورود به سیستم', timestamp: '۱۴۰۵/۰۴/۱۵ ۰۹:۵۵' },
  { id: 'al5', type: 'register', userId: 'u8', userName: 'سارا احمدی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۵/۰۴/۱۰ ۰۹:۰۰' },
  { id: 'al6', type: 'purchase', userId: 'u8', userName: 'سارا احمدی', detail: 'خرید دوره «دوره بزرگسالان»', meta: 'ثبت‌نام رایگان', timestamp: '۱۴۰۵/۰۴/۱۰ ۰۹:۳۰' },
  { id: 'al7', type: 'review', userId: 'u8', userName: 'سارا احمدی', detail: 'امتیاز ۵ از ۵ به دوره «دوره بزرگسالان»', meta: 'بهترین آموزشگاه زبانی هست', timestamp: '۱۴۰۵/۰۴/۱۰ ۱۴:۰۰' },
  { id: 'al8', type: 'login', userId: 'u8', userName: 'سارا احمدی', detail: 'ورود به سیستم', timestamp: '۱۴۰۵/۰۴/۱۰ ۰۸:۵۵' },
  { id: 'al9', type: 'register', userId: 'u9', userName: 'رضا حسینی', detail: 'ثبت‌نام جدید در سیستم', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۸:۰۰' },
  { id: 'al10', type: 'purchase', userId: 'u9', userName: 'رضا حسینی', detail: 'خرید دوره «دوره مکالمه SPO»', meta: 'ثبت‌نام رایگان', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۸:۳۰' },
  { id: 'al11', type: 'login', userId: 'u9', userName: 'رضا حسینی', detail: 'ورود به سیستم', timestamp: '۱۴۰۵/۰۴/۰۵ ۰۷:۵۵' },
  { id: 'al12', type: 'system', userId: 'u1', userName: 'مدیر سیستم', detail: 'تنظیمات سایت به‌روزرسانی شد', timestamp: '۱۴۰۵/۰۴/۰۱ ۱۰:۰۰' },
  { id: 'al13', type: 'system', userId: 'u1', userName: 'مدیر سیستم', detail: 'کد تخفیف «ویرا۱۰» فعال شد', timestamp: '۱۴۰۵/۰۳/۱۵ ۱۱:۰۰' },
];

const SEED_GROUPS: Group[] = [
  { id: 'g1', name: 'گروه کودکان A', courseId: 'c1', description: 'ارتباط با مربی و اطلاع‌رسانی کلاس‌های دوره کودکان', createdAt: '۱۴۰۵/۰۱/۱۰' },
  { id: 'g2', name: 'گروه نوجوانان B', courseId: 'c2', description: 'ارتباط با مربی و اطلاع‌رسانی کلاس‌های دوره نوجوانان', createdAt: '۱۴۰۵/۰۱/۱۵' },
  { id: 'g3', name: 'گروه بزرگسالان A', courseId: 'c3', description: 'ارتباط با مدرس و اطلاع‌رسانی کلاس‌های دوره بزرگسالان', createdAt: '۱۴۰۵/۰۱/۲۰' },
  { id: 'g4', name: 'گروه مکالمه SPO', courseId: 'c4', description: 'گروه تمرین مکالمه و اطلاع‌رسانی جلسات SPO', createdAt: '۱۴۰۵/۰۲/۰۱' },
  { id: 'g5', name: 'گروه TTC', courseId: 'c5', description: 'گروه مدرسان TTC و اطلاع‌رسانی کارگاه‌ها', createdAt: '۱۴۰۵/۰۲/۱۰' },
];

const SEED_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    courseId: 'c3',
    courseName: 'دوره بزرگسالان',
    teacherId: 'u3',
    title: 'آزمون گرامر درس ۱ تا ۳',
    description: 'آزمون جمع‌بندی گرامر مباحث جلسات اخیر بزرگسالان',
    duration: 15,
    createdAt: '۱۴۰۵/۰۴/۰۱',
    questions: [
      { question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1 },
      { question: 'I have ___ finished my homework.', options: ['just', 'yet', 'since', 'for'], correctIndex: 0 },
      { question: '___ you like some tea?', options: ['Do', 'Would', 'Did', 'Have'], correctIndex: 1 },
      { question: 'They ___ to the cinema last night.', options: ['go', 'went', 'goes', 'gone'], correctIndex: 1 },
      { question: 'This is the book ___ I told you about.', options: ['who', 'which', 'what', 'whose'], correctIndex: 1 },
    ],
  },
  {
    id: 'q2',
    courseId: 'c4',
    courseName: 'دوره مکالمه SPO',
    teacherId: 'u2',
    title: 'آزمون واژگان و اصطلاحات',
    description: 'مرور واژگان و اصطلاحات جلسات مکالمه',
    duration: 10,
    createdAt: '۱۴۰۵/۰۴/۱۰',
    questions: [
      { question: 'Meaning of "appointment":', options: ['قرار ملاقات', 'ساعت', 'قرارداد', 'مذاکره'], correctIndex: 0 },
      { question: '"Take it easy" means:', options: ['سخت بگیر', 'آرام باش', 'عجله کن', 'ادامه بده'], correctIndex: 1 },
      { question: 'Meaning of "schedule":', options: ['ساعت', 'برنامه زمانی', 'کار', 'جلسه'], correctIndex: 1 },
      { question: 'Synonym of "begin":', options: ['start', 'end', 'stop', 'finish'], correctIndex: 0 },
      { question: '"I\'m afraid of..." means:', options: ['من از... می‌ترسم', 'من خوشحالم', 'من ناراحتم', 'من مطمئنم'], correctIndex: 0 },
    ],
  },
  {
    id: 'q3',
    courseId: 'c1',
    courseName: 'دوره کودکان',
    teacherId: 'u2',
    title: 'آزمون رنگ‌ها و اعداد',
    description: 'آزمون سرگرمی رنگ‌ها و اعداد برای کودکان',
    duration: 10,
    createdAt: '۱۴۰۵/۰۴/۱۵',
    questions: [
      { question: 'What color is the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctIndex: 1 },
      { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctIndex: 2 },
      { question: 'What comes after 4?', options: ['3', '4', '5', '6'], correctIndex: 2 },
      { question: 'Which one is a fruit?', options: ['Dog', 'Apple', 'Car', 'Book'], correctIndex: 1 },
    ],
  },
];

const SEED_MATERIALS: Material[] = [
  { id: 'm1', courseId: 'c3', courseName: 'دوره بزرگسالان', teacherId: 'u3', title: 'جزوه گرامر درس ۱ تا ۳', type: 'pdf', url: '#', addedAt: '۱۴۰۵/۰۳/۲۰' },
  { id: 'm2', courseId: 'c4', courseName: 'دوره مکالمه SPO', teacherId: 'u2', title: 'واژگان هفته چهارم', type: 'pdf', url: '#', addedAt: '۱۴۰۵/۰۴/۰۵' },
  { id: 'm3', courseId: 'c1', courseName: 'دوره کودکان', teacherId: 'u2', title: 'فلش‌کارت رنگ‌ها', type: 'file', url: '#', addedAt: '۱۴۰۵/۰۴/۱۲' },
  { id: 'm4', courseId: 'c2', courseName: 'دوره نوجوانان', teacherId: 'u4', title: 'ویدیوی تلفظ درس ۲', type: 'video', url: '#', addedAt: '۱۴۰۵/۰۳/۳۰' },
];

const SEED_CERTIFICATES: Certificate[] = [
  { id: 'ct1', studentId: 'u7', studentName: 'علی محمدی', courseId: 'c1', courseName: 'دوره کودکان', teacherName: 'غزال امیرسلیمانی', date: '۱۴۰۵/۰۵/۰۱', code: 'VIR-1405-0001' },
  { id: 'ct2', studentId: 'u8', studentName: 'سارا احمدی', courseId: 'c3', courseName: 'دوره بزرگسالان', teacherName: 'نسیم خدابخش', date: '۱۴۰۵/۰۵/۰۱', code: 'VIR-1405-0002' },
];

// ──── INITIALIZE ────

export interface SiteSettings {
  academyName: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  hours: string;
  supportPhone: string;
  description: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  academyName: 'آموزشگاه زبان ویرا',
  phone: '۰۳۱-۳۷۷۵۹۵۵۶',
  mobile: '۰۹۱۳۲۰۱۹۱۳۹',
  email: 'info@viraacademyesf.ir',
  website: 'viraacademyesf.ir',
  address: 'اصفهان، خیابان رودکی، کوچه شهید سلیمانی (84)',
  hours: 'شنبه تا پنجشنبه ۸ صبح تا ۸ شب',
  supportPhone: '۰۹۱۳۲۰۱۹۱۳۹',
  description: 'مرکز تخصصی آموزش زبان انگلیسی',
};

export function initializeDB() {
  if (typeof window === 'undefined') return;
  
  const db = getDB();
  const storedVersion = parseInt(localStorage.getItem(DB_VERSION_KEY) || '0', 10);
  
  if (storedVersion < CURRENT_DB_VERSION) {
    localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION.toString());
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
      { id: 'd1', code: 'ویرا۱۰', percent: 10, maxDiscount: 200000, minAmount: 500000, usedCount: 15, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
      { id: 'd2', code: 'خوش‌آمدید', percent: 15, maxDiscount: 300000, minAmount: 1000000, usedCount: 8, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
      { id: 'd3', code: 'دانشجو۵', percent: 5, maxDiscount: 100000, minAmount: 200000, usedCount: 20, status: 'active', expires: '۱۴۰۵/۰۹/۳۰' },
    ]);
    setCollection('suggestions', [
      { id: 's1', title: 'مکالمه فشرده', description: 'برگزاری کلاس‌های فشرده مکالمه در تعطیلات', author: 'علی محمدی', date: '۱۴۰۵/۰۴/۰۱', votes: 42, status: 'pending' },
      { id: 's2', title: 'آزمون تعیین سطح', description: 'برگزاری آزمون تعیین سطح رایگان', author: 'سارا احمدی', date: '۱۴۰۵/۰۳/۱۵', votes: 18, status: 'accepted' },
      { id: 's3', title: 'کلاب کتاب', description: 'برگزاری هفتگی کلاب کتاب و فیلم', author: 'رضا حسینی', date: '۱۴۰۵/۰۳/۰۱', votes: 25, status: 'pending' },
    ]);
    setCollection('chats', SEED_CHATS);
    setCollection('chatMessages', SEED_CHAT_MESSAGES);
    setCollection('activityLogs', SEED_ACTIVITY_LOGS);
    setCollection('homework', []);
    setCollection('groups', SEED_GROUPS);
    setCollection('quizzes', SEED_QUIZZES);
    setCollection('materials', SEED_MATERIALS);
    setCollection('certificates', SEED_CERTIFICATES);
    setCollection('appointments', []);
    setCollection('leaveRequests', []);
    setCollection('quizAttempts', []);
    setCollection('groupMessages', []);
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
    } else {
      let blogChanged = false;
      (db.blogPosts as BlogPost[]).forEach((p) => {
        if (!p.content || !p.imageUrl || !p.readTime) {
          const src = STATIC_BLOG_POSTS.find((s) => s.title === p.title);
          if (!p.content) p.content = src?.content || p.excerpt || '';
          if (!p.imageUrl) p.imageUrl = src?.imageUrl || '/images/blog2.jpg';
          if (!p.readTime) p.readTime = src?.readTime || `${Math.max(1, Math.ceil((p.content || '').length / 350))} دقیقه`;
          blogChanged = true;
        }
      });
      if (blogChanged) saveDB(db);
    }
    if (!db.discounts) {
      setCollection('discounts', [
        { id: 'd1', code: 'ویرا۱۰', percent: 10, maxDiscount: 200000, minAmount: 500000, usedCount: 15, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
        { id: 'd2', code: 'خوش‌آمدید', percent: 15, maxDiscount: 300000, minAmount: 1000000, usedCount: 8, status: 'active', expires: '۱۴۰۵/۱۲/۲۹' },
        { id: 'd3', code: 'دانشجو۵', percent: 5, maxDiscount: 100000, minAmount: 200000, usedCount: 20, status: 'active', expires: '۱۴۰۵/۰۹/۳۰' },
      ]);
    }
    if (!db.suggestions) {
      setCollection('suggestions', [
        { id: 's1', title: 'مکالمه فشرده', description: 'برگزاری کلاس‌های فشرده مکالمه در تعطیلات', author: 'علی محمدی', date: '۱۴۰۵/۰۴/۰۱', votes: 42, status: 'pending' },
        { id: 's2', title: 'آزمون تعیین سطح', description: 'برگزاری آزمون تعیین سطح رایگان', author: 'سارا احمدی', date: '۱۴۰۵/۰۳/۱۵', votes: 18, status: 'accepted' },
        { id: 's3', title: 'کلاب کتاب', description: 'برگزاری هفتگی کلاب کتاب و فیلم', author: 'رضا حسینی', date: '۱۴۰۵/۰۳/۰۱', votes: 25, status: 'pending' },
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
    if (!db.homework) {
      setCollection('homework', []);
    }
    if (!db.groups || db.groups.length === 0) {
      setCollection('groups', SEED_GROUPS);
    }
    if (!db.quizzes || db.quizzes.length === 0) {
      setCollection('quizzes', SEED_QUIZZES);
    }
    if (!db.materials || db.materials.length === 0) {
      setCollection('materials', SEED_MATERIALS);
    }
    if (!db.certificates || db.certificates.length === 0) {
      setCollection('certificates', SEED_CERTIFICATES);
    }
    if (!db.appointments) {
      setCollection('appointments', []);
    }
    if (!db.leaveRequests) {
      setCollection('leaveRequests', []);
    }
    if (!db.quizAttempts) {
      setCollection('quizAttempts', []);
    }
    let needsSave = false;
    const appts = db.appointments as any[];
    if (appts && appts.length > 0 && appts.some((a) => typeof a.sessions !== 'number')) {
      appts.forEach((a) => {
        if (typeof a.sessions !== 'number') a.sessions = 1;
        if (typeof a.attendedCount !== 'number') a.attendedCount = 0;
      });
      needsSave = true;
    }
    const atts = db.attendance as any[];
    if (atts && atts.some((a) => typeof a.absenceReason === 'undefined')) {
      atts.forEach((a) => {
        if (typeof a.absenceReason === 'undefined') a.absenceReason = '';
      });
      needsSave = true;
    }
    if (needsSave) saveDB(db);
    if (!db.groupMessages) {
      setCollection('groupMessages', []);
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
  getEnrollmentsByStudent: (studentId: string) => getCollection<Enrollment>('enrollments').filter((e) => e.studentId === studentId),
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => addItem<Enrollment>('enrollments', { ...enrollment, id: generateId('e') }),

  // Transactions
  getTransactions: () => getCollection<Transaction>('transactions'),
  getTransactionsByUser: (userId: string) => getCollection<Transaction>('transactions').filter((t) => t.userId === userId),
  addTransaction: (tx: Omit<Transaction, 'id'>) => addItem<Transaction>('transactions', { ...tx, id: generateId('t') }),
  deleteTransaction: (id: string) => deleteItem<Transaction>('transactions', id),

  // Notifications
  getNotifications: () => getCollection<Notification>('notifications'),
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => addItem<Notification>('notifications', { ...n, id: generateId('n'), read: false, status: n.status || 'draft', target: n.target || 'all' }),
  updateNotification: (id: string, updates: Partial<Notification>) => updateItem<Notification>('notifications', id, updates),
  deleteNotification: (id: string) => deleteItem<Notification>('notifications', id),

  // Attendance
  getAttendance: () => getCollection<Attendance>('attendance'),
  getAttendanceByStudent: (studentId: string) => getCollection<Attendance>('attendance').filter((a) => a.studentId === studentId),
  getAttendanceByCourse: (courseId: string) => getCollection<Attendance>('attendance').filter((a) => a.courseId === courseId),
  addAttendance: (a: Omit<Attendance, 'id'>) => addItem<Attendance>('attendance', { ...a, id: generateId('a') }),
  updateAttendance: (id: string, updates: Partial<Attendance>) => updateItem<Attendance>('attendance', id, updates),

  // Schedule
  getSchedule: () => getCollection<Schedule>('schedule'),
  getScheduleByTeacher: (teacherId: string) => getCollection<Schedule>('schedule').filter((s) => s.teacherId === teacherId),

  // Reviews
  getReviews: () => getCollection<Review>('reviews'),
  getReviewsByCourse: (courseId: string) => getCollection<Review>('reviews').filter((r) => r.courseId === courseId),
  getReviewsByStudent: (studentId: string) => getCollection<Review>('reviews').filter((r) => r.studentId === studentId),
  getReviewsByTeacher: (teacherId: string) => {
    const courses = getCollection<Course>('courses').filter((c) => c.teacherId === teacherId);
    const courseIds = courses.map((c) => c.id);
    return getCollection<Review>('reviews').filter((r) => courseIds.includes(r.courseId));
  },
  addReview: (r: Omit<Review, 'id'>) => addItem<Review>('reviews', { ...r, id: generateId('rv') }),
  deleteReview: (id: string) => deleteItem<Review>('reviews', id),

  // Blog Posts
  getBlogPosts: () => getCollection<BlogPost>('blogPosts'),
  getBlogPostById: (id: string) => getCollection<BlogPost>('blogPosts').find((p) => p.id === id),
  getBlogPostsByAuthor: (authorId: string) => getCollection<BlogPost>('blogPosts').filter((p) => p.authorId === authorId),
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

  // Homework
  getHomework: () => getCollection<Homework>('homework'),
  getHomeworkByStudent: (studentId: string) => getCollection<Homework>('homework').filter((h) => h.studentId === studentId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  getHomeworkByTeacher: (teacherId: string) => getCollection<Homework>('homework').filter((h) => h.teacherId === teacherId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  getHomeworkByCourse: (courseId: string) => getCollection<Homework>('homework').filter((h) => h.courseId === courseId),
  addHomework: (h: Omit<Homework, 'id' | 'createdAt' | 'notified'>) => {
    const now = new Date();
    const ts = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return addItem<Homework>('homework', { ...h, id: generateId('hw'), createdAt: ts, notified: false });
  },
  updateHomework: (id: string, updates: Partial<Homework>) => updateItem<Homework>('homework', id, updates),
  deleteHomework: (id: string) => deleteItem<Homework>('homework', id),

  // Appointments
  getAppointments: () => getCollection<Appointment>('appointments'),
  getAppointmentsByStudent: (studentId: string) =>
    getCollection<Appointment>('appointments').filter((a) => a.studentId === studentId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  getAppointmentsByTeacher: (teacherId: string) =>
    getCollection<Appointment>('appointments').filter((a) => a.teacherId === teacherId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  addAppointment: (a: Omit<Appointment, 'id'>) => addItem<Appointment>('appointments', { ...a, id: generateId('ap') }),
  updateAppointment: (id: string, updates: Partial<Appointment>) => updateItem<Appointment>('appointments', id, updates),

  // Leave Requests
  getLeaveRequests: () => getCollection<LeaveRequest>('leaveRequests'),
  getLeaveRequestsByStudent: (studentId: string) =>
    getCollection<LeaveRequest>('leaveRequests').filter((l) => l.studentId === studentId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  getLeaveRequestsByTeacher: (teacherId: string) =>
    getCollection<LeaveRequest>('leaveRequests').filter((l) => l.teacherId === teacherId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)),
  addLeaveRequest: (l: Omit<LeaveRequest, 'id'>) => addItem<LeaveRequest>('leaveRequests', { ...l, id: generateId('lr') }),
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => updateItem<LeaveRequest>('leaveRequests', id, updates),

  // Groups
  getGroups: () => getCollection<Group>('groups'),
  getGroupsByCourse: (courseId: string) => getCollection<Group>('groups').filter((g) => g.courseId === courseId),
  getGroupsByStudent: (studentId: string) => {
    const courses = getCollection<Enrollment>('enrollments')
      .filter((e) => e.studentId === studentId && e.status !== 'cancelled')
      .map((e) => e.courseId);
    return getCollection<Group>('groups').filter((g) => courses.includes(g.courseId));
  },

  // Group Messages
  getGroupMessages: (groupId: string) => getCollection<GroupMessage>('groupMessages').filter((m) => m.groupId === groupId),
  addGroupMessage: (m: Omit<GroupMessage, 'id'>) => addItem<GroupMessage>('groupMessages', { ...m, id: generateId('gm') }),

  // Quizzes
  getQuizzes: () => getCollection<Quiz>('quizzes'),
  getQuizzesByTeacher: (teacherId: string) => getCollection<Quiz>('quizzes').filter((q) => q.teacherId === teacherId),
  getQuizzesByCourse: (courseId: string) => getCollection<Quiz>('quizzes').filter((q) => q.courseId === courseId),
  addQuiz: (q: Omit<Quiz, 'id'>) => addItem<Quiz>('quizzes', { ...q, id: generateId('q') }),
  deleteQuiz: (id: string) => {
    deleteItem<Quiz>('quizzes', id);
    const attempts = getCollection<QuizAttempt>('quizAttempts').filter((a) => a.quizId !== id);
    setCollection('quizAttempts', attempts);
  },

  // Quiz Attempts
  getQuizAttempts: () => getCollection<QuizAttempt>('quizAttempts'),
  getAttemptsByStudent: (studentId: string) => getCollection<QuizAttempt>('quizAttempts').filter((a) => a.studentId === studentId),
  getAttemptsByQuiz: (quizId: string) => getCollection<QuizAttempt>('quizAttempts').filter((a) => a.quizId === quizId),
  addQuizAttempt: (a: Omit<QuizAttempt, 'id'>) => addItem<QuizAttempt>('quizAttempts', { ...a, id: generateId('qa') }),

  // Materials
  getMaterials: () => getCollection<Material>('materials'),
  getMaterialsByTeacher: (teacherId: string) => getCollection<Material>('materials').filter((m) => m.teacherId === teacherId),
  getMaterialsByCourse: (courseId: string) => getCollection<Material>('materials').filter((m) => m.courseId === courseId),
  getMaterialsByStudent: (studentId: string) => getCollection<Material>('materials').filter((m) => m.studentId === studentId),
  addMaterial: (m: Omit<Material, 'id'>) => addItem<Material>('materials', { ...m, id: generateId('mt') }),
  addMaterialByStudent: (m: Omit<Material, 'id'>) => addItem<Material>('materials', { ...m, id: generateId('mt'), studentId: m.studentId || '' }),
  deleteMaterial: (id: string) => deleteItem<Material>('materials', id),

  // Stats helpers
  getTeacherStats: (teacherId: string) => {
    const courses = getCollection<Course>('courses').filter((c) => c.teacherId === teacherId);
    const courseIds = courses.map((c) => c.id);
    const enrollments = getCollection<Enrollment>('enrollments').filter((e) => courseIds.includes(e.courseId));
    const students = getCollection<User>('users').filter((u) => enrollments.some((e) => e.studentId === u.id));
    const attendances = getCollection<Attendance>('attendance').filter((a) => courseIds.includes(a.courseId));
    const presentCount = attendances.filter((a) => a.status === 'present').length;
    const totalCount = attendances.length;
    const appointments = getCollection<Appointment>('appointments').filter((a) => a.teacherId === teacherId);
    const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;
    const leaveRequests = getCollection<LeaveRequest>('leaveRequests').filter((l) => l.teacherId === teacherId);
    const pendingLeave = leaveRequests.filter((l) => l.status === 'pending').length;
    const materials = getCollection<Material>('materials').filter((m) => m.teacherId === teacherId);
    const homework = getCollection<Homework>('homework').filter((h) => h.teacherId === teacherId);
    const quizzes = getCollection<Quiz>('quizzes').filter((q) => q.teacherId === teacherId);
    const schedule = getCollection<any>('schedule').filter((s) => s.teacherId === teacherId);
    
    return {
      totalCourses: courses.length,
      totalStudents: students.length,
      totalEnrollments: enrollments.length,
      attendanceRate: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
      pendingAppointments,
      pendingLeave,
      totalMaterials: materials.length,
      totalHomework: homework.length,
      totalQuizzes: quizzes.length,
      totalSchedule: schedule.length,
    };
  },

  getStudentStats: (studentId: string) => {
    const enrollments = getCollection<Enrollment>('enrollments').filter((e) => e.studentId === studentId && e.status === 'confirmed');
    const courses = getCollection<Course>('courses').filter((c) => enrollments.some((e) => e.courseId === c.id));
    const attendances = getCollection<Attendance>('attendance').filter((a) => a.studentId === studentId);
    const presentCount = attendances.filter((a) => a.status === 'present').length;
    const totalCount = attendances.length;
    const appointments = getCollection<Appointment>('appointments').filter((a) => a.studentId === studentId);
    const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;
    const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
    const leaveRequests = getCollection<LeaveRequest>('leaveRequests').filter((l) => l.studentId === studentId);
    const pendingLeave = leaveRequests.filter((l) => l.status === 'pending').length;
    const homework = getCollection<Homework>('homework').filter((h) => h.studentId === studentId);
    const pendingHomework = homework.filter((h) => h.status === 'pending').length;
    const quizAttempts = getCollection<QuizAttempt>('quizAttempts').filter((a) => a.studentId === studentId);
    const avgScore = quizAttempts.length > 0 ? Math.round(quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length) : 0;
    const materials = getCollection<Material>('materials').filter((m) => m.studentId === studentId);
    
    return {
      enrolledCourses: courses.length,
      totalEnrollments: enrollments.length,
      attendanceRate: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
      totalAttendance: totalCount,
      presentCount,
      pendingAppointments,
      completedAppointments,
      pendingLeave,
      totalHomework: homework.length,
      pendingHomework,
      avgQuizScore: avgScore,
      totalMaterials: materials.length,
    };
  },

  // Weekly attendance stats for teacher
  getWeeklyAttendanceStats: (teacherId: string, weekStart: string) => {
    const courses = getCollection<Course>('courses').filter((c) => c.teacherId === teacherId);
    const courseIds = courses.map((c) => c.id);
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const stats = days.map((day, idx) => {
      const dayDate = addDaysFa(weekStart, idx);
      const dayAttendances = getCollection<Attendance>('attendance').filter((a) => {
        return courseIds.includes(a.courseId) && a.date === dayDate;
      });
      const present = dayAttendances.filter((a) => a.status === 'present').length;
      const absent = dayAttendances.filter((a) => a.status === 'absent').length;
      const late = dayAttendances.filter((a) => a.status === 'late').length;
      const total = dayAttendances.length;
      return { day, date: dayDate, present, absent, late, total, rate: total > 0 ? Math.round((present / total) * 100) : 0 };
    });
    return stats;
  },

  // Certificates
  getCertificates: () => getCollection<Certificate>('certificates'),
  getCertificatesByStudent: (studentId: string) => getCollection<Certificate>('certificates').filter((c) => c.studentId === studentId),
  addCertificate: (c: Omit<Certificate, 'id'>) => addItem<Certificate>('certificates', { ...c, id: generateId('ct') }),

  // Students of courses (for attendance)
  getStudentsByCourse: (courseId: string) => {
    const enrollments = getCollection<Enrollment>('enrollments').filter((e) => e.courseId === courseId && e.status === 'confirmed');
    const studentIds = enrollments.map((e) => e.studentId);
    return getCollection<User>('users').filter((u) => studentIds.includes(u.id));
  },

  // Map public course id (courses-data) to store course
  getCourseByDataId: (dataId: string) => {
    const map: Record<string, string> = {
      children: 'c1',
      junior: 'c2',
      adult: 'c3',
      conversation: 'c4',
      ttc: 'c5',
      moc: 'c6',
      book_movie: 'c8',
      'book-movie': 'c8',
      online: 'c7',
    };
    const storeId = map[dataId];
    if (storeId) {
      const found = getCollection<Course>('courses').find((c) => c.id === storeId);
      if (found) return found;
    }
    const categoryMap: Record<string, string> = {
      'کودکان': 'c1',
      'نوجوانان': 'c2',
      'بزرگسالان': 'c3',
      'مکالمه': 'c4',
      'TTC': 'c5',
      'آزمون': 'c6',
      'آنلاین': 'c7',
      'فرهنگی': 'c8',
    };
    const cat = categoryMap[dataId];
    if (cat) {
      return getCollection<Course>('courses').find((c) => c.id === cat);
    }
    return undefined;
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
