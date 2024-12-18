<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/category.schema'

const modal = useModal()

const validationSchema = schema
  .merge(
    z.object({
      imageUrl: z.string().optional(),
      newImageFiles: z.instanceof(File).array().optional(),
      deletedImages: z.string().array().optional(),
    }),
  )
  .refine((data) => data.imageUrl || data.newImageFiles?.length, {
    message: 'Image must not be empty',
    path: ['imageUrl'],
  })

type SchemaInfer = z.infer<typeof validationSchema>

type Props = {
  title?: string
  storeId: string
  categoryId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.categoryId ? 'Update category' : 'Create category'))
const submitSuccessMessage = computed(() =>
  props.categoryId ? 'Updated category successfully' : 'Created category successfully',
)

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  imageUrl: '',
  newImageFiles: [],
  deletedImages: [],
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
    immediate: true,
  },
)

const toast = useCustomToast()
const isSubmitLoading = ref(false)
const bucketName = 'categories'
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    if (event.data.deletedImages?.length) {
      $fetch(`/api/images/delete`, {
        method: 'DELETE',
        body: {
          imageUrls: event.data.deletedImages,
          bucketName,
        },
      })
    }

    if (event.data.newImageFiles?.length) {
      const formData = new FormData()
      event.data.newImageFiles.forEach((file) => formData.append('files', file))
      formData.append('bucketName', bucketName)
      const { data: uploadResponse } = await $fetch(`/api/images/upload`, {
        method: 'POST',
        body: formData,
      })
      const { data, error } = uploadResponse[0]
      if (error) {
        toast.error(error.message)
        return
      }
      event.data.imageUrl = data!
    }

    if (!event.data.imageUrl) {
      toast.error('Image URL is required')
      return
    }

    const payload = {
      name: event.data.name,
      imageUrl: event.data.imageUrl,
    }

    if (props.categoryId) {
      await $fetch(`/api/stores/${props.storeId}/categories/${props.categoryId}`, {
        method: 'PATCH',
        body: payload,
      })
    } else {
      await $fetch(`/api/stores/${props.storeId}/categories`, {
        method: 'POST',
        body: payload,
      })
    }
    toast.success(submitSuccessMessage.value)
    refreshNuxtData('categories')
    await modal.close()
  } catch (error: any) {
    console.log(error)
    toast.error(error.statusMessage || 'Something went wrong')
  } finally {
    isSubmitLoading.value = false
  }
}
</script>

<template>
  <UModal :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="validationSchema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Image" name="imageUrl" required>
          <UploadImage
            :existing="state.imageUrl ? [state.imageUrl] : []"
            @update:existing="(images) => (state.imageUrl = images[0])"
            @update:deleted="(images) => (state.deletedImages = images)"
            @update:new="(files) => (state.newImageFiles = files)"
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
