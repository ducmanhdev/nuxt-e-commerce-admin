import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const { storeId, billboardId } = getRouterParams(event)
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const billboard = await prisma.billboard.findFirst({
    where: {
      id: billboardId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  if (!billboard) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Billboard not found or unauthorized access',
    })
  }

  return prisma.billboard.delete({
    where: {
      id: billboardId,
    },
  })
})
