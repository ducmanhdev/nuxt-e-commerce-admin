<script setup lang="ts">
import { LazyModalColor } from '#components'

useHead({
  title: 'Colors',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalColor, {
    storeId: storeId.value,
  })
}
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Colors</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handeShowCreateModal" />
      </div>

      <TableColor :store-id="storeId" />
    </UContainer>
  </section>
</template>
