<script setup lang="ts">
useHead({
  title: 'Products',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalProduct()

const { data: references } = await useAsyncData(
  'productsLookupOptions',
  async () => {
    const [categories, sizes, colors] = await Promise.all([
      $fetch(`/api/stores/${storeId.value}/categories`),
      $fetch(`/api/stores/${storeId.value}/sizes`),
      $fetch(`/api/stores/${storeId.value}/colors`),
    ])
    const [categoryReference, sizeReference, colorReference] = [categories, sizes, colors].map(
      ({ data = [] }: { data: { id: string; name: string }[] }) => {
        return data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      },
    )
    return {
      categoryReference,
      sizeReference,
      colorReference,
    }
  },
  {
    watch: [storeId],
    lazy: true,
    server: false,
    default: () => ({
      categoryOptions: [],
      sizeOptions: [],
      colorOptions: [],
    }),
  },
)
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Products</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId })" />
      </div>
    </UContainer>

    <TableProduct :store-id="storeId" :references="references" />

    <Teleport to="body">
      <ModalProduct />
    </Teleport>
  </section>
</template>
