<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import _schema from '~/schemas/category.schema'

const modal = useModal()

const schema = _schema.merge(
  z.object({
    imageUrl: z.union([z.string(), z.instanceof(File)])
  })
)

type SchemaInfer = z.infer<typeof schema>

type Props = {
  title?: string
  storeId: string
  categoryId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.categoryId ? 'Update category' : 'Create category'))
const submitSuccessMessage = computed(() =>
  props.categoryId ? 'Updated category successfully' : 'Created category successfully'
)

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  imageUrl: ''
}

const state = ref({ ...DEFAULT_STATE })
const attrs = useAttrs()
watch(
  [() => props.initialValues, () => attrs.open],
  ([newInitialValues, isOpen]) => {
    if (!isOpen) return
    Object.assign(state.value, { ...DEFAULT_STATE, ...newInitialValues })
  },
  {
    immediate: true
  }
)

const toast = useCustomToast()
const isSubmitLoading = ref(false)
const bucketName = 'categories'
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true
    if (event.data.imageUrl instanceof File) {
      const formData = new FormData()
      formData.append('files', event.data.imageUrl)
      formData.append('bucketName', bucketName)
      const { data } = await $fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })
      event.data.imageUrl = data[0]
    }

    const endpoint = props.categoryId
      ? `/api/stores/${props.storeId}/categories/${props.categoryId}`
      : `/api/stores/${props.storeId}/categories`
    const method = props.categoryId ? 'PATCH' : 'POST'
    await $fetch(endpoint, { method, body: event.data })
    toast.success(submitSuccessMessage.value)
    refreshNuxtData('categories')
    await modal.close()
  } catch (error) {
    toast.error(error)
  } finally {
    isSubmitLoading.value = false
  }
}
</script>

<template>
  <UModal :title="modalTitle" :dismissible="!isSubmitLoading" :close="!isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Image" name="imageUrl" required>
          <UploadImage
            :model-value="state.imageUrl ? [state.imageUrl] : []"
            @update:model-value="(newValue) => (state.imageUrl = newValue[0])"
          />
        </UFormField>
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
