import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter your store name')
})
