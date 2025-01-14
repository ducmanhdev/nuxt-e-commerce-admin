import prisma from '~/lib/prisma'
import schema from '~/schemas/store.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const body = await readValidatedBody(event, schema.parse)
  const data = await prisma.store.create({
    data: {
      userId: user.id,
      ...body
    }
  })

  return {
    data
  }
})
