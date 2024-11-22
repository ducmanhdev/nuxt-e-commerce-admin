import prisma from '~/lib/prisma'
import schema from '~/schemas/size.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, sizeId } = getRouterParams(event)
  const size = await prisma.size.findFirstOrThrow({
    where: {
      id: sizeId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const updatedSize = await prisma.size.update({
    where: {
      id: size.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedSize,
  }
})
