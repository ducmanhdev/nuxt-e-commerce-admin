import prisma from '~/lib/prisma'
import storeSchema from '~/schemas/store.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const { name } = await readValidatedBody(event, storeSchema.parse)
  return prisma.store.create({
    data: {
      name,
      userId: user.id,
    },
  })
})
