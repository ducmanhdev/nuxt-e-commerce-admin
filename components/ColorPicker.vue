<script setup lang="ts">
interface Props {
  disabled?: boolean
}
const { disabled = false } = defineProps<Props>()
const model = defineModel<string>()
</script>

<template>
  <UInput v-model="model" class="color-picker" type="color" :disabled="disabled" />
</template>

<style scoped>
.color-picker :deep() {
  input[type='color'] {
    padding: 4px;
    min-height: 32px;
  }

  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type='color']::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
}
</style>
