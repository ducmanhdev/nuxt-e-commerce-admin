import prisma from '~/lib/prisma'
import schema from '~/schemas/billboard.schema'

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

  const data = await readValidatedBody(event, schema.parse)
  return prisma.billboard.create({
    data: {
      storeId: store.id,
      ...data,
    },
  })
})
