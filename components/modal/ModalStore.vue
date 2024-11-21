<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalStore()
</script>

<template>
  <UModal v-model:open="isOpen" :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UButton type="button" block :loading="isSubmitLoading" label="Cancel" variant="soft" @click="handleHide" />
          <UButton type="submit" block :loading="isSubmitLoading" :label="submitButtonLabel" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
