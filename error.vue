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
          Oops! It seems something went wrong.
        </p>
        <p class="text-lg text-gray-900 dark:text-gray-300 mb-5">
          We’re sorry for the inconvenience. The page you're looking for might have been moved or doesn’t exist anymore.
        </p>
        <UButton
          icon="ion:ios-arrow-thin-left"
          label="Go Back Home"
          class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          @click="handleError"
        />
      </UContainer>
    </div>
  </div>
</template>
