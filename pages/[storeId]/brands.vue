<script setup lang="ts">
import { LazyModalBrand } from '#components'

useHead({
  title: 'Brands',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalBrand, {
    storeId: storeId.value,
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Brands</h2>
      <UButton leading-icon="heroicons:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableCategory :store-id="storeId" />
  </section>
</template>
