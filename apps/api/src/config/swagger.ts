import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

/**
 * تعریف minimum OpenAPI spec — فقط info و security scheme.
 * مسیرها و schema ها به‌صورت خودکار از JSDoc @openapi روی route ها خوانده نمی‌شوند؛
 * این فایل فقط UI را سرو می‌کند. (در فازهای بعد با annotations کامل می‌شود.)
 */
const spec = {
  openapi: '3.0.3',
  info: {
    title: 'API سامانه آموزشگاه هوشمند',
    version: '0.1.0',
    description: 'مستندات REST API بک‌اند سامانه آموزشگاه',
  },
  servers: [{ url: '/api/v1', description: 'نسخه‌ی ۱' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'amz_access',
      },
    },
  },
  paths: {},
};

router.use('/', swaggerUi.serve, swaggerUi.setup(spec, {
  customSiteTitle: 'مستندات API — آموزشگاه',
}));

export const swaggerDocs = router;
