<script setup lang="ts">
type Props = {
  title?: string
  description?: string
  onConfirm?: () => void | Promise<void>
}
const {
  title = 'Confirm',
  description = 'Are you absolutely to do this?',
  onConfirm = () => {
    const modal = useModal()
    modal.close()
  },
} = defineProps<Props>()

const onCancel = () => {
  const modal = useModal()
  modal.close()
}

const modal = useModal()
const isConfirmLoading = ref(false)
const onConfirmWrapper = async () => {
  isConfirmLoading.value = true
  await onConfirm()
  isConfirmLoading.value = false
  await modal.close()
}
</script>

<template>
  <UModal :title="title" :description="description" :prevent-close="isConfirmLoading">
    <template #footer>
      <UButton type="button" block label="Cancel" variant="soft" :disabled="isConfirmLoading" @click="onCancel" />
      <UButton type="submit" block label="Confirm" :loading="isConfirmLoading" @click="onConfirmWrapper" />
    </template>
  </UModal>
</template>
