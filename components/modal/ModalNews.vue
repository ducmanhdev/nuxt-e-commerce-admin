<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/news.schema'
import TiptapEditor from '~/components/TiptapEditor.vue'

const modal = useModal()

const validationSchema = schema
  .merge(
    z.object({
      imageUrl: z.string().optional(),
      newImageFiles: z.instanceof(File).array().optional(),
      deletedImages: z.string().array().optional()
    })
  )
  .refine((data) => data.imageUrl || data.newImageFiles?.length, {
    message: 'Image must not be empty',
    path: ['imageUrl']
  })

type SchemaInfer = z.infer<typeof validationSchema>

type Props = {
  title?: string
  storeId: string
  newsId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.newsId ? 'Update news' : 'Create news'))
const submitSuccessMessage = computed(() => (props.newsId ? 'Updated news successfully' : 'Created news successfully'))

const DEFAULT_STATE: SchemaInfer = {
  title: '',
  content: '',
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
const bucketName = 'news'
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    const { deletedImages, newImageFiles } = event.data

    if (deletedImages?.length) {
      await $fetch('/api/images/delete', {
        method: 'DELETE',
        body: { imageUrls: deletedImages, bucketName }
      })
    }

    if (newImageFiles?.length) {
      const formData = new FormData()
      newImageFiles.forEach((file) => formData.append('files', file))
      formData.append('bucketName', bucketName)
      const { data } = await $fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })
      event.data.imageUrl = data[0]
    }

    if (!event.data.imageUrl) throw new Error('Image URL is required')

    const endpoint = props.newsId
      ? `/api/stores/${props.storeId}/news/${props.newsId}`
      : `/api/stores/${props.storeId}/news`
    const method = props.newsId ? 'PATCH' : 'POST'

    await $fetch(endpoint, {
      method,
      body: {
        title: event.data.title,
        content: event.data.content,
        imageUrl: event.data.imageUrl
      }
    })

    toast.success(submitSuccessMessage.value)
    refreshNuxtData('news')
    await modal.close()
  } catch (error) {
    console.error(error)
    toast.error(error)
  } finally {
    isSubmitLoading.value = false
  }
}
</script>

<template>
  <UModal
    :title="modalTitle"
    :dismissible="!isSubmitLoading"
    :close="!isSubmitLoading"
    :ui="{
      content: 'sm:max-w-2xl'
    }"
  >
    <template #body>
      <UForm :schema="validationSchema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" />
        </UFormField>
        <UFormField label="Image" name="imageUrl" required>
          <UploadImage
            :existing="state.imageUrl ? [state.imageUrl] : []"
            @update:existing="(images) => (state.imageUrl = images[0])"
            @update:deleted="(images) => (state.deletedImages = images)"
            @update:new="(files) => (state.newImageFiles = files)"
          />
        </UFormField>
        <UFormField label="Content" name="content" required>
          <TiptapEditor v-model="state.content" />
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
