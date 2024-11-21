<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalCategory()
const { isFetching: isFetchingBillboards, data: billboards } = useReferenceBillboard()
</script>

<template>
  <UModal v-model:open="isOpen" :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Billboard" name="billboardId" required>
          <USelectMenu
            v-model="state.billboardId"
            :options="billboards"
            :loading="isFetchingBillboards"
            placeholder="Select a billboard"
            searchable
            searchable-placeholder="Search..."
            :search-attributes="['name']"
            option-attribute="name"
            value-attribute="id"
          />
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UButton type="button" block :loading="isSubmitLoading" label="Cancel" variant="soft" @click="handleHide" />
          <UButton type="submit" block :loading="isSubmitLoading" :label="submitButtonLabel" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
