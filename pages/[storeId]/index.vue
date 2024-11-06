<script setup lang="ts">
useHead({
  title: 'Overview',
})

const route = useRoute()
const { data: store } = await useFetch(() => `/api/stores/${route.params.storeId}`, {
  key: 'store',
})

if (!store.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Store not found',
    fatal: true,
  })
}

const { isDeleteStoreLoading, handleDeleteStore } = useStore()
const { handleShow } = useModalStore()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold" @click="route.params.storeId = '1' ">
          Overview
        </h2>
        <div class="flex gap-2">
          <UButton
            leading-icon="ion:pencil-outline"
            label="Edit"
            @click="handleShow({
              id: store!.id,
              name: store!.name,
            })"
          />
          <UButton
            leading-icon="ion:trash-outline"
            label="Delete"
            color="red"
            :loading="isDeleteStoreLoading"
            @click="handleDeleteStore(store!.id)"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>
