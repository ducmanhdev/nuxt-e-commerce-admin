import prisma from '~/lib/prisma'
import schema from '~/schemas/billboard.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, billboardId } = getRouterParams(event)
  const billboard = await prisma.billboard.findFirstOrThrow({
    where: {
      id: billboardId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const updatedBillboard = await prisma.billboard.update({
    where: {
      id: billboard.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedBillboard,
  }
})
