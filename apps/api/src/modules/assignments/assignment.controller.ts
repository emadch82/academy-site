import type { Request, Response, NextFunction } from 'express';
import { AssignmentModel, AssignmentSubmissionModel } from '@amozesh/database';
import { Errors, AssignmentSubmissionStatus, type PaginationQueryInput } from '@amozesh/shared';

export async function getAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & { courseId?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const [items, total] = await Promise.all([
      AssignmentModel.find(filter)
        .populate('courseId', 'title')
        .sort({ dueDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AssignmentModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getAssignmentById(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await AssignmentModel.findById(req.params.id).populate('courseId', 'title').lean();
    if (!assignment) throw Errors.notFound('تکلیف یافت نشد');

    const submissions = await AssignmentSubmissionModel.find({ assignmentId: req.params.id })
      .populate('studentId', 'fullName mobile')
      .lean();

    res.ok({ ...assignment, submissions });
  } catch (err) {
    next(err);
  }
}

export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const assignment = await AssignmentModel.create(data);
    res.created(assignment, 'تکلیف با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const assignment = await AssignmentModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!assignment) throw Errors.notFound('تکلیف یافت نشد');
    res.ok(assignment, 'تکلیف به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await AssignmentModel.findById(req.params.id);
    if (!assignment) throw Errors.notFound('تکلیف یافت نشد');
    await assignment.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}

export async function submitAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignment = await AssignmentModel.findById(req.params.id);
    if (!assignment) throw Errors.notFound('تکلیف یافت نشد');
    if (assignment.status !== 'active') throw Errors.badRequest('تکلیف فعال نیست');

    // بررسی مهلت
    if (new Date() > assignment.dueDate) {
      throw Errors.badRequest('مهلت تکلیف تمام شده است');
    }

    // بررسی تعداد تلاش
    const previousAttempts = await AssignmentSubmissionModel.countDocuments({
      assignmentId: req.params.id,
      studentId: req.user?.id,
    });
    if (previousAttempts >= (assignment.maxSubmissions || 1)) {
      throw Errors.badRequest('تعداد تلاش‌های مجاز تمام شده است');
    }

    const { files, notes } = req.body;

    const submission = await AssignmentSubmissionModel.create({
      assignmentId: req.params.id,
      studentId: req.user?.id,
      files,
      notes,
      status: AssignmentSubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
      createdBy: req.user?.id,
    });

    // افزایش شمارنده تحویل‌ها
    await AssignmentModel.findByIdAndUpdate(req.params.id, { $inc: { submissionsCount: 1 } });

    res.created(submission, 'تکلیف با موفقیت تحویل داده شد');
  } catch (err) {
    next(err);
  }
}

export async function gradeSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const { grade, feedback } = req.body;
    const submission = await AssignmentSubmissionModel.findByIdAndUpdate(
      req.params.submissionId,
      {
        grade,
        feedback,
        status: AssignmentSubmissionStatus.GRADED,
        gradedBy: req.user?.id,
        gradedAt: new Date(),
      },
      { new: true },
    );
    if (!submission) throw Errors.notFound('تحویل یافت نشد');
    res.ok(submission, 'نمره با موفقیت ثبت شد');
  } catch (err) {
    next(err);
  }
}
