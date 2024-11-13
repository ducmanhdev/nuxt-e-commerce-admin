import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter billboard name'),
  imageUrl: z.string().url().min(1, 'Please add billboard image'),
})
