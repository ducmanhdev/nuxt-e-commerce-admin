import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const body = await readValidatedBody(event, schema.parse)
  const createdStore = await prisma.store.create({
    data: {
      userId: user.id,
      ...body,
    },
  })

  return {
    data: createdStore,
  }
})
