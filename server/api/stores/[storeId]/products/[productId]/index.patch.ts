import prisma from '~/lib/prisma'
import schema from '~/schemas/product.schema'

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
      statusMessage: 'Product ID not found or invalid',
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

  const body = await readValidatedBody(event, schema.parse)
  const updatedStore = await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedStore,
  }
})
