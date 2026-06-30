/** وضعیت سرنخ */
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERESTED = 'interested',
  CONVERTED = 'converted',
  LOST = 'lost',
  FOLLOW_UP = 'follow_up',
}

/** منبع سرنخ */
export enum LeadSource {
  WEBSITE = 'website',
  PHONE = 'phone',
  WALK_IN = 'walk_in',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  ADVERTISEMENT = 'advertisement',
  CAMPAIGN = 'campaign',
  OTHER = 'other',
}

/** نوع تماس */
export enum ContactType {
  CALL = 'call',
  SMS = 'sms',
  EMAIL = 'email',
  MEETING = 'meeting',
  WHATSAPP = 'whatsapp',
  OTHER = 'other',
}

/** اولویت تماس */
export enum ContactPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/** وضعیت پیگیری */
export enum FollowUpStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}
