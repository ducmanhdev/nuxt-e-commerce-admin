import { z } from 'zod'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export default z.object({
  search: z.string().optional(),
  page: z
    .number()
    .or(z.string())
    .pipe(z.coerce.number().positive('Page must be non-negative'))
    .default(DEFAULT_PAGE.toString()),
  limit: z
    .number()
    .or(z.string())
    .pipe(z.coerce.number().positive('Limit must be non-negative'))
    .default(DEFAULT_LIMIT.toString()),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})
