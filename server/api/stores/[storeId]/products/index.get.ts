import prisma from '~/lib/prisma'
import schema from '~/schemas/query.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user
  const storeId = getRouterParam(event, 'storeId')

  const queries = await getValidatedQuery(event, schema.parse)
  return await prisma.product.paginate(
    queries,
    {
      storeId: storeId,
      store: {
        userId: user.id,
      },
      name: {
        contains: queries.search || '',
        mode: 'insensitive',
      },
    },
    {
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    },
  )
})
