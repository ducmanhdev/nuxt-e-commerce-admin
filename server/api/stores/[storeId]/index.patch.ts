import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id
    }
  })

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.store.update({
    where: {
      id: store.id
    },
    data: {
      ...body
    }
  })

  return {
    data
  }
})
