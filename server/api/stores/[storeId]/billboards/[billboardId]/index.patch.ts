import prisma from '~/lib/prisma'
import schema from '~/schemas/billboard.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, billboardId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!billboardId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Billboard ID not found or invalid',
    })
  }

  const billboard = await prisma.billboard.findFirstOrThrow({
    where: {
      id: billboardId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const updatedBillboard = await prisma.billboard.update({
    where: {
      id: billboard.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedBillboard,
  }
})
