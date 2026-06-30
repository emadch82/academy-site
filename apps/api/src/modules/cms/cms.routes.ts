import { Router } from 'express';
import { authenticate, adminOnly } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createArticleSchema, updateArticleSchema, createBannerSchema, updateBannerSchema } from '@amozesh/shared';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getFaqs,
  createFaq,
  getTestimonials,
  createTestimonial,
  approveTestimonial,
} from './cms.controller.js';

const router = Router();

// Articles / News
router.get('/articles', authenticate({ optional: true }), getArticles);
router.get('/articles/:slug', authenticate({ optional: true }), getArticleBySlug);
router.post('/articles', authenticate(), adminOnly(), validate(createArticleSchema), createArticle);
router.put('/articles/:id', authenticate(), adminOnly(), validate(updateArticleSchema), updateArticle);
router.delete('/articles/:id', authenticate(), adminOnly(), deleteArticle);

// Banners
router.get('/banners', authenticate({ optional: true }), getBanners);
router.post('/banners', authenticate(), adminOnly(), validate(createBannerSchema), createBanner);
router.put('/banners/:id', authenticate(), adminOnly(), validate(updateBannerSchema), updateBanner);
router.delete('/banners/:id', authenticate(), adminOnly(), deleteBanner);

// FAQs
router.get('/faqs', authenticate({ optional: true }), getFaqs);
router.post('/faqs', authenticate(), adminOnly(), createFaq);

// Testimonials
router.get('/testimonials', authenticate({ optional: true }), getTestimonials);
router.post('/testimonials', authenticate(), createTestimonial);
router.patch('/testimonials/:id/approve', authenticate(), adminOnly(), approveTestimonial);

export default router;
