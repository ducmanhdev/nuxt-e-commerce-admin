import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, productId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!productId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Size ID not found or invalid',
    })
  }

  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.product.delete({
    where: {
      id: product.id,
    },
  })

  setResponseStatus(event, 204)
})
