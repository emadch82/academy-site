import mongoose from 'mongoose';
import { NotificationType, NotificationChannel, NotificationStatus } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 2000 },
  data: { type: Schema.Types.Mixed, default: null },
  channels: [{ type: String, enum: Object.values(NotificationChannel) }],
  status: { type: String, enum: Object.values(NotificationStatus), default: NotificationStatus.UNREAD, index: true },
  readAt: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(notificationSchema);

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export interface NotificationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels: string[];
  status: string;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationModel = model<NotificationDocument>('Notification', notificationSchema);


const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
  unreadCount: { type: Number, default: 0 },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(conversationSchema);

conversationSchema.index({ participants: 1 });

export interface ConversationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  unreadCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ConversationModel = model<ConversationDocument>('Conversation', conversationSchema);


const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true, maxlength: 5000 },
  type: { type: String, enum: ['text', 'file', 'image', 'system'], default: 'text' },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(messageSchema);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

export interface MessageDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const MessageModel = model<MessageDocument>('Message', messageSchema);

