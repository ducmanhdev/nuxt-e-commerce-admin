import prisma from '~/lib/prisma'
import schema from '~/schemas/category.schema'

export default defineEventHandler(async (event) => {
  const storeId = getRouterParam(event, 'storeId')
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }
  const data = await readValidatedBody(event, schema.parse)
  return prisma.category.create({
    data: {
      storeId,
      ...data,
    },
  })
})
