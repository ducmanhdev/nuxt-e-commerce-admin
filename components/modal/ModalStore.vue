<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/store.schema'
import { LazyModalConfirm } from '#components'

type SchemaInfer = z.infer<typeof schema>

type Props = {
  title?: string
  storeId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.storeId ? 'Update store' : 'Create store'))
const submitSuccessMessage = computed(() =>
  props.storeId ? 'Updated store successfully' : 'Created store successfully',
)

const DEFAULT_STATE: Partial<SchemaInfer> = {
  name: '',
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
const modal = useModal()
const storesStore = useStoresStore()
const isSubmitLoading = ref(false)
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true
    if (props.storeId) {
      await $fetch(`/api/stores/${props.storeId}`, {
        method: 'PATCH',
        body: event.data,
      })
    } else {
      await $fetch('/api/stores', {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success(submitSuccessMessage.value)
    storesStore.fetchStores()
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
