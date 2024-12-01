import prisma from '~/lib/prisma'
import schema from '~/schemas/voucher.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, voucherId } = getRouterParams(event)
  const category = await prisma.category.findFirstOrThrow({
    where: {
      id: voucherId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.voucher.update({
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
