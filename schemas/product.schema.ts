import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter product name'),
  price: z.coerce.number().refine((val) => val >= 0, { message: 'Price must be non-negative' }),
  categoryId: z.string().uuid().min(1, 'Please select a category'),
  isArchived: z.boolean().optional().default(false),
  // images: z.array(z.string().url().min(1, 'Please add at least one image URL')),
})
