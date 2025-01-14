import prisma from '~/lib/prisma'
import schema from '~/schemas/product.schema'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user

  const storeId = getRouterParam(event, 'storeId')
  const store = await prisma.store.findFirstOrThrow({
    where: {
      id: storeId,
      userId: user.id
    }
  })

  const { attributes, variants, ...body } = await readValidatedBody(event, schema.parse)

  const data = await prisma.$transaction(async (tx) => {
    const createdProduct = await tx.product.create({
      data: {
        storeId: store.id,
        ...body
      }
    })

    if (attributes?.length) {
      for (const attr of attributes) {
        let attribute = await tx.productAttribute.findFirst({
          where: {
            name: attr.name,
            storeId: store.id
          }
        })

        if (!attribute) {
          attribute = await tx.productAttribute.create({
            data: {
              name: attr.name,
              storeId: store.id
            }
          })
        }

        await tx.productAttributeValue.create({
          data: {
            productId: createdProduct.id,
            attributeId: attribute.id,
            value: attr.value
          }
        })
      }
    }

    if (variants?.length) {
      for (const variant of variants) {
        const { optionValues, ...variantData } = variant

        const createdVariant = await tx.productVariant.create({
          data: {
            productId: createdProduct.id,
            ...variantData
          }
        })

        for (const optionValue of optionValues) {
          let variantOptionValue = await tx.variantOptionValue.findFirst({
            where: {
              value: optionValue.value,
              storeId: store.id
            }
          })

          if (!variantOptionValue) {
            const variantOption = await tx.variantOption.findFirstOrThrow({
              where: {
                name: optionValue.optionName,
                storeId: store.id
              }
            })

            variantOptionValue = await tx.variantOptionValue.create({
              data: {
                optionId: variantOption.id,
                storeId: store.id,
                value: optionValue.value
              }
            })
          }

          await tx.productVariantAttributeValue.create({
            data: {
              variantId: createdVariant.id,
              optionValueId: variantOptionValue.id
            }
          })
        }
      }
    }

    return createdProduct
  })

  return {
    data
  }
})
