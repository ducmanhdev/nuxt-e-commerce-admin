<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/product.schema'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>
type SchemaOutput = z.output<typeof schema>

type Props = {
  title?: string
  storeId: string
  productId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.storeId ? 'Update product' : 'Create product'))

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  sizeId: '',
  categoryId: '',
  colorId: '',
  price: 0,
  isArchived: false,
}

const state = ref({ ...DEFAULT_STATE })

watch(
  () => props.initialValues,
  (newValue) => {
    Object.assign(state.value, { ...DEFAULT_STATE, ...newValue })
  },
  {
    immediate: true,
  },
)

const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionProduct()
const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  if (!props.storeId) {
    console.error('Store ID is required')
    return
  }

  if (props.productId) {
    await handleUpdate({
      storeId: props.storeId,
      productId: props.productId,
      payload: event.data,
    })
  } else {
    await handleCreate({
      storeId: props.storeId,
      payload: event.data,
    })
  }

  await modal.close()
}
</script>

<template>
  <UModal :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Price" name="price" required>
          <UInput v-model.number="state.price" type="number" min="0" />
        </UFormField>
        <UFormField label="Category" name="categoryId" required></UFormField>
        <UFormField label="sizeId" name="sizeId" required></UFormField>
        <UFormField label="Color" name="colorId" required></UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            type="button"
            block
            :loading="isSubmitLoading"
            label="Cancel"
            variant="soft"
            @click="modal.close()"
          />
          <UButton type="submit" block :loading="isSubmitLoading" label="Submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
