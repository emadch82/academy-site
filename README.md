# سامانه آموزشگاه هوشمند 🎓

سیستم جامع مدیریت آموزشگاه، ثبت‌نام دوره‌ها، آموزش آنلاین و حضوری

## 🚀 ویژگی‌های اصلی

### پنل مدیریت
- مدیریت کاربران (مدیر، استاد، دانشجو، کارمند)
- مدیریت شعب و کلاس‌ها
- مدیریت دوره‌ها و ثبت‌نام
- سیستم مالی و گزارشات
- مدیریت محتوا (CMS)
- CRM و مدیریت سرنخ‌ها

### پنل استاد
- مدیریت کلاس‌ها و جلسات
- ثبت حضور و غیاب
- ساخت آزمون و تصحیح
- ثبت نمرات
- مدیریت تکالیف

### پنل دانشجو
- مشاهده دوره‌ها و جلسات
- شرکت در آزمون‌ها
- مشاهده نمرات و گواهینامه‌ها
- دانلود فایل‌های آموزشی

### سیستم‌های پیشرفته
- کلاس آنلاین با Socket.IO
- سیستم آزمون آنلاین
- صدور گواهینامه دیجیتال
- هوش مصنوعی برای پیشنهاد دوره
- سئو و PWA

## 🛠 تکنولوژی‌ها

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js + TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + Refresh Token + RBAC
- **Realtime:** Socket.IO
- **Storage:** MinIO / AWS S3

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **State:** Redux Toolkit + TanStack Query
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod

### DevOps
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Monorepo:** pnpm workspaces + Turborepo

## 📦 ساختار پروژه

```
amozesh/
├── apps/
│   ├── api/                    # Express.js Backend
│   │   └── src/
│   │       ├── modules/        # ماژول‌های API
│   │       ├── middleware/     # Middleware ها
│   │       ├── config/        # تنظیمات
│   │       └── types/         # Type ها
│   │
│   └── web/                    # Next.js Frontend
│       └── src/
│           ├── app/            # App Router
│           ├── components/     # کامپوننت‌ها
│           ├── hooks/          # Custom Hooks
│           ├── lib/            # Utilities
│           ├── stores/         # Redux Store
│           └── styles/         # استایل‌ها
│
├── packages/
│   ├── config/                 # تنظیمات مشترک
│   ├── database/               # مدل‌های MongoDB
│   └── shared/                 # Types, Enums, Validators
│
├── docker/                     # Docker Configuration
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── nginx/
│
└── .github/
    └── workflows/              # GitHub Actions
```

## 🚀 راه‌اندازی سریع

### پیش‌نیازها
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### ۱. کلون کردن پروژه
```bash
git clone https://github.com/your-repo/amozesh.git
cd amozesh
```

### ۲. نصب وابستگی‌ها
```bash
pnpm install
```

### ۳. کپی فایل محیطی
```bash
cp .env.example .env
# مقادیر .env را ویرایش کنید
```

### ۴. راه‌اندازی دیتابیس
```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### ۵. اجرای پروژه
```bash
# اجرای همزمان Frontend و Backend
pnpm dev

# یا جداگانه
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

### ۶. دسترسی‌ها
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/api-docs
- **MongoDB:** localhost:27017
- **MinIO Console:** http://localhost:9001

## 🐳 Docker

### محیط توسعه
```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### محیط تولید
```bash
docker compose -f docker/docker-compose.yml up -d
```

## 📚 مستندات API

مستندات API در آدرس زیر در دسترس است:
```
http://localhost:5000/api-docs
```

## 🔐 امنیت

- JWT Authentication با Refresh Token Rotation
- RBAC (Role-Based Access Control)
- Rate Limiting
- Input Validation با Zod
- XSS Protection
- CORS Configuration
- Helmet Security Headers

## 🧪 تست‌ها

```bash
# اجرای تست‌ها
pnpm test

# اجرای تست‌ها با Coverage
pnpm test:coverage
```

## 📝 مجوزها

این پروژه تحت مجوز UNLICENSED منتشر شده است.

---

**ساخته شده با ❤️ توسط تیم آموزشگاه هوشمند**
