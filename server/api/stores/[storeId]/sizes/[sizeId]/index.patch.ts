import prisma from '~/lib/prisma'
import schema from '~/schemas/size.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, sizeId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!sizeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Size ID not found or invalid',
    })
  }

  const size = await prisma.size.findFirstOrThrow({
    where: {
      id: sizeId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const data = await readValidatedBody(event, schema.parse)
  return prisma.size.update({
    where: {
      id: size.id,
    },
    data,
  })
})