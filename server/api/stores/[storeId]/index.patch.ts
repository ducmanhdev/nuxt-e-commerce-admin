import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

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

  const body = await readValidatedBody(event, schema.parse)
  const updatedStore = await prisma.store.update({
    where: {
      id: store.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedStore,
  }
})
