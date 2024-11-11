import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const data = await readValidatedBody(event, schema.parse)
  return prisma.store.create({
    data: {
      userId: user.id,
      ...data,
    },
  })
})
