import prisma from '~/lib/prisma'
import { handleQuery } from '~/server/utils/queryHandler'

export default defineEventHandler(async (event) => {
  const storeId = getRouterParam(event, 'storeId')
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const {
    where,
    pagination,
    ordering,
    page,
    limit,
  } = await handleQuery(event, {
    searchField: 'name',
  })

  const finalWhere = { ...where, storeId }

  const [data, total] = await prisma.$transaction([
    prisma.color.findMany({
      where: finalWhere,
      ...pagination,
      ...(ordering ? { orderBy: ordering } : {}),
    }),
    prisma.color.count({ where: finalWhere }),
  ])

  return {
    data,
    meta: {
      total,
      currentPage: Number(page),
      itemsPerPage: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  }
})
