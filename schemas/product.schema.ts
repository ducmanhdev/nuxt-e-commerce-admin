import { z } from 'zod'
import { COMMON_STATUSES } from '~/constants'

export const attributeValidator = z.object({
  name: z.string().min(1, 'Please enter product attribute name'),
  value: z.string().min(1, 'Please enter product attribute value'),
})

export default z.object({
  name: z.string().min(1, 'Please enter product name'),
  description: z.string().min(1, 'Please enter product description'),
  status: z.nativeEnum(COMMON_STATUSES, {
    required_error: 'Product status is required',
    invalid_type_error: 'Product status is not valid',
  }),
  // brandId: z.string().min(1, 'Please select product brand'),
  categoryId: z.string().min(1, 'Please select product category'),
  attributes: z.array(attributeValidator).optional(),
  // status: z.number().or(z.string()).pipe(z.coerce.number().positive('Status is not valid')),
  // images: z.array(z.string().url().min(1, 'Please add at least one image URL')),
})
