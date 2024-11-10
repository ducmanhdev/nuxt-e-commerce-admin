import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const { name } = await readValidatedBody(event, schema.parse)
  return prisma.store.create({
    data: {
      name,
      userId: user.id,
    },
  })
})
