/** انواع دوره‌های آموزشی */
export enum CourseType {
  /** حضوری در کلاس فیزیکی */
  IN_PERSON = 'in_person',
  /** آنلاین زنده (وبینار) */
  LIVE_ONLINE = 'live_online',
  /** آفلاین (ویدئو ضبط‌شده) */
  OFFLINE = 'offline',
  /** ترکیبی: حضوری + آنلاین + آفلاین */
  HYBRID = 'hybrid',
}

export const ALL_COURSE_TYPES: CourseType[] = [
  CourseType.IN_PERSON,
  CourseType.LIVE_ONLINE,
  CourseType.OFFLINE,
  CourseType.HYBRID,
];

export const COURSE_TYPE_LABELS_FA: Record<CourseType, string> = {
  [CourseType.IN_PERSON]: 'حضوری',
  [CourseType.LIVE_ONLINE]: 'آنلاین زنده',
  [CourseType.OFFLINE]: 'آفلاین',
  [CourseType.HYBRID]: 'ترکیبی',
};

/** وضعیت کلی یک دوره */
export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  CANCELED = 'canceled',
}

/** سطح دوره */
export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels',
}
