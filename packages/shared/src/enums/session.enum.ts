/** وضعیت جلسه */
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  POSTPONED = 'postponed',
}

/** نوع جلسه */
export enum SessionType {
  IN_PERSON = 'in_person',
  LIVE_ONLINE = 'live_online',
  OFFLINE = 'offline',
}

/** وضعیت حضور و غیاب */
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

/** نوع ورود حضور و غیاب */
export enum AttendanceMethod {
  QR_CODE = 'qr_code',
  MANUAL = 'manual',
  ONLINE = 'online',
  BIOMETRIC = 'biometric',
}
