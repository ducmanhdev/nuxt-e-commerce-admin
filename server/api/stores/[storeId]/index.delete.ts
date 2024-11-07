import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const storeId = getRouterParam(event, 'storeId')

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const storeAndBillboardCheck = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId: user.id,
    },
    include: {
      billboards: true,
    },
  })

  if (!storeAndBillboardCheck) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store does not exist',
    })
  }

  if (storeAndBillboardCheck.billboards.length > 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Cannot delete this store. Please delete all associated billboards first.',
    })
  }

  await prisma.store.delete({
    where: {
      id: storeId,
    },
  })

  setResponseStatus(event, 204)
})
