/** نوع تخفیف */
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

/** وضعیت کد تخفیف */
export enum DiscountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  USAGE_LIMIT_REACHED = 'usage_limit_reached',
}

/** هدف تخفیف */
export enum DiscountTarget {
  ALL = 'all',
  COURSE = 'course',
  CATEGORY = 'category',
  USER = 'user',
  FIRST_PURCHASE = 'first_purchase',
}
