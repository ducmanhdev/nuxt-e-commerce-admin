<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({

  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center">
    <div>
      <UContainer>
        <h2 class="text-6xl font-bold text">
          {{ error?.statusCode }}
        </h2>
        <p class="text-xl my-3 text-gray-900 dark:text-gray-300">
          {{ error?.statusMessage || 'Oops! It seems something went wrong.' }}
        </p>
        <UButton leading-icon="lucide:arrow-left" label="Go Back Home" @click="handleError" />
      </UContainer>
    </div>
  </div>
</template>
