import type {
  WalletStatus,
  WalletTransactionType,
  DiscountType,
  DiscountStatus,
  DiscountTarget,
} from '../enums/index.js';

/** DTO کیف پول */
export interface WalletDto {
  id: string;
  userId: string;
  balance: number; // ریال
  currency: string;
  status: WalletStatus;
  transactions?: WalletTransactionDto[];
  createdAt: Date;
  updatedAt: Date;
}

/** DTO تراکنش کیف پول */
export interface WalletTransactionDto {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  createdAt: Date;
}

/** DTO کد تخفیف */
export interface DiscountCodeDto {
  id: string;
  code: string;
  type: DiscountType;
  value: number; // percentage or fixed amount
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  target: DiscountTarget;
  targetIds?: string[]; // course IDs or user IDs
  status: DiscountStatus;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** DTO استفاده از تخفیف */
export interface DiscountUsageDto {
  id: string;
  discountCodeId: string;
  discountCode?: string;
  userId: string;
  userName?: string;
  invoiceId: string;
  invoiceNumber?: string;
  amount: number; // discount amount applied
  createdAt: Date;
}
