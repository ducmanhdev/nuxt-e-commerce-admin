import { z } from 'zod'
import { COMMON_STATUSES } from '~/constants'

export const attributeValidator = z.object({
  name: z.string().min(1, 'Please enter product attribute name'),
  value: z.string().min(1, 'Please enter product attribute value')
})

export const variantOptionValueValidator = z.object({
  optionName: z.string().min(1, 'Please enter variant option name'),
  value: z.string().min(1, 'Please enter variant option value')
})

export const variantValidator = z.object({
  price: z.coerce.number().positive('Please enter a valid price'),
  stock: z.coerce.number().positive('Please enter a valid stock quantity'),
  sku: z.string().min(1, 'Please enter SKU'),
  imageUrl: z.string().url().optional(),
  optionValues: z.array(variantOptionValueValidator).min(1, 'Please provide at least one variant option value')
})

export default z.object({
  name: z.string().min(1, 'Please enter product name'),
  description: z.string().min(1, 'Please enter product description'),
  status: z
    .nativeEnum(COMMON_STATUSES, {
      message: `Status is required and must be one of: ${Object.keys(COMMON_STATUSES).join(', ')}`
    })
    .default(COMMON_STATUSES.VISIBLE),
  categoryId: z.string().min(1, 'Please select product category'),
  brandId: z.string().min(1, 'Please select product brand'),
  attributes: z.array(attributeValidator).optional(),
  variants: z.array(variantValidator).optional()
})
