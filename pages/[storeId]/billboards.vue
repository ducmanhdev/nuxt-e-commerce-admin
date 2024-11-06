<script setup lang="ts">
import type { Billboard } from '~/types'

useHead({
  title: 'Billboards',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const {
  data: billboards,
  status,
} = await useLazyFetch(() => `/api/stores/${storeId.value}/billboards`, {
  key: 'billboards',
})

const isFetchBillboardsLoading = computed(() => status.value === 'pending')

interface Column {
  key: keyof Billboard | 'actions'
  label?: string
}

const columns: Column[] = [
  { key: 'label', label: 'Label' },
  { key: 'imageUrl', label: 'Image' },
  { key: 'createdAt', label: 'Created at' },
  { key: 'updatedAt', label: 'Updated at' },
  { key: 'actions' },
]

const selected = ref<Billboard[]>([])

const { handleShow } = useModalBillboard()

const isDeleteBillboardLoading = ref(false)

const handleDeleteBillboard = async (billboardId: string) => {
  try {
    isDeleteBillboardLoading.value = true
    await $fetch(`/api/stores/${storeId.value}/billboards/${billboardId}`, {
      method: 'DELETE',
    })
    await refreshNuxtData('billboards')
    push.success('Delete successfully')
  }
  catch (error: any) {
    console.log(error)
  }
  finally {
    isDeleteBillboardLoading.value = false
  }
}
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">
          Billboards
        </h2>
        <UButton
          leading-icon="ion:add-outline"
          label="Create"
          @click="handleShow({ storeId })"
        />
      </div>
      <UTable v-model="selected" :rows="billboards || []" :columns="columns" :loading="isFetchBillboardsLoading">
        <template #name-data="{ row }">
          <span :class="[selected.find(person => person.id === row.id) && 'text-primary-500 dark:text-primary-400']">
            {{ row.label }}
          </span>
        </template>
        <template #imageUrl-data="{ row }">
          <CldImage
            v-if="row.imageUrl"
            :src="row.imageUrl"
            :alt="row.imageUrl"
            width="100"
            height="100"
          />
        </template>
        <template #actions-data="{ row }">
          <div class="text-right space-x-2">
            <UButton
              color="red"
              label="Delete"
              leading-icon="ion:trash-outline"
              :loading="isDeleteBillboardLoading"
              @click="handleDeleteBillboard(row.id)"
            />
            <UButton
              label="Edit"
              leading-icon="ion:pencil-outline"
              @click="handleShow({
                storeId,
                ...row,
              })"
            />
          </div>
        </template>
      </UTable>
    </UContainer>

    <Teleport to="body">
      <ClientOnly>
        <LazyModalBillboard />
      </ClientOnly>
    </Teleport>
  </section>
</template>
