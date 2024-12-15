import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, brandId } = getRouterParams(event)
  const brand = await prisma.brand.findFirstOrThrow({
    where: {
      id: brandId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  await prisma.brand.delete({
    where: {
      id: brand.id,
    },
  })

  setResponseStatus(event, 204)
})
