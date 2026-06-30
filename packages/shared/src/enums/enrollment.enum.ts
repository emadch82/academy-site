/** وضعیت ثبت‌نام */
export enum EnrollmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  WAITLISTED = 'waitlisted',
  SUSPENDED = 'suspended',
}

 /** نوع ثبت‌نام */
export enum EnrollmentType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  PHONE = 'phone',
  WALK_IN = 'walk_in',
}
