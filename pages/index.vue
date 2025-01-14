<script setup lang="ts">
import { LazyModalStore } from '#components'
import type { Store } from '~/types'

useHead({
  title: 'Home'
})

const { data: cachedStores } = useNuxtData<Store[]>('stores')
const groups = computed(() => [
  {
    id: 'stores',
    label: '',
    items: (cachedStores.value || []).map((store, index) => ({
      label: `${index + 1}. ${store.name}`,
      id: store.id,
      onSelect: async () => {
        await navigateTo(store.id)
      }
    }))
  }
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
              <UButton leading-icon="lucide:plus" @click="modal.open(LazyModalStore)" />
            </UTooltip>
          </div>
        </template>
        <UCommandPalette nullable :autoselect="false" :groups="groups">
          <template #empty>
            <div class="text-center space-y-4 p-6">
              <UIcon name="lucide:search" class="size-10" />
              <p>We couldn't find any items.</p>
            </div>
          </template>
        </UCommandPalette>
      </UCard>
    </UContainer>
  </div>
</template>
