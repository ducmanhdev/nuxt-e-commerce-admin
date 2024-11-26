import { PrismaClient, Prisma } from '@prisma/client'
import { z } from 'zod'
import schema from '~/schemas/query.schema'

type Query = Partial<z.output<typeof schema>>

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    name: 'pagination',
    model: {
      $allModels: {
        async paginate<T>(this: T, queries: Query = {}, filter: Prisma.Args<T, 'findMany'>['where'] = {}) {
          const context = Prisma.getExtensionContext(this)

          const page = Math.max(1, queries.page || 1)
          const limit = Math.max(1, queries.limit || 10)
          const sort = queries.sort || 'createdAt'
          const order = queries.order === 'desc' ? 'desc' : 'asc'

          const offset = (page - 1) * limit

          const [data, total] = await Promise.all([
            (context as any).findMany({
              where: filter,
              orderBy: { [sort]: order },
              skip: offset,
              take: limit,
            }),
            (context as any).count({
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
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
