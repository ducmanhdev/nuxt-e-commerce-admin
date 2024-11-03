<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <ClientOnly>
      <UNotifications />
      <ModalStore />
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
</script>