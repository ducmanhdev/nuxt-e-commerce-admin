<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/billboard.schema'

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
  billboardId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.billboardId ? 'Update billboard' : 'Create billboard'))

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  imageUrl: '',
  newImageFiles: [],
  deletedImages: [],
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

const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionBillboard()
const { handleDeleteImages, handleUploadImages } = useSupabaseStorage('billboards')
const isProcessImageLoading = ref(false)
const processImages = async (data: SchemaOutput) => {
  try {
    isProcessImageLoading.value = true
    if (data.deletedImages?.length) {
      handleDeleteImages(data.deletedImages).then((data) => console.log({ data }))
    }
    if (data.newImageFiles?.length) {
      const [uploadedImageUrl] = await handleUploadImages(data.newImageFiles)
      return uploadedImageUrl
    }
    return data.imageUrl
  } finally {
    isProcessImageLoading.value = false
  }
}

const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  if (!props.storeId) {
    console.error('Store ID is required')
    return
  }

  const imageUrl = await processImages(event.data)
  if (!imageUrl) {
    push.error('Something went wrong with image processing')
    return
  }

  const payload = {
    name: event.data.name,
    imageUrl,
  }

  try {
    if (props.billboardId) {
      await handleUpdate({ storeId: props.storeId, billboardId: props.billboardId, payload })
    } else {
      await handleCreate({ storeId: props.storeId, payload })
    }
    await modal.close()
  } catch (error) {
    push.error('Failed to save billboard')
  }
}
</script>

<template>
  <UModal :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
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
