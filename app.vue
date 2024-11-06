<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <LazyModalStore />
    <Notivue v-slot="item">
      <NotivueSwipe :item="item">
        <Notification :item="item" :theme="pastelTheme">
          <NotificationProgress :item="item" />
        </Notification>
      </NotivueSwipe>
    </Notivue>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
