import { z } from 'zod'

const attributeValidator = z.object({
  name: z.string().min(1, 'Please enter product attribute name'),
  value: z.string().min(1, 'Please enter product attribute value'),
})

export default z.object({
  name: z.string().min(1, 'Please enter product name'),
  price: z.number().or(z.string()).pipe(z.coerce.number().positive('Price must be non-negative')),
  oldPrice: z.number().or(z.string()).pipe(z.coerce.number().positive('Old price must be non-negative')),
  description: z.string().min(1, 'Please enter product description'),
  quantity: z.number().or(z.string()).pipe(z.coerce.number().positive('Quantity must be non-negative')),
  brandId: z.string().min(1, 'Please select product brand'),
  categoryId: z.string().min(1, 'Please select product category'),
  attributes: z.array(attributeValidator).optional(),
  // status: z.number().or(z.string()).pipe(z.coerce.number().positive('Status is not valid')),
  // images: z.array(z.string().url().min(1, 'Please add at least one image URL')),
})
