import type { Request, Response, NextFunction } from 'express';
import { BranchModel } from '@amozesh/database';
import { Errors, type PaginationQueryInput } from '@amozesh/shared';
import slug from 'slug';

export async function getBranches(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, search, sort = 'createdAt', order = 'desc' } = req.query as PaginationQueryInput & { search?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      BranchModel.find(filter)
        .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BranchModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getBranchById(req: Request, res: Response, next: NextFunction) {
  try {
    const branch = await BranchModel.findById(req.params.id).lean();
    if (!branch) throw Errors.notFound('شعبه یافت نشد');
    res.ok(branch);
  } catch (err) {
    next(err);
  }
}

export async function createBranch(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.slug = slug(data.name);
    data.createdBy = req.user?.id;
    const branch = await BranchModel.create(data);
    res.created(branch, 'شعبه با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateBranch(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.name && !data.slug) {
      data.slug = slug(data.name);
    }
    data.updatedBy = req.user?.id;
    const branch = await BranchModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!branch) throw Errors.notFound('شعبه یافت نشد');
    res.ok(branch, 'شعبه با موفقیت به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteBranch(req: Request, res: Response, next: NextFunction) {
  try {
    const branch = await BranchModel.findById(req.params.id);
    if (!branch) throw Errors.notFound('شعبه یافت نشد');
    await branch.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}
