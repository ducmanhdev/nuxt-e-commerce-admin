<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { formatCurrency } from '~/utils'
import BaseRating from '~/components/BaseRating.vue'

type Props = {
  image: string
  title: string
  rating: number
  price: number
  oldPrice?: number
  link: string
}
const props = defineProps<Props>()

const formattedPrice = computed(() => formatCurrency(props.price))
const formattedOldPrice = computed(() => formatCurrency(props.oldPrice || 0))
</script>

<template>
  <div class="">
    <!-- Square image -->
    <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
      <NuxtLink :to="link" class="block">
        <img :src="image" alt="Product Image" class="w-full h-full object-cover" />
      </NuxtLink>
    </div>

    <!-- Title -->
    <h3 class="mt-4 font-medium transition hover:text-primary">
      <NuxtLink :to="link">{{ title }}</NuxtLink>
    </h3>

    <!-- Rating -->
    <BaseRating :rating="rating" class="mt-1.5" />

    <!-- Price -->
    <div class="mt-1.5 font-medium">
      <span>{{ formattedPrice }}</span>
      <del v-if="oldPrice" class="ml-2 line-through text-sm text-gray-500">
        {{ formattedOldPrice }}
      </del>
    </div>
  </div>
</template>

<style scoped></style>
