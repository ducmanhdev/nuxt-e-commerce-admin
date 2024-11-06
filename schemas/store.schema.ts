import { z } from 'zod'

export default z.object({
  name: z.string({ required_error: 'Please enter your store name' }).min(1),
})
