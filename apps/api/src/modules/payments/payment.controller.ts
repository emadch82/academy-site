import type { Request, Response, NextFunction } from 'express';
import { InvoiceModel, PaymentModel, TransactionModel } from '@amozesh/database';
import { Errors, PaymentStatus, InvoiceStatus, TransactionType, type PaginationQueryInput } from '@amozesh/shared';

function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${date}-${random}`;
}

export async function getInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & {
      status?: string;
      userId?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) filter.userId = req.query.userId;

    const [items, total] = await Promise.all([
      InvoiceModel.find(filter)
        .populate('userId', 'fullName mobile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      InvoiceModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceById(req: Request, res: Response, next: NextFunction) {
  try {
    const invoice = await InvoiceModel.findById(req.params.id)
      .populate('userId', 'fullName mobile email')
      .lean();
    if (!invoice) throw Errors.notFound('فاکتور یافت نشد');
    res.ok(invoice);
  } catch (err) {
    next(err);
  }
}

export async function createInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, items, discount = 0, discountCode, tax = 0, notes, dueDate } = req.body;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
    const total = subtotal - discount + tax;

    const invoice = await InvoiceModel.create({
      invoiceNumber: generateInvoiceNumber(),
      userId,
      items,
      subtotal,
      discount,
      discountCode,
      tax,
      total,
      status: InvoiceStatus.ISSUED,
      notes,
      dueDate,
      createdBy: req.user?.id,
    });

    res.created(invoice, 'فاکتور با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { invoiceId, provider, callbackUrl } = req.body;

    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice) throw Errors.notFound('فاکتور یافت نشد');
    if (invoice.status === InvoiceStatus.PAID) throw Errors.badRequest('فاکتور قبلاً پرداخت شده است');
    if (invoice.status === InvoiceStatus.VOID) throw Errors.badRequest('فاکتور باطل شده است');

    const payment = await PaymentModel.create({
      invoiceId,
      userId: req.user?.id,
      amount: invoice.total,
      currency: invoice.currency,
      provider,
      status: PaymentStatus.PENDING,
      callbackUrl,
      createdBy: req.user?.id,
    });

    // TODO: اتصال به درگاه پرداخت واقعی
    // برای تست، پرداخت موفق فرض می‌شود
    const trackingCode = `PAY-${Date.now()}`;

    res.ok({
      paymentId: payment._id,
      trackingCode,
      paymentUrl: `https://payment.example.com/${trackingCode}`,
      amount: invoice.total,
    }, 'درخواست پرداخت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { trackingCode } = req.params;

    const payment = await PaymentModel.findOne({ trackingCode });
    if (!payment) throw Errors.notFound('پرداخت یافت نشد');

    // TODO: واقعی کردن تایید پرداخت
    payment.status = PaymentStatus.SUCCESS;
    payment.paidAt = new Date();
    await payment.save();

    // به‌روزرسانی فاکتور
    await InvoiceModel.findByIdAndUpdate(payment.invoiceId, {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    });

    // ثبت تراکنش
    await TransactionModel.create({
      userId: payment.userId,
      type: TransactionType.TUITION,
      amount: payment.amount,
      currency: payment.currency,
      status: PaymentStatus.SUCCESS,
      provider: payment.provider as any,
      trackingCode: payment.trackingCode,
      invoiceId: payment.invoiceId,
      createdBy: req.user?.id,
    });

    res.ok({ status: 'success', message: 'پرداخت با موفقیت تایید شد' });
  } catch (err) {
    next(err);
  }
}

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, type, status, userId, dateFrom, dateTo } = req.query as PaginationQueryInput & any;
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as any).$gte = new Date(dateFrom);
      if (dateTo) (filter.createdAt as any).$lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      TransactionModel.find(filter)
        .populate('userId', 'fullName mobile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      TransactionModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getFinancialReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string };

    const filter: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as any).$gte = new Date(dateFrom);
      if (dateTo) (filter.createdAt as any).$lte = new Date(dateTo);
    }

    const [transactions, invoiceStats] = await Promise.all([
      TransactionModel.find(filter).lean(),
      InvoiceModel.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } },
      ]),
    ]);

    const totalRevenue = transactions
      .filter((t) => t.type === TransactionType.TUITION && t.status === PaymentStatus.SUCCESS)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    res.ok({
      period: { from: dateFrom || 'all', to: dateTo || 'all' },
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      transactionsCount: transactions.length,
      invoiceStats,
    });
  } catch (err) {
    next(err);
  }
}
