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

      <TableColor :store-id="storeId" />
    </UContainer>

    <Teleport to="body">
      <ModalColor />
    </Teleport>
  </section>
</template>
