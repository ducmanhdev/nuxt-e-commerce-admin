<script setup lang="ts">
import { LazyModalProduct } from '#components'

useHead({
  title: 'Products',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const overlay = useOverlay()
const modalProduct = overlay.create(LazyModalProduct)
const handeShowCreateModal = () => {
  modalProduct.open({
    props: {
      storeId: storeId.value,
    },
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Products</h2>
      <UButton leading-icon="lucide:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableProduct :store-id="storeId" />
  </section>
</template>
