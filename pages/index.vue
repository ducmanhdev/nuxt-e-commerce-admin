<script setup lang="ts">
useHead({
  title: 'Home',
})

const { data: stores } = await useFetch('/api/stores', {
  key: 'stores',
})

if (stores.value?.length) {
  await navigateTo(`/${stores.value[0].id}`)
}

const { handleShow: handleModalStore } = useModalStore()
</script>

<template>
  <div class="py-4 h-full">
    <UContainer>
      <UCard>
        <div class="text-center space-y-4">
          <UIcon name="heroicons:information-circle" size="50px" />
          <p class="text-2xl font-bold">No stores found</p>
          <UButton label="Create store" leading-icon="heroicons:pencil-square" @click="handleModalStore" />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
