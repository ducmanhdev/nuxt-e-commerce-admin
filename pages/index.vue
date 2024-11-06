<script setup lang="ts">
useHead({
  title: 'Home',
})

const { data: stores } = await useFetch('/api/stores', {
  key: 'stores',
})

const { handleShow: handleModalStore } = useModalStore()

watchEffect(() => {
  if (stores.value?.length) {
    return navigateTo(`/${stores.value[0].id}`)
  }
})
</script>

<template>
  <div class="py-4 h-full">
    <UContainer>
      <UCard>
        <div class="text-center space-y-4">
          <UIcon name="ion:file-tray-outline" size="50px" />
          <p class="text-2xl font-bold">
            No stores found
          </p>
          <UButton label="Create store" leading-icon="ion:add-outline" @click="handleModalStore" />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
