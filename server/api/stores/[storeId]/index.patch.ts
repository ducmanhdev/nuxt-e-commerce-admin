import prisma from '~/lib/prisma'
import storeSchema from '~/schemas/store.schema'

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

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId: user.id,
    },
  })
  if (!store) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store not found',
    })
  }

  const { name } = await readValidatedBody(event, storeSchema.parse)
  return prisma.store.update({
    where: {
      id: storeId,
    },
    data: {
      name,
    },
  })
})
