import type { Request, Response, NextFunction } from 'express';
import { AttendanceModel, ClassSessionModel, EnrollmentModel } from '@amozesh/database';
import { Errors, AttendanceStatus, type PaginationQueryInput } from '@amozesh/shared';

export async function getAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 50 } = req.query as PaginationQueryInput & {
      sessionId?: string;
      studentId?: string;
      courseId?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 50, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.courseId) {
      const sessions = await ClassSessionModel.find({ courseId: req.query.courseId }).select('_id').lean();
      filter.sessionId = { $in: sessions.map((s) => s._id) };
    }

    const [items, total] = await Promise.all([
      AttendanceModel.find(filter)
        .populate('sessionId', 'title date')
        .populate('studentId', 'fullName mobile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AttendanceModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function markAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, studentId, status, method, notes } = req.body;

    // بررسی وجود جلسه
    const session = await ClassSessionModel.findById(sessionId);
    if (!session) throw Errors.notFound('جلسه یافت نشد');

    // بررسی ثبت‌نام دانشجو
    const enrollment = await EnrollmentModel.findOne({
      studentId,
      courseId: session.courseId,
      status: 'active',
    });
    if (!enrollment) throw Errors.badRequest('دانشجو در این دوره ثبت‌نام نشده است');

    // بررسی تکراری نبودن
    const existing = await AttendanceModel.findOne({ sessionId, studentId });
    if (existing) {
      existing.status = status;
      existing.method = method;
      existing.notes = notes;
      existing.updatedBy = req.user?.id as any;
      await existing.save();
      res.ok(existing, 'حضور و غیاب به‌روزرسانی شد');
      return;
    }

    const attendance = await AttendanceModel.create({
      sessionId,
      studentId,
      status,
      method,
      notes,
      markedBy: req.user?.id,
      createdBy: req.user?.id,
    });

    // افزایش شمارنده حضور جلسه
    if (status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE) {
      await ClassSessionModel.findByIdAndUpdate(sessionId, { $inc: { attendanceCount: 1 } });
    }

    res.created(attendance, 'حضور و غیاب ثبت شد');
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, studentId } = req.query as { courseId?: string; studentId?: string };

    if (!courseId) throw Errors.badRequest('courseId الزامی است');

    const sessions = await ClassSessionModel.find({ courseId }).lean();
    const sessionIds = sessions.map((s) => s._id);

    const attendances = await AttendanceModel.find({
      sessionId: { $in: sessionIds },
      ...(studentId ? { studentId } : {}),
    }).lean();

    // گزارش بر اساس دانشجو
    const report = attendances.reduce((acc, att) => {
      const sid = String(att.studentId);
      if (!acc[sid]) {
        acc[sid] = { studentId: sid, present: 0, absent: 0, late: 0, excused: 0, total: 0 };
      }
      acc[sid].total++;
      if (att.status === AttendanceStatus.PRESENT) acc[sid].present++;
      else if (att.status === AttendanceStatus.ABSENT) acc[sid].absent++;
      else if (att.status === AttendanceStatus.LATE) acc[sid].late++;
      else if (att.status === AttendanceStatus.EXCUSED) acc[sid].excused++;
      return acc;
    }, {} as Record<string, any>);

    res.ok({
      totalSessions: sessions.length,
      report: Object.values(report),
    });
  } catch (err) {
    next(err);
  }
}
