<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/store.schema'

type SchemaInfer = z.infer<typeof schema>

type Props = {
  title?: string
  storeId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.storeId ? 'Update store' : 'Create store'))
const submitSuccessMessage = computed(() =>
  props.storeId ? 'Updated store successfully' : 'Created store successfully'
)

const DEFAULT_STATE: SchemaInfer = {
  name: ''
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
const modal = useModal()
const isSubmitLoading = ref(false)
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true

    const endpoint = props.storeId ? `/api/stores/${props.storeId}` : `/api/stores`
    const method = props.storeId ? 'PATCH' : 'POST'
    await $fetch(endpoint, {
      method,
      body: event.data
    })

    toast.success(submitSuccessMessage.value)
    refreshNuxtData('stores')
    refreshNuxtData('store')
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
  <UModal :title="modalTitle" :dismissible="!isSubmitLoading" :close="!isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
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
