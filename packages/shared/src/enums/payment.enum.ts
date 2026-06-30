/** وضعیت پرداخت */
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

/** نوع تراکنش مالی */
export enum TransactionType {
  TUITION = 'tuition', // شهریه دوره
  REFUND = 'refund', // بازگشت وجه
  TEACHER_PAYOUT = 'teacher_payout', // تسویه مدرس
  EXPENSE = 'expense', // هزینه
  WALLET_TOPUP = 'wallet_topup', // شارژ کیف پول
  WALLET_DEDUCT = 'wallet_deduct', // کسر از کیف پول
}

/** ارائه‌دهنده‌ی درگاه پرداخت (قابل تعویض) */
export enum PaymentProvider {
  ZARINPAL = 'zarinpal',
  IDPAY = 'idpay',
  WALLET = 'wallet',
}

/** وضعیت فاکتور */
export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  VOID = 'void',
}
