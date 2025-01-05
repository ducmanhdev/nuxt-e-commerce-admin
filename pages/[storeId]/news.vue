<script setup lang="ts">
import { LazyModalNews } from '#components'

useHead({
  title: 'News',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalNews, {
    storeId: storeId.value,
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">News</h2>
      <UButton leading-icon="heroicons:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableNews :store-id="storeId" />
  </section>
</template>
