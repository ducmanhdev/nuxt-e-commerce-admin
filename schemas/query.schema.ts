import { z } from 'zod'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export default z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive('Page must be non-negative').default(DEFAULT_PAGE),
  limit: z.coerce.number().positive('Limit must be non-negative').default(DEFAULT_LIMIT),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})
