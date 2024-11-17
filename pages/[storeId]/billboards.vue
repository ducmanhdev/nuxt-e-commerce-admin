<script setup lang="ts">
useHead({
  title: 'Billboards',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { handleShow } = useModalBillboard()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Billboards</h2>
        <UButton leading-icon="heroicons:plus" label="Create" @click="handleShow({ storeId: storeId })" />
      </div>

      <TableBillboard :store-id="storeId" />
    </UContainer>

    <Teleport to="body">
      <ModalBillboard />
    </Teleport>
  </section>
</template>
