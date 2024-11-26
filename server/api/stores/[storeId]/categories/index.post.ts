import prisma from '~/lib/prisma'
import schema from '~/schemas/category.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.category.create({
    data: {
      storeId: store.id,
      ...body,
    },
  })

  return {
    data,
  }
})
