<script setup lang="ts">
type Props = {
  title?: string
}

defineProps<Props>()

const slots = defineSlots()
</script>

<template>
  <section class="py-14">
    <UContainer>
      <h2 class="font-bold uppercase text-3xl text-center mb-6">
        <template v-if="slots.title">
          <slot name="title"></slot>
        </template>
        <template v-else>
          {{ title }}
        </template>
      </h2>

      <slot></slot>
    </UContainer>
  </section>
</template>

<style scoped></style>
