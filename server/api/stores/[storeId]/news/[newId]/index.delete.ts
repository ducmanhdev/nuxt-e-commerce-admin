import prisma from '~/lib/prisma'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, categoryId } = getRouterParams(event)
  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: categoryId,
      storeId: storeId,
      store: {
        userId: user.id
      }
    }
  })

  await prisma.category.delete({
    where: {
      id: category.id
    }
  })

  setResponseStatus(event, 204)
})
