import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, colorId } = getRouterParams(event)
  const color = await prisma.color.findFirstOrThrow({
    where: {
      id: colorId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.color.delete({
    where: {
      id: color.id,
    },
  })

  setResponseStatus(event, 204)
})
