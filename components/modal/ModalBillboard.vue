<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalBillboard()
</script>

<template>
  <UModal v-model="isOpen" :prevent-close="isSubmitLoading">
    <UCard>
      <template #header>
        {{ modalTitle }}
      </template>
      <div class="space-y-4">
        <UForm :schema="schema" :state="state" :validate-on="['submit']" class="space-y-4" @submit="handleSubmit">
          <UFormGroup label="Name" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Image" name="imageUrl">
            <UploadImage
              :existing="state.imageUrl ? [state.imageUrl] : []"
              @update:existing="(images) => (state.imageUrl = images[0])"
              @update:deleted="(images) => (state.deletedImages = images)"
              @update:new="(files) => (state.newImageFiles = files)"
            />
          </UFormGroup>
          <div class="grid grid-cols-2 gap-2">
            <UButton type="button" block :loading="isSubmitLoading" label="Cancel" variant="soft" @click="handleHide" />
            <UButton type="submit" block :loading="isSubmitLoading" :label="submitButtonLabel" />
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
