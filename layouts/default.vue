<script setup lang="ts">
import { LazyModalStore } from '#components'

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { stores, isFetchingStores } = useActionStore()

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

const modal = useModal()

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
            :loading="isFetchingStores"
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
          <UTooltip text="Toggle dark mode">
            <UButton
              :icon="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
              variant="ghost"
              aria-label="Theme"
              @click="handleToggleMode()"
            />
          </UTooltip>
          <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-start' }">
            <UAvatar :src="user?.user_metadata?.avatar_url" :alt="user?.user_metadata?.name" icon="heroicons:user" />
          </UDropdownMenu>
        </div>
      </UContainer>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
