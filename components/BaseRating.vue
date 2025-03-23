<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rating: number
}
const props = defineProps<Props>()

const starRating = computed(() => {
  const rating = props.rating
  return Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(rating)) {
      return 'mdi:star'
    }
    if (index === Math.floor(rating) && rating % 1 >= 0.5) {
      return 'mdi:star-half-full'
    }
    return 'mdi:star-outline'
  })
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center text-yellow-500">
      <UIcon v-for="(star, index) in starRating" :key="index" :name="star" />
    </div>
    <span class="text-gray-600 text-sm">({{ rating }}/5)</span>
  </div>
</template>
