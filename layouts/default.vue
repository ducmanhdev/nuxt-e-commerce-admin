<script setup lang="ts">
import { useSupabaseUser } from '#imports'

const route = useRoute()
const router = useRouter()

const currentStoreId = ref<string | undefined>(route.params.storeId as string)

const { data: stores, status } = await useLazyFetch('/api/stores', {
  key: 'stores',
})
const isFetchingStores = computed(() => status.value === 'pending')

const storesOptions = computed(() => {
  return (stores.value || []).map(item => ({
    id: item.id,
    label: item.name,
  }))
})

watchEffect(() => {
  const hasStores = storesOptions.value.length > 0
  const isStoreNotSelected = !currentStoreId.value
  const isStoreNotInOptions = !storesOptions.value.some(store => store.id === currentStoreId.value)

  if (hasStores && (isStoreNotSelected || isStoreNotInOptions)) {
    currentStoreId.value = storesOptions.value[0].id
  }
})

watch(currentStoreId, (newStoreId) => {
  router.push(`/${newStoreId}`)
})

const { isDark, handleToggleMode } = useThemeMode()

const supabase = useSupabaseClient()
const user = useSupabaseUser()
async function handleSignOut() {
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
          <ClientOnly>
            <USelectMenu
              v-model="currentStoreId"
              :options="storesOptions"
              :loading="isFetchingStores"
              leading-icon="ion:storefront-sharp"
              searchable
              value-attribute="id"
              option-attribute="label"
              :ui="{ wrapper: 'w-[160px] shrink-0' }"
            />
            <UButton
              icon="ion:add-outline"
              aria-label="Create store"
              color="primary"
              variant="ghost"
              class="shrink-0"
              @click="handleModalStore"
            />
            <template #fallback>
              <USkeleton class="h-8 w-[160px] shrink-0" />
              <USkeleton class="h-8 w-8 shrink-0" />
            </template>
          </ClientOnly>
          <UHorizontalNavigation :links="links" />
        </div>
        <div class="flex items-center gap-2">
          <ClientOnly>
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

            <template #fallback>
              <USkeleton v-for="item in 2" :key="item" class="h-8 w-8 rounded-full" />
            </template>
          </ClientOnly>
        </div>
      </UContainer>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
