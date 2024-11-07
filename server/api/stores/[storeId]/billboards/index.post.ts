import prisma from '~/lib/prisma'
import billboardSchema from '~/schemas/billboard.schema'

export default defineEventHandler(async (event) => {
  const storeId = getRouterParam(event, 'storeId')
  if (!storeId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store ID not found or invalid',
    })
  }
  const data = await readValidatedBody(event, billboardSchema.parse)
  return prisma.billboard.create({
    data: {
      storeId,
      ...data,
    },
  })
})
