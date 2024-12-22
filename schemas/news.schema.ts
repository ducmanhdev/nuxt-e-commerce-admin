import { z } from 'zod'

export default z.object({
  title: z.string().min(1, 'Title is required'),
  // imageUrl: z.string().url('Image must be a valid URL'),
  imageUrl: z.string(),
  content: z.string().min(1, 'Content is required'),
  productIds: z.array(z.string().uuid('Product ID must be a valid UUID')).optional(),
})
