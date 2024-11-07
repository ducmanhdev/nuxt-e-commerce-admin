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
    searchField: 'label',
    defaultLimit: 10,
    defaultPage: 1,
  })

  const finalWhere = { ...where, storeId }

  const [billboards, total] = await prisma.$transaction([
    prisma.billboard.findMany({
      where: finalWhere,
      ...pagination,
      ...(ordering ? { orderBy: ordering } : {}),
    }),
    prisma.billboard.count({ where: finalWhere }),
  ])

  return {
    billboards,
    meta: {
      total,
      currentPage: Number(page),
      itemsPerPage: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  }
})
