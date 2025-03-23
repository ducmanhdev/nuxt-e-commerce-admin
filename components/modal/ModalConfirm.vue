<script setup lang="ts">
const {
  title = 'Confirm',
  description = 'Are you absolutely to do this?',
  onConfirm = () => {
    // eslint-disable-next-line ts/no-use-before-define
    emit('close', true)
  },
} = defineProps<{
  title?: string
  description?: string
  onConfirm?: () => void | Promise<void>
}>()

const emit = defineEmits<{
  (e: 'close', value: boolean): void
}>()

const onCancel = () => {
  emit('close', true)
}

const isConfirmLoading = ref(false)
const onConfirmWrapper = async () => {
  isConfirmLoading.value = true
  await onConfirm()
  isConfirmLoading.value = false
  emit('close', true)
}
</script>

<template>
  <UModal :title="title" :description="description" :dismissible="isConfirmLoading" :close="!isConfirmLoading">
    <template #footer>
      <UButton type="button" block label="Cancel" variant="soft" :disabled="isConfirmLoading" @click="onCancel" />
      <UButton type="submit" block label="Confirm" :loading="isConfirmLoading" @click="onConfirmWrapper" />
    </template>
  </UModal>
</template>
