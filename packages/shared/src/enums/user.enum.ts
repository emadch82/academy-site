/**
 * نقش‌های کاربری سامانه (RBAC)
 * ترتیب به‌صورت سلسله‌مراتبی نیست؛ هر نقش مجوزهای مخصوص خود را دارد.
 */
export enum UserRole {
  /** مدیر کل سامانه */
  ADMIN = 'admin',
  /** کارمند / پشتیبان / اپراتور */
  STAFF = 'staff',
  /** مدرس دوره */
  TEACHER = 'teacher',
  /** دانشجو */
  STUDENT = 'student',
}

export const ALL_USER_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.STAFF,
  UserRole.TEACHER,
  UserRole.STUDENT,
];

export const USER_ROLE_LABELS_FA: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'مدیر',
  [UserRole.STAFF]: 'کارمند',
  [UserRole.TEACHER]: 'مدرس',
  [UserRole.STUDENT]: 'دانشجو',
};
