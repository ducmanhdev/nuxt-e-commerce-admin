<script setup lang="ts">
import { LazyModalConfirm } from '#components'
import { useStorage } from '@vueuse/core'

const navItems = ref([
  {
    label: 'Shop',
    to: '/products',
    children: [
      {
        label: 'T-shirt'
      },
      {
        label: 'Trousers'
      },
      {
        label: 'Skirt'
      }
    ]
  },
  {
    label: 'On sales',
    to: '/sales'
  },
  {
    label: 'New Arrivals',
    to: '/arrivals'
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

const { isDark, handleToggleMode } = useThemeMode()

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
  <div>
    <div v-if="isShowPromotionBar" class="bg-black text-white text-sm text-center py-2">
      <UContainer class="max-w-full grid grid-cols-[100px_1fr_100px] gap-4 items-center">
        <p class="col-start-2">
          Sign up and get 20% off to your first order.
          <NuxtLink to="/(auth)/sign-up" class="underline">Sign Up Now</NuxtLink>
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
    <header
      class="py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)] sticky top-0 z-50"
    >
      <UContainer class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <h1 class="font-bold text-2xl">LOGO</h1>
          <UNavigationMenu :items="navItems" />
        </div>
        <div class="flex items-center gap-2">
          <UInput class="w-xs" size="xl" icon="lucide:search" variant="outline" placeholder="Search..." />
          <UChip inset show>
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />
          </UChip>
          <UTooltip text="Toggle dark mode">
            <UButton
              :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
              variant="ghost"
              color="neutral"
              @click="handleToggleMode()"
            />
          </UTooltip>
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
