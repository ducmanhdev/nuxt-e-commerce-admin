import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, productId } = getRouterParams(event)
  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
      storeId: storeId,
      store: {
        userId: user.id
      }
    }
  })

  await prisma.product.delete({
    where: {
      id: product.id
    }
  })

  setResponseStatus(event, 204)
})
