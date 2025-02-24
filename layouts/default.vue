<script setup lang="ts">
import { LazyModalConfirm } from '#components'
import type { Store } from '~/types'

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
      await navigateTo('/login')
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

const { isDark, handleToggleMode } = useThemeMode()

const route = useRoute()
const { data: cachedStores } = useNuxtData<Store[]>('stores')
const storeId = computed(() => route.params.storeId as string)
const store = computed(() => (cachedStores.value || [])?.find((cachedStores) => cachedStores.id === storeId.value))
</script>

<template>
  <div class="h-svh grid grid-rows-[auto_1fr]">
    <header
      class="py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)] sticky top-0 z-50"
    >
      <UContainer class="flex items-center">
        <UTooltip text="Return home">
          <UButton icon="lucide:house" to="/" class="mr-4" />
        </UTooltip>
        <h1 v-if="store" class="text-xl font-bold">{{ store.name }}</h1>
        <div class="flex items-center gap-2 ml-auto">
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
          <UTooltip text="Select app">
            <UButton icon="lucide:layout-grid" variant="ghost" color="neutral" to="/" />
          </UTooltip>
          <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-start' }">
            <UButton
              :avatar="{
                src: user?.user_metadata?.avatar_url,
                alt: user?.user_metadata?.name,
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
        </div>
      </UContainer>
    </header>
    <main class="overflow-hidden">
      <slot></slot>
    </main>
  </div>
</template>
