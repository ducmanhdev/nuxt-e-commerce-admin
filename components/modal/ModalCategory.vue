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
type SchemaOutput = z.output<typeof validationSchema>

type Props = {
  title?: string
  storeId: string
  categoryId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.categoryId ? 'Update category' : 'Create category'))

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

const { handleCreate, handleUpdate } = useActionCategory()
const { handleDeleteImages, handleUploadImages } = useSupabaseStorage('categories')

const isSubmitLoading = ref(false)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    if (event.data.deletedImages?.length) {
      handleDeleteImages(event.data.deletedImages)
    }

    if (event.data.newImageFiles?.length) {
      const uploadResponse = await handleUploadImages(event.data.newImageFiles)
      const { data, error } = uploadResponse[0]
      if (error) {
        push.error(error.message)
        return
      }
      event.data.imageUrl = data
    }

    if (!event.data.imageUrl) {
      push.error('Image URL is required')
      return
    }

    const payload = {
      name: event.data.name,
      imageUrl: event.data.imageUrl,
    }

    if (props.categoryId) {
      await handleUpdate({
        storeId: props.storeId,
        categoryId: props.categoryId,
        payload: payload,
      })
    } else {
      await handleCreate({
        storeId: props.storeId,
        payload: payload,
      })
    }

    modal.close()
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
