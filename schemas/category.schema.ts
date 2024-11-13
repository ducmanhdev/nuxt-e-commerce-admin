import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter category name'),
  billboardId: z.string().uuid().min(1, 'Please select billboard'),
})
