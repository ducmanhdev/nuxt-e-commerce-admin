import { z } from 'zod'
import { VOUCHER_DISCOUNT_TYPES } from '~/constants'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

const futureDate = dayjs().subtract(1, 'minute').toDate()

export default z
  .object({
    code: z.string().min(1, 'Code is required'),
    discountType: z.nativeEnum(VOUCHER_DISCOUNT_TYPES, {
      message: `Discount type is required and must be one of: ${Object.keys(VOUCHER_DISCOUNT_TYPES).join(', ')}`
    }),
    discountValue: z.coerce.number().positive('Discount value must be non-negative'),
    minOrderValue: z.coerce.number().positive('Min order value must be non-negative'),
    maxDiscount: z.coerce.number().optional(),
    usageLimit: z.coerce.number().positive('Usage limit value must be non-negative'),
    startDate: z.coerce.date().min(futureDate, { message: 'Start date must be later than the current date and time.' }),
    endDate: z.coerce.date({ message: 'End date is required' })
  })
  .refine((data) => dayjs(data.endDate).isSameOrAfter(dayjs(data.startDate)), {
    message: 'End date must be the same or greater than start date',
    path: ['endDate']
  })
  .refine(
    (data) => {
      if (data.discountType === VOUCHER_DISCOUNT_TYPES.PERCENTAGE) {
        return data.maxDiscount !== undefined && data.maxDiscount > 0
      }
      return true
    },
    {
      message: 'Max discount must be a positive number when discount type is PERCENTAGE',
      path: ['maxDiscount']
    }
  )
