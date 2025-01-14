import prisma from '~/lib/prisma'
import schema from '~/schemas/brand.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, brandId } = getRouterParams(event)
  const brand = await prisma.brand.findFirstOrThrow({
    where: {
      id: brandId,
      storeId: storeId,
      store: {
        userId: user.id
      }
    }
  })

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.brand.update({
    where: {
      id: brand.id
    },
    data: {
      ...body
    }
  })

  return {
    data
  }
})
