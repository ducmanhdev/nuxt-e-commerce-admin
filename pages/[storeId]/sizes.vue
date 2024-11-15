<script setup lang="ts">
useHead({
  title: 'Sizes',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalSize()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Sizes</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId })" />
      </div>

      <TableSize :store-id="storeId" />
    </UContainer>

    <Teleport to="body">
      <ModalSize />
    </Teleport>
  </section>
</template>
