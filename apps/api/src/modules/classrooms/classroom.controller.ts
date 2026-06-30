import type { Request, Response, NextFunction } from 'express';
import { ClassroomModel } from '@amozesh/database';
import { Errors, type PaginationQueryInput } from '@amozesh/shared';

export async function getClassrooms(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, search, sort = 'createdAt', order = 'desc' } = req.query as PaginationQueryInput & { search?: string; branchId?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.branchId) filter.branchId = req.query.branchId;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      ClassroomModel.find(filter)
        .populate('branchId', 'name')
        .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ClassroomModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getClassroomById(req: Request, res: Response, next: NextFunction) {
  try {
    const classroom = await ClassroomModel.findById(req.params.id).populate('branchId', 'name').lean();
    if (!classroom) throw Errors.notFound('کلاس یافت نشد');
    res.ok(classroom);
  } catch (err) {
    next(err);
  }
}

export async function createClassroom(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const classroom = await ClassroomModel.create(data);
    res.created(classroom, 'کلاس با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateClassroom(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const classroom = await ClassroomModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!classroom) throw Errors.notFound('کلاس یافت نشد');
    res.ok(classroom, 'کلاس با موفقیت به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteClassroom(req: Request, res: Response, next: NextFunction) {
  try {
    const classroom = await ClassroomModel.findById(req.params.id);
    if (!classroom) throw Errors.notFound('کلاس یافت نشد');
    await classroom.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}
