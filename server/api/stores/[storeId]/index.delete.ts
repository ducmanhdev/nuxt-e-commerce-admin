import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  await prisma.store.delete({
    where: {
      id: store.id,
      userId: user.id,
    },
  })

  setResponseStatus(event, 204)
})
