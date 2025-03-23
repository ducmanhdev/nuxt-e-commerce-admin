import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, voucherId } = getRouterParams(event)
  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: voucherId,
      storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.voucher.delete({
    where: {
      id: category.id,
    },
  })

  setResponseStatus(event, 204)
})
