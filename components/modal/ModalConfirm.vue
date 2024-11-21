<script setup lang="ts">
const { isOpen, message, confirm, cancel, isConfirmLoading, isCancelLoading } = useModalConfirm()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :prevent-close="isConfirmLoading || isCancelLoading"
    title="Confirm"
    :description="message"
  >
    <template #footer>
      <UButton type="button" block label="Cancel" variant="soft" :loading="isCancelLoading" @click="cancel" />
      <UButton type="submit" block label="Confirm" :loading="isConfirmLoading" @click="confirm" />
    </template>
  </UModal>
</template>
