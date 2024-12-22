<script setup lang="ts">
import { LazyModalConfirm, LazyModalStore } from '#components'

const storesStore = useStoresStore()
storesStore.fetchStores()

const storesOptions = computed(() => {
  return storesStore.stores.map((item) => ({
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

const toast = useCustomToast()
const modal = useModal()
const supabase = useSupabaseClient()
const handleSignOut = async () => {
  modal.open(LazyModalConfirm, {
    description: 'Are you to logout?',
    onConfirm: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('[SIGN_OUT_ERROR]', error)
        toast.error(`Failed to sign out: ${error.message}`)
        return
      }
      await navigateTo('/sign-in')
    },
  })
}

const user = useSupabaseUser()
const userDropdownItems = computed(() => {
  return [
    [
      {
        label: 'Profile',
        icon: 'heroicons:user-circle',
      },
    ],
    [
      {
        label: 'Sign Out',
        icon: 'heroicons:arrow-right-start-on-rectangle',
        color: 'error' as const,
        onSelect: handleSignOut,
      },
    ],
  ]
})

const { isDark, handleToggleMode } = useThemeMode()

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)
const navigationItems = computed(() => {
  return [
    {
      label: 'Overview',
      to: `/${storeId.value}`,
    },
    {
      label: 'Categories',
      to: `/${storeId.value}/categories`,
    },
    {
      label: 'Brands',
      to: `/${storeId.value}/brands`,
    },
    {
      label: 'Products',
      to: `/${storeId.value}/products`,
    },
    {
      label: 'News',
      to: `/${storeId.value}/news`,
    },
    {
      label: 'Banners',
      disabled: true,
    },
    {
      label: 'Vouchers',
      to: `/${storeId.value}/vouchers`,
    },
    {
      label: 'Orders',
      disabled: true,
    },
  ]
})
</script>

<template>
  <div>
    <header
      class="min-h-[82px] flex item-center py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)] sticky top-0 z-50"
    >
      <UContainer class="w-full flex items-center">
        <UTooltip text="Return home">
          <UButton icon="heroicons:home-20-solid" to="/" class="mr-4" />
        </UTooltip>
        <div v-if="storeId" class="flex items-center gap-2">
          <USelectMenu
            :items="storesOptions"
            :loading="storesStore.isFetchingStores"
            leading-icon="heroicons:building-storefront"
            highlight
            value-key="id"
            label-key="label"
            :model-value="storeId"
            class="w-50"
            @update:model-value="handleSelectStore"
          />
          <UTooltip text="Create new store">
            <UButton
              leading-icon="heroicons:plus"
              aria-label="Create store"
              color="primary"
              variant="ghost"
              @click="modal.open(LazyModalStore)"
            />
          </UTooltip>
          <UNavigationMenu :items="navigationItems" />
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <UChip inset>
            <UButton icon="heroicons:bell-solid" variant="ghost" color="neutral" />
          </UChip>
          <UTooltip text="Toggle dark mode">
            <UButton
              :icon="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
              variant="ghost"
              color="neutral"
              @click="handleToggleMode()"
            />
          </UTooltip>
          <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-start' }">
            <UButton
              :avatar="{
                src: user?.user_metadata?.avatar_url,
                alt: user?.user_metadata?.name,
                icon: 'heroicons:user',
                size: 'sm',
              }"
              variant="ghost"
              color="neutral"
              :ui="{
                base: 'p-0',
              }"
            />
          </UDropdownMenu>
        </div>
      </UContainer>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
