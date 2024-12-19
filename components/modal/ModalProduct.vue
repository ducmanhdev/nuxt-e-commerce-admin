<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema, { attributeValidator } from '~/schemas/product.schema'
import type { Attribute, Category } from '~/types'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>

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

const DEFAULT_STATE: Partial<SchemaInfer> = {
  name: '',
  description: '',
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
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
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

const useCategoryOptions = () => {
  const searchTerm = ref('')
  const searchTermDebounced = refDebounced(searchTerm, 200)
  const { data, status } = useLazyFetch(`/api/stores/${props.storeId}/categories`, {
    params: { search: searchTermDebounced },
    transform: ({ data }) => {
      return (
        data?.map((item) => ({
          label: (item as unknown as Category).name,
          value: (item as unknown as Category).id,
        })) || []
      )
    },
  })

  return {
    searchTerm,
    data,
    status,
  }
}
const { searchTerm: categorySearchTerm, data: categoryOptions, status: getCategoryOptionsStatus } = useCategoryOptions()

const useAttributeOptions = () => {
  const searchTerm = ref('')
  const searchTermDebounced = refDebounced(searchTerm, 200)
  const { data, status } = useLazyFetch(`/api/stores/${props.storeId}/attributes`, {
    params: { search: searchTermDebounced },
    transform: ({ data }) => {
      return data?.map((item) => (item as unknown as Attribute).name) || []
    },
  })

  return {
    searchTerm,
    data,
    status,
  }
}
const {
  searchTerm: attributeSearchTerm,
  data: attributeOptions,
  status: getAttributeOptionsStatus,
} = useAttributeOptions()
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
        <UFormField label="Category" name="categoryId" required>
          <USelectMenu
            v-model:search-term="categorySearchTerm"
            v-model="state.categoryId"
            :loading="getCategoryOptionsStatus === 'pending'"
            :items="categoryOptions || []"
            value-key="value"
          />
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
              v-model:search-term="attributeSearchTerm"
              v-model="attribute.name"
              create-item
              ignore-filter
              :items="attributeOptions || []"
              :loading="getAttributeOptionsStatus === 'pending'"
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

        <UButton type="button" icon="heroicons:plus" label="Add attribute" block @click="handleAddAttribute" />

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
