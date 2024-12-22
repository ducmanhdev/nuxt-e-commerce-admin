<script setup lang="ts">
const user = useSupabaseUser()
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="py-4">
    <UContainer> Waiting for login...</UContainer>
  </section>
</template>
