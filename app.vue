<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <ClientOnly>
      <LazyModalStore />
      <Notivue v-slot="item">
        <NotivueSwipe :item="item">
          <Notification :item="item" :theme="pastelTheme">
            <NotificationProgress :item="item"/>
          </Notification>
        </NotivueSwipe>
      </Notivue>
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>