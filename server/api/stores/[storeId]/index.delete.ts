import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const storeWithBillboards = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
    include: {
      billboards: true,
    },
  })

  if (storeWithBillboards.billboards.length > 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Cannot delete this store. Please delete all associated billboards first.',
    })
  }

  await prisma.store.delete({
    where: {
      id: storeWithBillboards.id,
    },
  })

  setResponseStatus(event, 204)
})
