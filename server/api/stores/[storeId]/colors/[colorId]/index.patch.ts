import prisma from '~/lib/prisma'
import schema from '~/schemas/color.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, colorId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!colorId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Color ID not found or invalid',
    })
  }

  const color = await prisma.color.findFirstOrThrow({
    where: {
      id: colorId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const updatedColor = await prisma.color.update({
    where: {
      id: color.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedColor,
  }
})
