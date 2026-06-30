import type { Request, Response, NextFunction } from 'express';
import { CourseModel, EnrollmentModel } from '@amozesh/database';
import { Errors, type PaginationQueryInput } from '@amozesh/shared';
import slug from 'slug';

export async function getCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, search, sort = 'createdAt', order = 'desc' } = req.query as PaginationQueryInput & {
      type?: string;
      level?: string;
      status?: string;
      teacherId?: string;
      branchId?: string;
      isFeatured?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;
    if (req.query.branchId) filter.branchId = req.query.branchId;
    if (req.query.isFeatured) filter.isFeatured = req.query.isFeatured === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      CourseModel.find(filter)
        .populate('teacherId', 'fullName avatarUrl')
        .populate('branchId', 'name')
        .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CourseModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getCourseById(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await CourseModel.findById(req.params.id)
      .populate('teacherId', 'fullName avatarUrl email mobile')
      .populate('branchId', 'name address city')
      .lean();
    if (!course) throw Errors.notFound('دوره یافت نشد');
    res.ok(course);
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.slug = slug(data.title);
    data.createdBy = req.user?.id;
    const course = await CourseModel.create(data);
    res.created(course, 'دوره با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    if (data.title && !data.slug) {
      data.slug = slug(data.title);
    }
    data.updatedBy = req.user?.id;
    const course = await CourseModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!course) throw Errors.notFound('دوره یافت نشد');
    res.ok(course, 'دوره با موفقیت به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) throw Errors.notFound('دوره یافت نشد');
    await course.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}

export async function getCourseStats(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId).lean();
    if (!course) throw Errors.notFound('دوره یافت نشد');

    const [enrollments, activeEnrollments] = await Promise.all([
      EnrollmentModel.countDocuments({ courseId }),
      EnrollmentModel.countDocuments({ courseId, status: 'active' }),
    ]);

    res.ok({
      course: course.title,
      totalEnrollments: enrollments,
      activeEnrollments,
      capacity: course.capacity,
      enrolledCount: course.enrolledCount,
    });
  } catch (err) {
    next(err);
  }
}
