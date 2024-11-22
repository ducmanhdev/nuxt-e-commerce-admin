import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, billboardId } = getRouterParams(event)
  const billboard = await prisma.billboard.findFirstOrThrow({
    where: {
      id: billboardId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.billboard.delete({
    where: {
      id: billboard.id,
    },
  })

  setResponseStatus(event, 204)
})
