<script setup lang="ts">
definePageMeta({
  layout: false
})

const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) return navigateTo('/')
})
</script>

<template>
  <section class="py-4">
    <UContainer> Waiting for login...</UContainer>
  </section>
</template>
