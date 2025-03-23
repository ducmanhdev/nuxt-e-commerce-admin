<script setup lang="ts">
import { LazyModalNews } from '#components'

useHead({
  title: 'News'
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const overlay = useOverlay()
const modalNews = overlay.create(LazyModalNews)
const handeShowCreateModal = () => {
  modalNews.open({
    props: {
      storeId: storeId.value
    }
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">News</h2>
      <UButton leading-icon="lucide:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableNews :store-id="storeId" />
  </section>
</template>
