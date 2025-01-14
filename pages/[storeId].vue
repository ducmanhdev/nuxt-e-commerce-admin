<script setup lang="ts">
definePageMeta({
  middleware: (to) => {
    if (to.name !== 'storeId') return
    return navigateTo({
      name: 'storeId-overview',
      params: to.params
    })
  }
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)
await useFetch(() => `/api/stores/${storeId.value}`, {
  key: `store`,
  transform: (data) => data.data,
  onResponse: ({ response }) => {
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${response._data.data?.name} - ${titleChunk}` : `${response._data.data?.name}`
      }
    })
  },
  onResponseError: ({ response }) => {
    console.error('[FETCH_STORE_ERROR]', response.statusText)
    showError({
      statusCode: response.status,
      statusMessage: response.statusText
    })
  }
})

const navigationItems = computed(() => {
  return [
    [
      {
        icon: 'lucide:chart-no-axes-combined',
        label: 'Overview',
        to: `/${storeId.value}/overview`
      },
      {
        icon: 'lucide:tags',
        label: 'Categories',
        to: `/${storeId.value}/categories`
      },
      {
        icon: 'lucide:swatch-book',
        label: 'Brands',
        to: `/${storeId.value}/brands`
      },
      {
        icon: 'lucide:cuboid',
        label: 'Products',
        to: `/${storeId.value}/products`
      },
      {
        icon: 'lucide:newspaper',
        label: 'News',
        to: `/${storeId.value}/news`
      },
      {
        icon: 'lucide:images',
        label: 'Banners',
        disabled: true
      },
      {
        icon: 'lucide:tickets',
        label: 'Vouchers',
        to: `/${storeId.value}/vouchers`
      },
      {
        icon: 'lucide:shopping-cart',
        label: 'Orders',
        disabled: true
      }
    ],
    [
      {
        icon: 'lucide:settings',
        label: 'Settings',
        disabled: true
      },
      {
        icon: 'lucide:message-circle-question',
        label: 'Help',
        disabled: true
      }
    ]
  ]
})
</script>

<template>
  <div class="h-full grid grid-cols-[250px_1fr]">
    <aside class="border-r border-[var(--ui-border)] p-4">
      <UNavigationMenu
        orientation="vertical"
        :items="navigationItems"
        :ui="{
          link: 'py-2'
        }"
      />
    </aside>
    <div class="p-4 overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>
