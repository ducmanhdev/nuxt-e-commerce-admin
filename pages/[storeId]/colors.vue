<script setup lang="ts">
useHead({
  title: 'Colors',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalColor()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Colors</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId })" />
      </div>
    </UContainer>

    <TableColor :store-id="storeId" />

    <Teleport to="body">
      <ModalColor />
    </Teleport>
  </section>
</template>
