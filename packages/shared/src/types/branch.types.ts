import type {
  BranchStatus,
  ClassroomStatus,
  ClassroomType,
} from '../enums/index.js';

/** DTO شعبه */
export interface BranchDto {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  phone: string;
  mobile?: string;
  email?: string;
  managerId?: string;
  managerName?: string;
  status: BranchStatus;
  openingHours?: OpeningHours;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  facilities?: string[];
  coverImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** ساعات کاری */
export interface OpeningHours {
  saturday?: DayHours;
  sunday?: DayHours;
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
}

export interface DayHours {
  open: string; // HH:mm
  close: string; // HH:mm
  isClosed?: boolean;
}

/** DTO کلاس */
export interface ClassroomDto {
  id: string;
  branchId: string;
  branchName?: string;
  name: string;
  floor?: number;
  capacity: number;
  reservedSeats: number;
  availableSeats: number;
  type: ClassroomType;
  status: ClassroomStatus;
  facilities?: string[];
  coverImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO صندلی */
export interface SeatDto {
  id: string;
  classroomId: string;
  row: number;
  column: number;
  label: string;
  isOccupied: boolean;
  studentId?: string;
  studentName?: string;
}
