<script setup lang="ts">
import { LazyModalStore } from '#components'

useHead({
  title: 'Home',
})

const storesStore = useStoresStore()

const groups = computed(() => [
  {
    id: 'stores',
    label: '',
    items: (storesStore.stores || []).map((store) => ({
      icon: 'heroicons:arrows-pointing-out-solid',
      label: store.name,
      id: store.id,
      onSelect: async () => {
        await navigateTo(store.id)
      },
    })),
  },
])

const modal = useModal()
</script>

<template>
  <div class="py-4">
    <UContainer>
      <UCard class="w-[900px] max-w-full mx-auto">
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <p>Select store</p>
            <UTooltip text="Create new store">
              <UButton leading-icon="heroicons:plus" @click="modal.open(LazyModalStore)" />
            </UTooltip>
          </div>
        </template>
        <UCommandPalette nullable :loading="storesStore.isFetchingStores" :autoselect="false" :groups="groups">
          <template #empty>
            <div class="text-center space-y-4 p-6">
              <UIcon name="heroicons:magnifying-glass-20-solid" class="size-10" />
              <p>We couldn't find any items.</p>
            </div>
          </template>
        </UCommandPalette>
      </UCard>
    </UContainer>
  </div>
</template>
