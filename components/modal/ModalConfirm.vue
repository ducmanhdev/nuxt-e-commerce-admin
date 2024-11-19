<script setup lang="ts">
const { isOpen, message, confirm, cancel, isConfirmLoading, isCancelLoading } = useModalConfirm()
</script>

<template>
  <UModal v-model="isOpen" :prevent-close="isConfirmLoading || isCancelLoading">
    <UCard>
      <template #header> Confirm</template>
      <div class="space-y-4">
        <p class="text-xl text-center">
          {{ message }}
        </p>
        <div class="grid grid-cols-2 gap-2">
          <UButton type="button" block label="Cancel" variant="soft" :loading="isCancelLoading" @click="cancel" />
          <UButton type="submit" block label="Confirm" color="red" :loading="isConfirmLoading" @click="confirm" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
