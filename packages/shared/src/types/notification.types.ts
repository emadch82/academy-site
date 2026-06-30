import type {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '../enums/index.js';

/** DTO اعلان */
export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels: NotificationChannel[];
  status: NotificationStatus;
  readAt?: Date;
  createdAt: Date;
}

/** DTO ایجاد اعلان */
export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

/** DTO پیام چت */
export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

/** DTO مکالمه */
export interface ConversationDto {
  id: string;
  participants: string[];
  participantNames?: Record<string, string>;
  lastMessage?: MessageDto;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
