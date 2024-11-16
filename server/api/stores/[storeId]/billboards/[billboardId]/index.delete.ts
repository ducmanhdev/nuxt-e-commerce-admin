import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, billboardId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!billboardId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Billboard ID not found or invalid',
    })
  }

  const billboard = await prisma.billboard.findFirstOrThrow({
    where: {
      id: billboardId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const categoriesCount = await prisma.category.count({
    where: {
      billboardId: billboard.id,
    },
  })

  if (categoriesCount > 0) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'This billboard has associated categories. Please delete all related categories before deleting the billboard.',
    })
  }

  await prisma.billboard.delete({
    where: {
      id: billboard.id,
    },
  })

  setResponseStatus(event, 204)
})
