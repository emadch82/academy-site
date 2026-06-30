/** وضعیت شعبه */
export enum BranchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RENOVATING = 'renovating',
}

/** وضعیت کلاس */
export enum ClassroomStatus {
  AVAILABLE = 'available',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed',
}

/** نوع کلاس */
export enum ClassroomType {
  REGULAR = 'regular',
  COMPUTER = 'computer',
  LAB = 'lab',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
}
