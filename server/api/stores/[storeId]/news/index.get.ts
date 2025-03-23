import prisma from '~/lib/prisma'
import schema from '~/schemas/query.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user
  const storeId = getRouterParam(event, 'storeId')

  const queries = await getValidatedQuery(event, schema.parse)
  return await prisma.news.paginate(queries, {
    storeId,
    store: {
      userId: user.id,
    },
    title: {
      contains: queries.search || '',
      mode: 'insensitive',
    },
  })
})
