import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, sizeId } = getRouterParams(event)
  const size = await prisma.size.findFirstOrThrow({
    where: {
      id: sizeId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.size.delete({
    where: {
      id: size.id,
    },
  })

  setResponseStatus(event, 204)
})
