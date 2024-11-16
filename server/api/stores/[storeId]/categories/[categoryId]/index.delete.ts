import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, categoryId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!categoryId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category ID not found or invalid',
    })
  }

  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: categoryId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const productsCount = await prisma.product.count({
    where: {
      categoryId: category.id,
    },
  })

  if (productsCount > 0) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'This category has associated products. Please delete all related products before deleting the category.',
    })
  }

  await prisma.category.delete({
    where: {
      id: category.id,
    },
  })

  setResponseStatus(event, 204)
})
