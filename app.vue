<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <UApp
      :toaster="{
        position: 'top-right',
      }"
    >
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
