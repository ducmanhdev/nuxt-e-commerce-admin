<script setup lang="ts">
import { z } from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import schema, {attributeValidator} from '~/schemas/product.schema'
import { COMMON_STATUSES } from '~/constants'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>
type SchemaOutput = z.output<typeof schema>

type Props = {
  title?: string
  storeId: string
  categoryId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.categoryId ? 'Update product' : 'Create product'))
const submitSuccessMessage = computed(() =>
  props.categoryId ? 'Updated product successfully' : 'Created product successfully',
)

const DEFAULT_ATTRIBUTE = {
  name: '',
  value: '',
}

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  description: '',
  status: COMMON_STATUSES.VISIBLE,
  categoryId: '',
  attributes: [{ ...DEFAULT_ATTRIBUTE }],
}

const state = ref({ ...DEFAULT_STATE })
const attrs = useAttrs()
watch(
  [() => props.initialValues, () => attrs.open],
  ([newInitialValues, isOpen]) => {
    if (!isOpen) return
    Object.assign(state.value, { ...DEFAULT_STATE, ...newInitialValues })
    state.value.attributes = [{ ...DEFAULT_ATTRIBUTE }]
  },
  {
    immediate: true,
  },
)

const toast = useCustomToast()
const isSubmitLoading = ref(false)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    if (props.categoryId) {
      await $fetch(`/api/stores/${props.storeId}/products/${props.categoryId}`, {
        method: 'PATCH',
        body: event.data,
      })
    } else {
      await $fetch(`/api/stores/${props.storeId}/products`, {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success(submitSuccessMessage.value)
    refreshNuxtData('products')
    await modal.close()
  } catch (error: any) {
    console.log(error)
    toast.error(error.statusMessage || 'Something went wrong')
  } finally {
    isSubmitLoading.value = false
  }
}

const COMMON_STATUS_OPTIONS = Object.entries(COMMON_STATUSES).map(([key, value]) => ({
  label: key,
  value: value,
}))

const handleAddAttribute = () => {
  state.value.attributes = [...(state.value.attributes || []), { ...DEFAULT_ATTRIBUTE }]
}

const handleDeleteAttribute = (index: number) => {
  state.value.attributes?.splice(index, 1)
}

const items = ref(['Attribute 1', 'Attribute 2', 'Attribute 3', 'Attribute 4', 'Attribute 5'])
const onCreate = (item: string) => {
  items.value.push(item)
}

const categoryOptions = [
  {
    label: 'label',
    value: '0e1d3f49-6fa8-4abc-b7b8-e19bb19b1e05',
  },
]
</script>

<template>
  <UModal :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Description" name="description" required>
          <UInput v-model="state.description" />
        </UFormField>
        <UFormField label="Status" name="status" required>
          <USelect v-model="state.status" :items="COMMON_STATUS_OPTIONS" />
        </UFormField>
        <UFormField label="Category" name="categoryId" required>
          <USelectMenu v-model="state.categoryId" value-key="value" :items="categoryOptions" />
        </UFormField>

        <UForm
          v-for="(attribute, index) in state.attributes"
          :key="index"
          :state="attribute"
          :schema="attributeValidator"
          class="grid grid-cols-[1fr_1fr_auto] gap-2"
        >
          <UFormField :label="!index ? 'Name' : undefined" name="name">
            <UInputMenu
              v-model="attribute.name"
              create-item
              :items="items"
              @create="(_, item) => onCreate(item)"
            />
          </UFormField>
          <UFormField :label="!index ? 'Value' : undefined" name="value">
            <UInput v-model="attribute.value" />
          </UFormField>
          <UFormField :label="!index ? '&nbsp;' : undefined">
            <UButton type="button" icon="heroicons:trash" color="error" @click="handleDeleteAttribute(index)" />
          </UFormField>
        </UForm>

        <UButton type="button" icon="heroicons:plus" label="Add attribute" @click="handleAddAttribute" block />

        <div class="grid grid-cols-2 gap-2">
          <UButton
            type="button"
            block
            :disabled="isSubmitLoading"
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
