import type { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '@amozesh/database';
import { Errors, NotificationStatus, type PaginationQueryInput } from '@amozesh/shared';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, status } = req.query as PaginationQueryInput & { status?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { userId: req.user?.id };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      NotificationModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { status: NotificationStatus.READ, readAt: new Date() },
      { new: true },
    );
    if (!notification) throw Errors.notFound('اعلان یافت نشد');
    res.ok(notification);
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await NotificationModel.updateMany(
      { userId: req.user?.id, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
    res.ok({ message: 'همه اعلان‌ها خوانده شدند' });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await NotificationModel.countDocuments({
      userId: req.user?.id,
      status: NotificationStatus.UNREAD,
    });
    res.ok({ count });
  } catch (err) {
    next(err);
  }
}
