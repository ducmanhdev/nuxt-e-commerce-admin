import type { H3Event } from 'h3'
import { z } from 'zod'

interface QueryOptions {
  defaultLimit?: number
  defaultPage?: number
  searchField?: string
}

const querySchema = z.object({
  search: z.string().optional(),
  page: z
    .string()
    .transform(v => Number.parseFloat(v))
    .refine(v => !Number.isNaN(v), { message: 'Not a valid number' })
    .pipe(z.number().min(0))
    .default('1'),
  limit: z
    .string()
    .transform(v => Number.parseFloat(v))
    .refine(v => !Number.isNaN(v), { message: 'Not a valid number' })
    .pipe(z.number().min(0))
    .default('10'),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export const handleQuery = async (event: H3Event, options: QueryOptions = {}) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  const {
    search,
    page = options.defaultPage || 1,
    limit = options.defaultLimit || 10,
    sort,
    order,
  } = query

  const where = {} as any
  if (search && options.searchField) {
    where[options.searchField] = { contains: search as string, mode: 'insensitive' }
  }

  const pagination = {
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
  }

  const ordering = sort ? { [sort as string]: order || 'asc' } : undefined

  return { where, pagination, ordering, search, page, limit }
}
