<script setup lang="ts">
const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { data, status } = await useFetch('/api/stores', {
  key: 'stores',
  lazy: true,
  server: false,
})

const stores = computed(() => data.value?.data || [])
const isFetchingStores = computed(() => status.value === 'pending')
const storesOptions = computed(() => {
  return stores.value.map((item) => ({
    id: item.id,
    label: item.name,
  }))
})

const handleSelectStore = async (newStoreId: string) => {
  await navigateTo({
    name: route.name,
    params: {
      ...route.params,
      storeId: newStoreId,
    },
    replace: true,
  })
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
    return
  }
  await navigateTo('/sign-in')
}
const userDropdownItems = computed(() => {
  return [
    [
      {
        label: 'Profile',
        icon: 'heroicons:user-circle',
      },
      {
        label: 'Settings',
        icon: 'heroicons:cog-6-tooth',
      },
    ],
    [
      {
        label: 'Sign Out',
        icon: 'heroicons:arrow-right-start-on-rectangle',
        click: handleSignOut,
      },
    ],
  ]
})

const { isDark, handleToggleMode } = useThemeMode()
const { handleShow: handleModalStore } = useModalStore()

const links = computed(() => {
  return [
    {
      label: 'Overview',
      to: `/${storeId.value}`,
    },
    {
      label: 'Billboards',
      to: `/${storeId.value}/billboards`,
    },
    {
      label: 'Categories',
      to: `/${storeId.value}/categories`,
    },
    {
      label: 'Sizes',
      to: `/${storeId.value}/sizes`,
    },
    {
      label: 'Colors',
      to: `/${storeId.value}/colors`,
    },
    {
      label: 'Products',
      to: `/${storeId.value}/products`,
    },
    {
      label: 'Settings',
      to: `/${storeId.value}/settings`,
    },
  ]
})
</script>

<template>
  <div>
    <header
      class="py-4 shadow border-b border-transparent dark:border-gray-800 bg-white text-gray-900 dark:bg-gray-900 dark:text-white/95 sticky top-0 z-50"
    >
      <UContainer class="flex items-center">
        <UTooltip text="Return home">
          <UButton icon="heroicons:home-20-solid" to="/" class="mr-4" />
        </UTooltip>
        <div v-if="storeId" class="flex items-center gap-2">
          <USelectMenu
            v-model="storeId"
            :options="storesOptions"
            :loading="isFetchingStores"
            leading-icon="heroicons:building-storefront"
            searchable
            value-attribute="id"
            option-attribute="label"
            :ui="{
              wrapper: 'w-[160px] shrink-0',
            }"
            @change="handleSelectStore"
          />
          <UTooltip text="Create new store">
            <UButton
              leading-icon="heroicons:plus"
              aria-label="Create store"
              color="primary"
              variant="ghost"
              class="shrink-0"
              @click="handleModalStore"
            />
          </UTooltip>
          <UHorizontalNavigation :links="links" :ui="{ base: 'py-1.5' }" />
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <UTooltip text="Toggle dark mode">
            <UButton
              :icon="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
              variant="ghost"
              aria-label="Theme"
              @click="handleToggleMode"
            />
          </UTooltip>
          <UDropdown :items="userDropdownItems" :popper="{ placement: 'bottom-start' }">
            <UAvatar
              size="xs"
              :src="user?.user_metadata?.avatar_url"
              :alt="user?.user_metadata?.name"
              icon="heroicons:user-circle"
            />
          </UDropdown>
        </div>
      </UContainer>
    </header>
    <div>
      <slot />
    </div>

    <Teleport to="body">
      <ModalStore />
    </Teleport>
  </div>
</template>
