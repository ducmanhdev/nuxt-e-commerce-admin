import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter size name'),
  value: z.string().min(1, 'Please enter size value'),
})
