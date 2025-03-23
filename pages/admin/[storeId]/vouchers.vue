<script setup lang="ts">
import { LazyModalVoucher } from '#components'

useHead({
  title: 'Vouchers',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const overlay = useOverlay()
const modalVoucher = overlay.create(LazyModalVoucher)
const handeShowCreateModal = () => {
  modalVoucher.open({
    props: {
      storeId: storeId.value,
    },
  })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Vouchers</h2>
      <UButton leading-icon="lucide:plus" label="Create" @click="handeShowCreateModal" />
    </div>

    <TableVoucher :store-id="storeId" />
  </section>
</template>
