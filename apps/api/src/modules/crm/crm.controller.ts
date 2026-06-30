import type { Request, Response, NextFunction } from 'express';
import { LeadModel, ContactModel, FollowUpModel, UserModel } from '@amozesh/database';
import { Errors, LeadStatus, UserRole, type PaginationQueryInput } from '@amozesh/shared';

export async function getLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, search } = req.query as PaginationQueryInput & {
      status?: string;
      source?: string;
      assignedTo?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      LeadModel.find(filter)
        .populate('assignedTo', 'fullName')
        .populate('interestedCourses', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      LeadModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getLeadById(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await LeadModel.findById(req.params.id)
      .populate('assignedTo', 'fullName')
      .populate('interestedCourses', 'title')
      .populate('studentId', 'fullName mobile')
      .lean();
    if (!lead) throw Errors.notFound('سرنخ یافت نشد');

    const contacts = await ContactModel.find({ leadId: req.params.id })
      .populate('recordedBy', 'fullName')
      .sort({ createdAt: -1 })
      .lean();

    const followUps = await FollowUpModel.find({ leadId: req.params.id })
      .populate('assignedTo', 'fullName')
      .sort({ dueDate: 1 })
      .lean();

    res.ok({ ...lead, contacts, followUps });
  } catch (err) {
    next(err);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    if (!data.assignedTo) data.assignedTo = req.user?.id;
    const lead = await LeadModel.create(data);
    res.created(lead, 'سرنخ با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const lead = await LeadModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!lead) throw Errors.notFound('سرنخ یافت نشد');
    res.ok(lead, 'سرنخ به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function convertLead(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await LeadModel.findById(req.params.id);
    if (!lead) throw Errors.notFound('سرنخ یافت نشد');
    if (lead.status === LeadStatus.CONVERTED) throw Errors.badRequest('سرنخ قبلاً تبدیل شده است');

    // ایجاد کاربر دانشجو
    const student = await UserModel.create({
      fullName: lead.fullName,
      email: lead.email || `student_${Date.now()}@temp.com`,
      mobile: lead.mobile,
      password: Math.random().toString(36).slice(-8),
      role: UserRole.STUDENT,
    });

    lead.status = LeadStatus.CONVERTED;
    lead.convertedAt = new Date();
    lead.studentId = student._id;
    await lead.save();

    res.ok({ lead, student }, 'سرنخ با موفقیت به دانشجو تبدیل شد');
  } catch (err) {
    next(err);
  }
}

export async function getContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & { leadId?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.leadId) filter.leadId = req.query.leadId;

    const [items, total] = await Promise.all([
      ContactModel.find(filter)
        .populate('leadId', 'fullName mobile')
        .populate('recordedBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ContactModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function createContact(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.recordedBy = req.user?.id;
    data.createdBy = req.user?.id;
    const contact = await ContactModel.create(data);

    // به‌روزرسانی آخرین تماس سرنخ
    await LeadModel.findByIdAndUpdate(data.leadId, { lastContactAt: new Date() });

    res.created(contact, 'تماس با موفقیت ثبت شد');
  } catch (err) {
    next(err);
  }
}

export async function getFollowUps(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, status } = req.query as PaginationQueryInput & { status?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    // نمایش پیگیری‌های کاربر جاری
    if (req.user?.role !== 'admin') {
      filter.assignedTo = req.user?.id;
    }

    const [items, total] = await Promise.all([
      FollowUpModel.find(filter)
        .populate('leadId', 'fullName mobile')
        .populate('assignedTo', 'fullName')
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      FollowUpModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function createFollowUp(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    if (!data.assignedTo) data.assignedTo = req.user?.id;
    const followUp = await FollowUpModel.create(data);
    res.created(followUp, 'پیگیری با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function completeFollowUp(req: Request, res: Response, next: NextFunction) {
  try {
    const followUp = await FollowUpModel.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true },
    );
    if (!followUp) throw Errors.notFound('پیگیری یافت نشد');
    res.ok(followUp, 'پیگیری با موفقیت تکمیل شد');
  } catch (err) {
    next(err);
  }
}
