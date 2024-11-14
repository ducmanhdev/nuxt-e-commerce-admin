<script setup lang="ts">
const route = useRoute()

const currentStoreId = ref<string | undefined>(route.params.storeId as string)
watch(
  () => route.params.storeId,
  (newStoreId) => {
    if (newStoreId) {
      currentStoreId.value = route.params.storeId as string
    }
  },
)

const { data: stores, status } = useLazyFetch('/api/stores', {
  key: 'stores',
})
const isFetchingStores = computed(() => status.value === 'pending')
const storesOptions = computed(() => {
  return (stores.value || []).map((item) => ({
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
  if (!currentStoreId.value) {
    return []
  }
  return [
    {
      label: 'Overview',
      to: {
        name: 'storeId',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    {
      label: 'Billboards',
      to: {
        name: 'storeId-billboards',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    {
      label: 'Categories',
      to: {
        name: 'storeId-categories',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    {
      label: 'Sizes',
      to: {
        name: 'storeId-sizes',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    {
      label: 'Colors',
      to: {
        name: 'storeId-colors',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    {
      label: 'Products',
      to: {
        name: 'storeId-products',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
    // {
    //   label: 'Settings',
    //   to: {
    //     name: 'storeId-settings',
    //     params: {
    //       storeId: currentStoreId.value,
    //     },
    //   },
    // },
  ]
})
</script>

<template>
  <div>
    <header class="py-4 shadow border-b border-transparent dark:border-gray-800">
      <UContainer class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <USelectMenu
            v-model="currentStoreId"
            :options="storesOptions"
            :loading="isFetchingStores"
            leading-icon="heroicons:building-storefront"
            searchable
            value-attribute="id"
            option-attribute="label"
            :ui="{ wrapper: 'w-[160px] shrink-0' }"
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
          <UHorizontalNavigation :links="links" />
        </div>
        <div class="flex items-center gap-2">
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
