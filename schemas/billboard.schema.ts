import { z } from 'zod'

export default z.object({
  name: z.string({ required_error: 'Please enter billboard name' }).min(1),
  imageUrl: z.string({ required_error: 'Please enter billboard image' }).min(1),
})
