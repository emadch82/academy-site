/** وضعیت کیف پول */
export enum WalletStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

/** نوع تراکنش کیف پول */
export enum WalletTransactionType {
  TOPUP = 'topup',
  PAYMENT = 'payment',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}
