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

  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  return {
    data: store,
  }
})
