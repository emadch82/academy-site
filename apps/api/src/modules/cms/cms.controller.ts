import type { Request, Response, NextFunction } from 'express';
import { ArticleModel, BannerModel, FaqModel, TestimonialModel } from '@amozesh/database';
import { Errors, PublishStatus, type PaginationQueryInput } from '@amozesh/shared';
import slug from 'slug';

export async function getArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, search } = req.query as PaginationQueryInput & {
      type?: string;
      status?: string;
      isFeatured?: string;
    };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isFeatured) filter.isFeatured = req.query.isFeatured === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      ArticleModel.find(filter)
        .populate('authorId', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ArticleModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getArticleBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await ArticleModel.findOne({ slug: req.params.slug })
      .populate('authorId', 'fullName avatarUrl')
      .lean();
    if (!article) throw Errors.notFound('مقاله یافت نشد');

    // افزایش بازدید
    await ArticleModel.findByIdAndUpdate(article._id, { $inc: { viewCount: 1 } });

    res.ok(article);
  } catch (err) {
    next(err);
  }
}

export async function createArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.slug = slug(data.title);
    data.authorId = req.user?.id;
    data.createdBy = req.user?.id;
    if (data.status === PublishStatus.PUBLISHED) data.publishedAt = new Date();
    const article = await ArticleModel.create(data);
    res.created(article, 'مقاله با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    if (data.title && !data.slug) data.slug = slug(data.title);
    data.updatedBy = req.user?.id;
    if (data.status === PublishStatus.PUBLISHED && !data.publishedAt) data.publishedAt = new Date();
    const article = await ArticleModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!article) throw Errors.notFound('مقاله یافت نشد');
    res.ok(article, 'مقاله به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) throw Errors.notFound('مقاله یافت نشد');
    await article.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}

export async function getBanners(req: Request, res: Response, next: NextFunction) {
  try {
    const { type } = req.query as { type?: string };
    const filter: Record<string, unknown> = { isActive: true };
    if (type) filter.type = type;

    const banners = await BannerModel.find(filter).sort({ order: 1 }).lean();
    res.ok(banners);
  } catch (err) {
    next(err);
  }
}

export async function createBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const banner = await BannerModel.create(data);
    res.created(banner, 'بنر با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const banner = await BannerModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!banner) throw Errors.notFound('بنر یافت نشد');
    res.ok(banner, 'بنر به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) throw Errors.notFound('بنر یافت نشد');
    await banner.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}

export async function getFaqs(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query as { category?: string };
    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    const faqs = await FaqModel.find(filter).sort({ order: 1 }).lean();
    res.ok(faqs);
  } catch (err) {
    next(err);
  }
}

export async function createFaq(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const faq = await FaqModel.create(data);
    res.created(faq, 'سوال با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function getTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const filter: Record<string, unknown> = { isApproved: true };
    const testimonials = await TestimonialModel.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(20)
      .lean();
    res.ok(testimonials);
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.studentId = req.user?.id;
    data.studentName = req.user?.fullName;
    data.createdBy = req.user?.id;
    const testimonial = await TestimonialModel.create(data);
    res.created(testimonial, 'نظر شما ثبت شد و پس از تایید نمایش داده خواهد شد');
  } catch (err) {
    next(err);
  }
}

export async function approveTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const testimonial = await TestimonialModel.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );
    if (!testimonial) throw Errors.notFound('نظر یافت نشد');
    res.ok(testimonial, 'نظر تایید شد');
  } catch (err) {
    next(err);
  }
}
