<script setup lang="ts">
useHead({
  title: 'Products',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalProduct()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Products</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId })" />
      </div>

      <TableProduct :store-id="storeId" />
    </UContainer>

    <Teleport to="body">
      <ModalProduct />
    </Teleport>
  </section>
</template>
