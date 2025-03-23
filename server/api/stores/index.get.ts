import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    data: stores,
  }
})
