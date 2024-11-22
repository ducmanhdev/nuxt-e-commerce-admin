<script setup lang="ts">
import { LazyModalSize } from '#components'

useHead({
  title: 'Sizes',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalSize, {
    storeId: storeId.value,
  })
}
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Sizes</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handeShowCreateModal" />
      </div>

      <TableSize :store-id="storeId" />
    </UContainer>
  </section>
</template>
