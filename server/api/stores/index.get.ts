import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return prisma.store.findMany({
    where: {
      userId: user.id,
    },
  })
})
