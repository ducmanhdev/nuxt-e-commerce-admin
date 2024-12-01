import { z } from 'zod'
import dayjs from 'dayjs'
import { VOUCHER_DISCOUNT_TYPES, VOUCHER_STATUSES } from '~/constants'

export default z
  .object({
    code: z.string().min(1, 'Code is required'),
    discountType: z.nativeEnum(VOUCHER_DISCOUNT_TYPES, {
      required_error: 'Discount type status is required',
      invalid_type_error: 'Discount type status is not valid',
    }),
    discountValue: z.number().or(z.string()).pipe(z.coerce.number().positive('Discount value must be non-negative')),
    minOrderValue: z.number().or(z.string()).pipe(z.coerce.number().positive('Min order value must be non-negative')),
    maxDiscount: z.number().or(z.string()).optional().pipe(z.coerce.number()),
    status: z.nativeEnum(VOUCHER_STATUSES, {
      required_error: 'Voucher status is required',
      invalid_type_error: 'Voucher status is not valid',
    }),
    usageLimit: z.number().or(z.string()).pipe(z.coerce.number().positive('Usage limit value must be non-negative')),
    startDate: z
      .date()
      .or(z.string())
      .pipe(z.coerce.date().min(new Date(), { message: 'Start date must be later than the current date and time.' })),
    endDate: z.date().or(z.string()).pipe(z.coerce.date()),
  })
  .refine((data) => dayjs(data.endDate).isAfter(dayjs(data.startDate)), {
    message: 'End date must be greater than start date',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      if (data.discountType === VOUCHER_DISCOUNT_TYPES.PERCENTAGE) {
        const maxDiscountAsNumber = Number(data.maxDiscount)
        return !isNaN(maxDiscountAsNumber) && maxDiscountAsNumber > 0
      }
      return true
    },
    {
      message: 'Max discount must be a positive number when discount type is PERCENTAGE',
      path: ['maxDiscount'],
    },
  )
