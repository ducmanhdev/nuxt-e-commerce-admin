<script setup lang="ts">
const {
  isOpen,
  message,
  handleHide,
  handleConfirm,
  isConfirmLoading,
} = useModalConfirm()
</script>

<template>
  <UModal v-model="isOpen" :prevent-close="isConfirmLoading">
    <UCard>
      <template #header>
        Confirm
      </template>
      <div class="space-y-4">
        <p class="text-xl text-center">
          {{ message }}
        </p>
        <div class="grid grid-cols-2 gap-2">
          <UButton type="button" block label="Cancel" variant="soft" @click="handleHide" />
          <UButton type="submit" block label="Confirm" color="red" :loading="isConfirmLoading" @click="handleConfirm" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
