<script setup lang="ts">
import { LazyModalConfirm } from '#components'

definePageMeta({
  middleware: (to) => {
    if (to.name !== 'storeId') return
    return navigateTo({
      name: 'storeId-overview',
      params: to.params,
    })
  },
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)
const { data } = useLazyFetch(() => `/api/stores/${storeId.value}`)
const store = computed(() => data.value?.data)
watch(store, (newStore) => {
  if (newStore) return
  throw createError({
    statusCode: 404,
    message: 'Store not found',
    fatal: true,
  })
})

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

const navigationItems = computed(() => {
  return [
    [
      {
        icon: 'heroicons:chart-pie',
        label: 'Overview',
        to: `/${storeId.value}/overview`,
      },
      {
        icon: 'heroicons:tag',
        label: 'Categories',
        to: `/${storeId.value}/categories`,
      },
      {
        icon: 'heroicons:swatch',
        label: 'Brands',
        to: `/${storeId.value}/brands`,
      },
      {
        icon: 'heroicons:cube',
        label: 'Products',
        to: `/${storeId.value}/products`,
      },
      {
        icon: 'heroicons:newspaper',
        label: 'News',
        to: `/${storeId.value}/news`,
      },
      {
        icon: 'heroicons:photo',
        label: 'Banners',
        disabled: true,
      },
      {
        icon: 'heroicons:ticket',
        label: 'Vouchers',
        to: `/${storeId.value}/vouchers`,
      },
      {
        icon: 'heroicons:shopping-cart',
        label: 'Orders',
        disabled: true,
      },
    ],
    [
      {
        icon: 'heroicons:cog',
        label: 'Settings',
        disabled: true,
      },
      {
        icon: 'heroicons:question-mark-circle',
        label: 'Help',
        disabled: true,
      },
    ],
  ]
})
</script>

<template>
  <div class="grid h-svh grid-rows-[auto_1fr] overflow-hidden">
    <header
      class="py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)] sticky top-0 z-50"
    >
      <UContainer class="flex items-center">
        <UTooltip text="Return home">
          <UButton icon="heroicons:home-20-solid" to="/" class="mr-4" />
        </UTooltip>
        <h1 class="text-lg font-semibold">{{ store?.name }}</h1>
        <div class="flex items-center gap-2 ml-auto">
          <UChip inset :show="false">
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
          <UTooltip text="Select app">
            <UButton icon="heroicons:squares-2x2-16-solid" variant="ghost" color="neutral" to="/" />
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
    <main class="grid grid-cols-[250px_1fr]">
      <aside class="border-r border-[var(--ui-border)] p-4">
        <UNavigationMenu
          orientation="vertical"
          :items="navigationItems"
          :ui="{
            link: 'py-2',
          }"
        />
      </aside>
      <div class="p-4 max-h-full overflow-y-auto">
        <NuxtPage :store="store" />
      </div>
    </main>
  </div>
</template>
