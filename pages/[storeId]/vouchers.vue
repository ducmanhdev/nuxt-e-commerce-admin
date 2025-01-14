<script setup lang="ts">
import { LazyModalVoucher } from '#components'

useHead({
  title: 'Vouchers'
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const modal = useModal()
const handeShowCreateModal = () => {
  modal.open(LazyModalVoucher, {
    storeId: storeId.value
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
