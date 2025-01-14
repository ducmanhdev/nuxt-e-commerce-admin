export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const ROWS_PER_PAGE_OPTIONS = [3, 5, 10, 20, 30, 40]
export const ACCEPTED_UPLOAD_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
export const MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES = 2 * 1024 * 1024

export const CURRENCY_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code',
  currencySign: 'accounting'
} as const

export const COMMON_STATUSES = {
  VISIBLE: 0,
  HIDDEN: 1,
  ARCHIVED: 2
} as const

export const FEEDBACK_STARTS = {
  ONE: 0,
  TWO: 1,
  THREE: 2,
  FOUR: 3,
  FIVE: 4
} as const

export const VOUCHER_DISCOUNT_TYPES = {
  PERCENTAGE: 0,
  FIXED: 1
} as const

export const VOUCHER_STATUSES = {
  ACTIVE: 0,
  INACTIVE: 1,
  EXPIRED: 2,
  REVOKED: 3
} as const

export const PAYMENT_TYPES = {
  CREDIT_CARD: 0,
  CASH: 1
}

export const ORDER_STATUSES = {
  PENDING: 0, // Order is created but not yet processed
  CONFIRMED: 1, // Order is confirmed and payment is successful
  CANCELED: 2, // Order is canceled by the user or admin
  FAILED: 3, // Payment failed or order couldn't be processed
  SHIPPED: 4, // Order is shipped (optional, for delivery tracking)
  COMPLETED: 5 // Order is delivered or successfully completed
}
