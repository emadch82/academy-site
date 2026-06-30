import type { Request, Response, NextFunction } from 'express';
import { CertificateModel } from '@amozesh/database';
import { Errors, CertificateStatus, type PaginationQueryInput } from '@amozesh/shared';
import { v4 as uuidv4 } from 'uuid';

export async function getCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & {
      studentId?: string;
      courseId?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const [items, total] = await Promise.all([
      CertificateModel.find(filter)
        .populate('studentId', 'fullName')
        .populate('courseId', 'title')
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CertificateModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getCertificateById(req: Request, res: Response, next: NextFunction) {
  try {
    const certificate = await CertificateModel.findById(req.params.id)
      .populate('studentId', 'fullName mobile email')
      .populate('courseId', 'title')
      .populate('teacherId', 'fullName')
      .populate('branchId', 'name')
      .lean();
    if (!certificate) throw Errors.notFound('گواهینامه یافت نشد');
    res.ok(certificate);
  } catch (err) {
    next(err);
  }
}

export async function verifyCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const { serialNumber } = req.params;
    const certificate = await CertificateModel.findOne({ serialNumber })
      .populate('studentId', 'fullName')
      .populate('courseId', 'title')
      .lean();

    if (!certificate) {
      res.ok({
        isValid: false,
        message: 'گواهینامه با این شماره سریال یافت نشد',
      });
      return;
    }

    res.ok({
      isValid: certificate.status === CertificateStatus.ISSUED,
      studentName: (certificate.studentId as any)?.fullName,
      courseName: (certificate.courseId as any)?.title,
      issueDate: certificate.issueDate,
      status: certificate.status,
      message: certificate.status === CertificateStatus.ISSUED
        ? 'گواهینامه معتبر است'
        : 'گواهینامه غیرفعال یا باطل شده است',
    });
  } catch (err) {
    next(err);
  }
}

export async function issueCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId, courseId, teacherId, branchId, metadata } = req.body;

    // بررسی تکراری نبودن
    const existing = await CertificateModel.findOne({ studentId, courseId, status: CertificateStatus.ISSUED });
    if (existing) throw Errors.conflict('گواهینامه قبلاً برای این دانشجو صادر شده است');

    const serialNumber = `CERT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const certificate = await CertificateModel.create({
      serialNumber,
      studentId,
      courseId,
      teacherId,
      branchId,
      status: CertificateStatus.ISSUED,
      issueDate: new Date(),
      metadata,
      createdBy: req.user?.id,
    });

    res.created(certificate, 'گواهینامه با موفقیت صادر شد');
  } catch (err) {
    next(err);
  }
}
