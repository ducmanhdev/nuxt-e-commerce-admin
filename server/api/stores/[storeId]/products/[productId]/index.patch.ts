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

  const data = await readValidatedBody(event, schema.parse)
  return prisma.product.update({
    where: {
      id: product.id,
    },
    data,
  })
})
