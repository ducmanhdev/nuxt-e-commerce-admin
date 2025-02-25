<script setup lang="ts">
definePageMeta({
  layout: false
  // middleware: 'auth'
})
</script>

<template>
  <div class="h-svh grid grid-rows-[auto_1fr]">
    <header
      class="py-4 shadow border-b border-transparent dark:border-[var(--ui-border)] text-[var(--ui-text)] bg-[var(--ui-bg)] sticky top-0 z-50"
    >
      <UContainer></UContainer>
    </header>
    <main class="overflow-hidden">
      <NuxtPage />
    </main>
  </div>
</template>
