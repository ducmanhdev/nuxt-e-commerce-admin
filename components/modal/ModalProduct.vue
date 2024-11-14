<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalProduct()

const options = {};
const isFetchingOptions = false;
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
          <UFormGroup label="Price" name="price">
            <UInput v-model.number="state.price" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Category" name="categoryId">
            <USelectMenu
              v-model="options.categoryId"
              :options="data?.categoryOptions"
              :loading="isFetchingOptions"
              placeholder="Select category"
              searchable
              searchable-placeholder="Search..."
              :search-attributes="['label']"
              value-attribute="value"
            />
          </UFormGroup>
          <UFormGroup label="Size" name="sizeId">
            <USelectMenu
              v-model="state.sizeId"
              :options="options?.sizeOptions"
              :loading="isFetchingOptions"
              placeholder="Select size"
              searchable
              searchable-placeholder="Search..."
              :search-attributes="['label']"
              value-attribute="value"
            />
          </UFormGroup>
          <UFormGroup label="Color" name="colorId">
            <USelectMenu
              v-model="state.colorId"
              :options="options?.colorOptions"
              :loading="isFetchingOptions"
              placeholder="Select color"
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
