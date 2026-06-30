import type {
  LeadStatus,
  LeadSource,
  ContactType,
  ContactPriority,
  FollowUpStatus,
} from '../enums/index.js';

/** DTO سرنخ */
export interface LeadDto {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  interestedCourses?: string[];
  interestedCourseNames?: string[];
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  tags?: string[];
  lastContactAt?: Date;
  nextFollowUpAt?: Date;
  convertedAt?: Date;
  studentId?: string; // after conversion
  createdAt: Date;
  updatedAt: Date;
}

/** DTO تماس */
export interface ContactDto {
  id: string;
  leadId: string;
  leadName?: string;
  type: ContactType;
  priority: ContactPriority;
  subject: string;
  notes?: string;
  outcome?: string;
  nextFollowUp?: Date;
  duration?: number; // minutes
  recordedBy?: string;
  recordedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO پیگیری */
export interface FollowUpDto {
  id: string;
  leadId: string;
  leadName?: string;
  contactId?: string;
  type: ContactType;
  subject: string;
  description?: string;
  dueDate: Date;
  status: FollowUpStatus;
  assignedTo?: string;
  assignedToName?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO کمپین */
export interface CampaignDto {
  id: string;
  name: string;
  description?: string;
  type: 'sms' | 'email' | 'push';
  targetAudience: string[];
  content: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  stats?: CampaignStats;
  createdBy?: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** آمار کمپین */
export interface CampaignStats {
  totalRecipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}
