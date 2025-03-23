<script setup lang="ts">
import { LazyModalCategory } from '#components'

useHead({
  title: 'Categories'
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const overlay = useOverlay()
const modalCategory = overlay.create(LazyModalCategory)
const handeShowCreateModal = () => {
  modalCategory.open({
    props: {
      storeId: storeId.value
    }
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Categories</h2>
      <UButton leading-icon="lucide:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableCategory :store-id="storeId" />
  </section>
</template>
