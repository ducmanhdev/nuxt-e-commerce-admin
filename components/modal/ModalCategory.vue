<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel, storeId } =
  useModalCategory()

const { data, status } = useFetch(() => `/api/stores/${storeId.value}/billboards`, {
  key: 'billboardOptions',
  transform: ({ data }) => {
    return data.map((billboard) => ({
      label: billboard.name,
      value: billboard.id,
    }))
  },
  default: () => [],
  immediate: false,
  server: false,
  lazy: true,
})
const isFetchingData = computed(() => status.value === 'pending')
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
              :options="data"
              :loading="isFetchingData"
              placeholder="Select a person"
              searchable
              searchable-placeholder="Search..."
              :search-attributes="['label']"
              value-attribute="value"
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
