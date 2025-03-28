import type { z } from 'zod'
import type schema from '~/schemas/query.schema'
import { Prisma } from '@prisma/client'

type Query = Partial<z.output<typeof schema>>
interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  total: number
}
interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}

export const pagination = Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        queries: Query = {},
        filter: Prisma.Args<T, 'findMany'>['where'] = {},
        options: Prisma.Args<T, 'findMany'> = {} as Prisma.Args<T, 'findMany'>,
      ): Promise<PaginatedResult<T>> {
        const context = Prisma.getExtensionContext(this)

        const page = Math.max(1, queries.page || 1)
        const limit = Math.max(1, queries.limit || 10)
        const sort = queries.sort || 'createdAt'
        const order = queries.order === 'desc' ? 'desc' : 'asc'

        const offset = (page - 1) * limit

        const [data, total] = await Promise.all([
          context.findMany({
            ...options,
            where: filter,
            orderBy: { [sort]: order },
            skip: offset,
            take: limit,
          }),
          context.count({
            where: filter,
          }),
        ])

        const totalPages = Math.ceil(total / limit)

        return {
          data,
          meta: {
            total,
            currentPage: page,
            itemsPerPage: limit,
            totalPages,
          },
        }
      },
    },
  },
})
