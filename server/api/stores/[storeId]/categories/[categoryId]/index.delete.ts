import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const { storeId, categoryId } = getRouterParams(event)
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found or unauthorized access',
    })
  }

  return prisma.category.delete({
    where: {
      id: category.id,
    },
  })
})
