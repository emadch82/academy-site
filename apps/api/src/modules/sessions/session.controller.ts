import type { Request, Response, NextFunction } from 'express';
import { ClassSessionModel, AttendanceModel } from '@amozesh/database';
import { Errors, type PaginationQueryInput } from '@amozesh/shared';

export async function getSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & {
      courseId?: string;
      teacherId?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) (filter.date as any).$gte = new Date(req.query.dateFrom as string);
      if (req.query.dateTo) (filter.date as any).$lte = new Date(req.query.dateTo as string);
    }

    const [items, total] = await Promise.all([
      ClassSessionModel.find(filter)
        .populate('courseId', 'title')
        .populate('teacherId', 'fullName')
        .populate('classroomId', 'name')
        .sort({ date: -1, startTime: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ClassSessionModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getSessionById(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await ClassSessionModel.findById(req.params.id)
      .populate('courseId', 'title type')
      .populate('teacherId', 'fullName avatarUrl')
      .populate('classroomId', 'name capacity')
      .populate('branchId', 'name')
      .lean();
    if (!session) throw Errors.notFound('جلسه یافت نشد');

    const attendance = await AttendanceModel.find({ sessionId: req.params.id })
      .populate('studentId', 'fullName')
      .lean();

    res.ok({ ...session, attendance });
  } catch (err) {
    next(err);
  }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const session = await ClassSessionModel.create(data);
    res.created(session, 'جلسه با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const session = await ClassSessionModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!session) throw Errors.notFound('جلسه یافت نشد');
    res.ok(session, 'جلسه با موفقیت به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await ClassSessionModel.findById(req.params.id);
    if (!session) throw Errors.notFound('جلسه یافت نشد');
    await session.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}
