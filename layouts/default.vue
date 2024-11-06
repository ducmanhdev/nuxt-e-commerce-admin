<script setup lang="ts">
const route = useRoute()

const currentStoreId = ref<string | undefined>(route.params.storeId as string)
watch(() => route.params.storeId, (newStoreId) => {
  if (newStoreId) {
    currentStoreId.value = route.params.storeId as string
  }
})

const { data: stores, status } = useLazyFetch('/api/stores', {
  key: 'stores',
})
const isFetchingStores = computed(() => status.value === 'pending')
const storesOptions = computed(() => {
  return (stores.value || []).map(item => ({
    id: item.id,
    label: item.name,
  }))
})
const handleSelectStore = async (newStoreId: string) => {
  await navigateTo(`/${newStoreId}`)
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
        icon: 'ion:person-circle',
      },
      {
        label: 'Settings',
        icon: 'ion:ios-settings',
      },
    ],
    [
      {
        label: 'Sign Out',
        icon: 'ion:log-out-outline',
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
    {
      label: 'Settings',
      to: {
        name: 'storeId-settings',
        params: {
          storeId: currentStoreId.value,
        },
      },
    },
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
            leading-icon="ion:storefront-sharp"
            searchable
            value-attribute="id"
            option-attribute="label"
            :ui="{ wrapper: 'w-[160px] shrink-0' }"
            @change="handleSelectStore"
          />
          <UButton
            icon="ion:add-outline"
            aria-label="Create store"
            color="primary"
            variant="ghost"
            class="shrink-0"
            @click="handleModalStore"
          />
          <UHorizontalNavigation :links="links" />
        </div>
        <div class="flex items-center gap-2">
          <UButton
            :icon="isDark ? 'ion:moon' : 'ion:sunny'"
            variant="ghost"
            aria-label="Theme"
            @click="handleToggleMode"
          />
          <UDropdown
            :items="userDropdownItems"
            :popper="{ placement: 'bottom-start' }"
          >
            <UAvatar
              size="xs"
              :src="user?.user_metadata?.avatar_url"
              :alt="user?.user_metadata?.name"
              icon="ion:person-circle"
            />
          </UDropdown>
        </div>
      </UContainer>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
