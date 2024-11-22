import prisma from '~/lib/prisma'
import schema from '~/schemas/color.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, colorId } = getRouterParams(event)
  const color = await prisma.color.findFirstOrThrow({
    where: {
      id: colorId,
      storeId: storeId,
      store: {
        userId: user.id,
      },
    },
  })

  const body = await readValidatedBody(event, schema.parse)
  const updatedColor = await prisma.color.update({
    where: {
      id: color.id,
    },
    data: {
      ...body,
    },
  })

  return {
    data: updatedColor,
  }
})
