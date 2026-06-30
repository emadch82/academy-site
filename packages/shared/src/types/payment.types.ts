import type {
  PaymentStatus,
  PaymentProvider,
  TransactionType,
  InvoiceStatus,
} from '../enums/index.js';

/** DTO تراکنش مالی */
export interface TransactionDto {
  id: string;
  userId: string;
  userName?: string;
  type: TransactionType;
  amount: number; // ریال
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  trackingCode?: string;
  referenceCode?: string;
  description?: string;
  courseId?: string;
  courseName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/** DTO فاکتور */
export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName?: string;
  items: InvoiceItemDto[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: Date;
  paidAt?: Date;
  dueDate?: Date;
  notes?: string;
  payments?: PaymentDto[];
  createdAt: Date;
  updatedAt: Date;
}

/** آیتم فاکتور */
export interface InvoiceItemDto {
  description: string;
  courseId?: string;
  courseName?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

/** DTO پرداخت */
export interface PaymentDto {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  userId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  trackingCode?: string;
  referenceCode?: string;
  cardNumber?: string; // last 4 digits
  paymentUrl?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO تسویه استاد */
export interface TeacherPayoutDto {
  id: string;
  teacherId: string;
  teacherName?: string;
  courseId: string;
  courseName?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  period?: {
    from: Date;
    to: Date;
  };
  transactionsCount: number;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO گزارش مالی */
export interface FinancialReportDto {
  period: {
    from: Date;
    to: Date;
  };
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueByCourse: Array<{
    courseId: string;
    courseName: string;
    amount: number;
    count: number;
  }>;
  revenueByBranch: Array<{
    branchId: string;
    branchName: string;
    amount: number;
    count: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    amount: number;
  }>;
  paymentMethodStats: Array<{
    provider: PaymentProvider;
    count: number;
    amount: number;
  }>;
}
