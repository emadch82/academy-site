/** نوع اعلان */
export enum NotificationType {
  SYSTEM = 'system',
  COURSE = 'course',
  PAYMENT = 'payment',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  ATTENDANCE = 'attendance',
  CERTIFICATE = 'certificate',
  CHAT = 'chat',
  PROMOTION = 'promotion',
  REMINDER = 'reminder',
}

/** کانال اعلان */
export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

/** وضعیت اعلان */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}
