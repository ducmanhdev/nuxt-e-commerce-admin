import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  return {
    data: billboards,
  }
})
