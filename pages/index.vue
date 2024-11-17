<script setup lang="ts">
useHead({
  title: 'Home',
})

const { data, status } = await useFetch('/api/stores', {
  key: 'stores',
  lazy: true,
  server: false,
  getCachedData: (key, nuxt) => {
    return nuxt.payload.data[key]
  },
})

type Option = {
  id: string
  label: string
}
const stores = computed<Option[]>(() => {
  return (data.value?.data || []).map((store) => ({
    label: store.name,
    id: store.id,
  }))
})
const isFetchingStores = computed(() => status.value === 'pending')
const handleSelect = async (option: Option) => {
  await navigateTo(option.id)
}
const { handleShow: handleModalStore } = useModalStore()
</script>

<template>
  <div class="py-4 h-full">
    <UContainer>
      <UCard
        class="w-[900px] max-w-full mx-auto"
        :ui="{
          body: {
            padding: '!p-0',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <p>Select store</p>
            <UTooltip text="Create new store">
              <UButton leading-icon="heroicons:plus" @click="handleModalStore" />
            </UTooltip>
          </div>
        </template>
        <UCommandPalette
          nullable
          :loading="isFetchingStores"
          :autoselect="false"
          :groups="[{ key: 'stores', commands: stores }]"
          :fuse="{
            fuseOptions: { keys: ['label'] },
          }"
          @update:model-value="handleSelect"
        >
          <template #empty-state>
            <div class="text-center space-y-4 p-6">
              <UIcon name="heroicons:magnifying-glass-20-solid" size="28" />
              <p>We couldn't find any items.</p>
              <UButton label="Create store" leading-icon="heroicons:plus" @click="handleModalStore" />
            </div>
          </template>
        </UCommandPalette>
      </UCard>
    </UContainer>
  </div>
</template>
