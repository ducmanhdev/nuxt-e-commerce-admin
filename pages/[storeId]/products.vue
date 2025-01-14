<script setup lang="ts">
import { LazyModalProduct } from '#components'

useHead({
  title: 'Products'
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalProduct, {
    storeId: storeId.value
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
