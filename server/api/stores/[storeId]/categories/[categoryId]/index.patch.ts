import prisma from '~/lib/prisma'
import schema from '~/schemas/category.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const { storeId, categoryId } = getRouterParams(event)

  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }

  if (!categoryId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category ID not found or invalid',
    })
  }

  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: categoryId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const data = await readValidatedBody(event, schema.parse)
  return prisma.category.update({
    where: {
      id: category.id,
    },
    data,
  })
})
