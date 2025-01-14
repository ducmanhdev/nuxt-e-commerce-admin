import prisma from '~/lib/prisma'
import schema from '~/schemas/product.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const { storeId, productId } = getRouterParams(event)

  const product = await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
      storeId: storeId,
      store: {
        userId: user.id
      }
    }
  })

  const { attributes, variants, ...body } = await readValidatedBody(event, schema.parse)

  const data = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: {
        id: product.id
      },
      data: {
        ...body
      }
    })

    if (attributes?.length) {
      for (const attr of attributes) {
        let attribute = await tx.productAttribute.findFirst({
          where: {
            name: attr.name,
            storeId: storeId
          }
        })

        if (!attribute) {
          attribute = await tx.productAttribute.create({
            data: {
              name: attr.name,
              storeId: storeId
            }
          })
        }

        const productAttributeValue = await tx.productAttributeValue.findFirst({
          where: {
            productId: product.id,
            attributeId: attribute.id
          }
        })

        if (productAttributeValue) {
          await tx.productAttributeValue.update({
            where: {
              id: productAttributeValue.id
            },
            data: {
              value: attr.value
            }
          })
        } else {
          await tx.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attribute.id,
              value: attr.value
            }
          })
        }
      }

      const existingAttributes = await tx.productAttributeValue.findMany({
        where: {
          productId: product.id
        },
        include: {
          attribute: true
        }
      })

      await tx.productAttributeValue.deleteMany({
        where: {
          id: {
            in: existingAttributes
              .filter((existingAttr) => !attributes.find((attr) => attr.name === existingAttr.attribute.name))
              .map((existingAttr) => existingAttr.id)
          }
        }
      })
    }

    return updatedProduct
  })

  return {
    data
  }
})
