<script setup lang="ts">
const { isOpen, schema, state, handleHide, handleSubmit, isSubmitLoading, modalTitle, submitButtonLabel } =
  useModalProduct()
</script>

<template>
  <UModal v-model:open="isOpen" :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Price" name="price" required>
          <UInput v-model.number="state.price" type="number" min="0" />
        </UFormField>
        <UFormField label="Category" name="categoryId" required>
          <USelectMenu
            v-model="state.categoryId"
            :options="[]"
            placeholder="Select category"
            searchable
            searchable-placeholder="Search..."
            :search-attributes="['label']"
            value-attribute="value"
          />
        </UFormField>
        <UFormField label="Size" name="sizeId" required>
          <USelectMenu
            v-model="state.sizeId"
            :options="[]"
            placeholder="Select size"
            searchable
            searchable-placeholder="Search..."
            :search-attributes="['label']"
            value-attribute="value"
          />
        </UFormField>
        <UFormField label="Color" name="colorId" required>
          <USelectMenu
            v-model="state.colorId"
            :options="[]"
            placeholder="Select color"
            searchable
            searchable-placeholder="Search..."
            :search-attributes="['label']"
            value-attribute="value"
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
