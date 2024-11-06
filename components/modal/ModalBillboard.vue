<script setup lang="ts">
const {
  isOpen,
  schema,
  state,
  handleHide,
  handleSubmit,
  isSubmitLoading,
  modalTitle,
  submitButtonLabel,
} = useModalBillboard()
</script>

<template>
  <UModal v-model="isOpen" :prevent-close="isSubmitLoading">
    <UCard>
      <template #header>
        {{ modalTitle }}
      </template>
      <div class="space-y-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormGroup label="Label" name="label">
            <UInput v-model="state.label" />
          </UFormGroup>
          <UFormGroup label="Image" name="imageUrl">
            <UploadImage
              :initial-images="state.imageUrl ? [state.imageUrl] : []"
              @change="imageUrls => state.imageUrl = imageUrls[0]"
            />
          </UFormGroup>
          <div class="grid grid-cols-2 gap-2">
            <UButton type="button" block :loading="isSubmitLoading" label="Cancel" variant="ghost" @click="handleHide" />
            <UButton type="submit" block :loading="isSubmitLoading" :label="submitButtonLabel" />
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
