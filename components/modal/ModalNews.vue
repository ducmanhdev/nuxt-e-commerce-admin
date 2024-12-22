<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/news.schema'
import TiptapEditor from '~/components/TiptapEditor.vue'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>

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
  imageUrl: '',
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
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    const endpoint = props.newsId
      ? `/api/stores/${props.storeId}/news/${props.newsId}`
      : `/api/stores/${props.storeId}/news`
    const method = props.newsId ? 'PATCH' : 'POST'
    await $fetch(endpoint, {
      method,
      body: event.data,
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
    :prevent-close="isSubmitLoading"
    :ui="{
      content: 'sm:max-w-2xl',
    }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" />
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
