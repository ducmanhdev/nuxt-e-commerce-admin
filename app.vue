<script setup lang="ts">
const storesStore = useStoresStore()
storesStore.fetchStores()
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>
