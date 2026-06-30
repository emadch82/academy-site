import mongoose from 'mongoose';
import { LeadStatus, LeadSource } from '@amozesh/shared';
import { applySoftDelete, baseSchemaFields, baseSchemaOptions } from '../plugins/base.schema.js';

const { Schema, model } = mongoose;

const leadSchema = new Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  mobile: { type: String, required: true, trim: true, index: true },
  email: { type: String, default: null, lowercase: true, trim: true },
  source: { type: String, enum: Object.values(LeadSource), required: true, index: true },
  status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW, index: true },
  interestedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  notes: { type: String, maxlength: 2000 },
  tags: [{ type: String }],
  lastContactAt: { type: Date, default: null },
  nextFollowUpAt: { type: Date, default: null },
  convertedAt: { type: Date, default: null },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(leadSchema);

leadSchema.index({ mobile: 1 });
leadSchema.index({ status: 1, assignedTo: 1 });
leadSchema.index({ nextFollowUpAt: 1 });

export interface LeadDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  mobile: string;
  email?: string;
  source: string;
  status: string;
  interestedCourses?: mongoose.Types.ObjectId[];
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  tags?: string[];
  lastContactAt?: Date;
  nextFollowUpAt?: Date;
  convertedAt?: Date;
  studentId?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const LeadModel = model<LeadDocument>('Lead', leadSchema);


const contactSchema = new Schema({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  type: { type: String, enum: ['call', 'sms', 'email', 'meeting', 'whatsapp', 'other'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  subject: { type: String, required: true, maxlength: 200 },
  notes: { type: String, maxlength: 2000 },
  outcome: { type: String, maxlength: 1000 },
  nextFollowUp: { type: Date, default: null },
  duration: { type: Number, default: null },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(contactSchema);

contactSchema.index({ leadId: 1, createdAt: -1 });

export interface ContactDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  type: string;
  priority: string;
  subject: string;
  notes?: string;
  outcome?: string;
  nextFollowUp?: Date;
  duration?: number;
  recordedBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ContactModel = model<ContactDocument>('Contact', contactSchema);


const followUpSchema = new Schema({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
  contactId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
  type: { type: String, enum: ['call', 'sms', 'email', 'meeting', 'whatsapp', 'other'], required: true },
  subject: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  dueDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  completedAt: { type: Date, default: null },
  ...baseSchemaFields,
}, baseSchemaOptions);

applySoftDelete(followUpSchema);

followUpSchema.index({ dueDate: 1, status: 1 });
followUpSchema.index({ assignedTo: 1, status: 1 });

export interface FollowUpDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  contactId?: mongoose.Types.ObjectId;
  type: string;
  subject: string;
  description?: string;
  dueDate: Date;
  status: string;
  assignedTo?: mongoose.Types.ObjectId;
  completedAt?: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const FollowUpModel = model<FollowUpDocument>('FollowUp', followUpSchema);

