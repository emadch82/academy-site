import type { Request, Response, NextFunction } from 'express';
import { EnrollmentModel, CourseModel } from '@amozesh/database';
import { Errors, EnrollmentStatus, type PaginationQueryInput } from '@amozesh/shared';

export async function getEnrollments(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & {
      status?: string;
      courseId?: string;
      studentId?: string;
      branchId?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.branchId) filter.branchId = req.query.branchId;

    const [items, total] = await Promise.all([
      EnrollmentModel.find(filter)
        .populate('studentId', 'fullName mobile email')
        .populate('courseId', 'title type')
        .populate('branchId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      EnrollmentModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getEnrollmentById(req: Request, res: Response, next: NextFunction) {
  try {
    const enrollment = await EnrollmentModel.findById(req.params.id)
      .populate('studentId', 'fullName mobile email avatarUrl')
      .populate('courseId', 'title type level price')
      .populate('branchId', 'name address')
      .populate('classroomId', 'name capacity')
      .lean();
    if (!enrollment) throw Errors.notFound('ثبت‌نام یافت نشد');
    res.ok(enrollment);
  } catch (err) {
    next(err);
  }
}

export async function createEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;

    // بررسی ظرفیت دوره
    const course = await CourseModel.findById(data.courseId);
    if (!course) throw Errors.notFound('دوره یافت نشد');
    if (course.capacity && course.enrolledCount >= course.capacity) {
      throw Errors.badRequest('ظرفیت دوره تکمیل شده است');
    }

    // بررسی تکراری نبودن ثبت‌نام
    const existing = await EnrollmentModel.findOne({
      studentId: data.studentId,
      courseId: data.courseId,
      status: { $in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.PENDING] },
    });
    if (existing) throw Errors.conflict('دانشجو قبلاً در این دوره ثبت‌نام کرده است');

    const enrollment = await EnrollmentModel.create(data);

    // افزایش شمارنده ثبت‌نام دوره
    await CourseModel.findByIdAndUpdate(data.courseId, { $inc: { enrolledCount: 1 } });

    res.created(enrollment, 'ثبت‌نام با موفقیت انجام شد');
  } catch (err) {
    next(err);
  }
}

export async function cancelEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment) throw Errors.notFound('ثبت‌نام یافت نشد');

    if (enrollment.status === EnrollmentStatus.CANCELED) {
      throw Errors.badRequest('ثبت‌نام قبلاً لغو شده است');
    }

    enrollment.status = EnrollmentStatus.CANCELED;
    enrollment.updatedBy = req.user?.id as any;
    await enrollment.save();

    // کاهش شمارنده ثبت‌نام دوره
    await CourseModel.findByIdAndUpdate(enrollment.courseId, { $inc: { enrolledCount: -1 } });

    res.ok(enrollment, 'ثبت‌نام با موفقیت لغو شد');
  } catch (err) {
    next(err);
  }
}
