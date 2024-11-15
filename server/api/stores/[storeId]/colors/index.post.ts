import prisma from '~/lib/prisma'
import schema from '~/schemas/color.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const createdColor = prisma.color.create({
    data: {
      storeId: store.id,
      ...body,
    },
  })

  return {
    data: createdColor,
  }
})
