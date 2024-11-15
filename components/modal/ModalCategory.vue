<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalCategory()
const { isFetching: isFetchingBillboards, data: billboards } = useReferenceBillboard()
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
          <UFormGroup label="Billboard" name="billboardId">
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
