import prisma from '~/lib/prisma'
import schema from '~/schemas/product.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id,
    },
  })

  const { attributes, ...body } = await readValidatedBody(event, schema.parse)

  const data = await prisma.$transaction(async (tx) => {
    const createdProduct = await tx.product.create({
      data: {
        storeId: store.id,
        ...body,
      },
    })

    if (attributes?.length) {
      for (const attr of attributes) {
        let attribute = await tx.attribute.findFirst({
          where: {
            name: attr.name,
            storeId: store.id,
          },
        })

        if (!attribute) {
          attribute = await tx.attribute.create({
            data: {
              name: attr.name,
              storeId: store.id,
            },
          })
        }

        await tx.productAttributeValue.create({
          data: {
            productId: createdProduct.id,
            attributeId: attribute.id,
            value: attr.value,
          },
        })
      }
    }

    return createdProduct
  })

  return {
    data,
  }
})
