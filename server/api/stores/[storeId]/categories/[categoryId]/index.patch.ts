import prisma from '~/lib/prisma'
import schema from '~/schemas/category.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, categoryId } = getRouterParams(event)
  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: categoryId,
      storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data,
  }
})
