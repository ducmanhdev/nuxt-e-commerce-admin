<script setup lang="ts">
await useFetch('/api/stores', {
  key: 'stores',
  transform: (data) => data.data,
  onResponseError: ({ response }) => {
    console.log('[FETCH_STORES_ERROR]', response.statusText)
    // showError({
    //   statusCode: response.status,
    //   statusMessage: response.statusText
    // })
  }
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
