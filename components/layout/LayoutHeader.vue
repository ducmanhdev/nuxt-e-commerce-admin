<script setup lang="ts">
import { LazyModalConfirm } from '#components'
import { useStorage } from '@vueuse/core'

const navItems = ref([
  {
    label: 'Shop',
    to: '/products',
    children: [
      {
        label: 'T-shirt',
        to: '/products/?category=t-shirt'
      },
      {
        label: 'Trousers',
        to: '/products/?category=trousers'
      },
      {
        label: 'Skirt',
        to: '/products/?category=skirt'
      }
    ]
  },
  {
    label: 'On sales',
    to: '/sales'
  },
  {
    label: 'New Arrivals',
    to: '/new-arrivals'
  },
  {
    label: 'Brands',
    to: '/brands'
  },
  {
    label: 'Blogs',
    to: '/blogs'
  }
])

const { colorMode, isDark, handleToggleMode } = useThemeMode()

const user = useSupabaseUser()
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
        toast.error(error)
        return
      }
      await navigateTo('/')
    }
  })
}
const userDropdownItems = computed(() => {
  return [
    [
      {
        label: 'Profile',
        icon: 'heroicons:user-circle'
      }
    ],
    [
      {
        label: 'Sign Out',
        icon: 'lucide:log-out',
        color: 'error' as const,
        onSelect: handleSignOut
      }
    ]
  ]
})

const isShowPromotionBar = useStorage('isShowPromotionBar', !user.value)
const handleHidePromotionBar = () => {
  isShowPromotionBar.value = false
}
</script>

<template>
  <div class="sticky top-0 z-50">
    <ClientOnly>
      <div v-if="isShowPromotionBar" class="bg-black text-white text-sm text-center py-2">
        <UContainer class="max-w-full grid grid-cols-[100px_1fr_100px] gap-4 items-center">
          <p class="col-start-2">
            Sign up and get 20% off to your first order.
            <NuxtLink to="/sign-up" class="underline">Sign Up Now</NuxtLink>
          </p>
          <UButton
            icon="lucide:x"
            variant="ghost"
            color="neutral"
            class="justify-self-end text-white hover:text-black"
            @click="handleHidePromotionBar"
          />
        </UContainer>
      </div>
    </ClientOnly>
    <header
      class="py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)]"
    >
      <UContainer class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <h1 class="font-bold text-2xl">LOGO</h1>
          <UNavigationMenu :items="navItems" arrow />
        </div>
        <div class="flex items-center gap-2">
          <UChip inset show>
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />
          </UChip>
          <ClientOnly v-if="!colorMode?.forced">
            <UTooltip text="Toggle dark mode">
              <UButton
                :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
                variant="ghost"
                color="neutral"
                @click="handleToggleMode()"
              />
            </UTooltip>
            <template #fallback>
              <UButton :icon="'lucide:sun'" variant="ghost" color="neutral" />
            </template>
          </ClientOnly>
          <UDropdownMenu v-if="user" :items="userDropdownItems" :popper="{ placement: 'bottom-start' }">
            <UButton
              :avatar="{
                src: user.user_metadata?.avatar_url,
                alt: user.user_metadata?.name,
                icon: 'lucide:circle-user',
                size: 'md'
              }"
              variant="ghost"
              color="neutral"
              :ui="{
                base: 'p-0'
              }"
            />
          </UDropdownMenu>
          <UButton v-else label="Sign in" to="/sign-in" />
        </div>
      </UContainer>
    </header>
  </div>
</template>

<style scoped></style>
