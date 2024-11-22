import prisma from '~/lib/prisma'
import schema from '~/schemas/billboard.schema'

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
  const createdBillboard = await prisma.billboard.create({
    data: {
      storeId: store.id,
      ...body,
    },
  })

  return {
    data: createdBillboard,
  }
})
