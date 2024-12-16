import prisma from '~/lib/prisma'
import schema from '~/schemas/news.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  const { productIds, ...restBody } = await readValidatedBody(event, schema.parse)
  const news = await prisma.news.create({
    data: {
      storeId: store.id,
      ...restBody,
    },
  })

  if (productIds && productIds.length > 0) {
    await prisma.newsDetail.createMany({
      data: productIds.map((productId) => ({
        newsId: news.id,
        productId,
      })),
    })
  }

  return {
    data: news,
  }
})
