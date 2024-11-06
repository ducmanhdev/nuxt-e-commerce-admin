<script setup lang="ts">
const {
  isOpen,
  message,
  handleHide,
  handleConfirm,
} = useModalConfirm()
</script>

<template>
  <UModal v-model="isOpen">
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
          <UButton type="submit" block label="Confirm" color="red" @click="handleConfirm" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
