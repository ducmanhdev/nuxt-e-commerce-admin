import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user
  const storeId = getRouterParam(event, 'storeId')

  const { where, pagination, ordering, page, limit } = await handleQuery(event, {
    searchField: 'name',
  })

  const finalWhere = { ...where, storeId, store: { userId: user.id } }

  const [data, total] = await prisma.$transaction([
    prisma.size.findMany({
      where: finalWhere,
      ...pagination,
      ...(ordering ? { orderBy: ordering } : {}),
    }),
    prisma.size.count({ where: finalWhere }),
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
