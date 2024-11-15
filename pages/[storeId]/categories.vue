<script setup lang="ts">
useHead({
  title: 'Categories',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalCategory()

const { handleFetchData } = useReferenceBillboard()
watchEffect(() => {
  if (storeId.value) {
    handleFetchData(storeId.value)
  }
})
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Categories</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId })" />
      </div>

      <TableCategory :store-id="storeId" />
    </UContainer>

    <Teleport to="body">
      <ModalCategory />
    </Teleport>
  </section>
</template>
