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
    defaultLimit: 10,
    defaultPage: 1,
  })

  const finalWhere = { ...where, storeId }

  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where: finalWhere,
      ...pagination,
      ...(ordering ? { orderBy: ordering } : {}),
    }),
    prisma.category.count({ where: finalWhere }),
  ])

  return {
    categories,
    meta: {
      total,
      currentPage: Number(page),
      itemsPerPage: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  }
})
