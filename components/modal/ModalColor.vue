<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/color.schema'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>
type SchemaOutput = z.output<typeof schema>

type Props = {
  title?: string
  storeId: string
  colorId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.colorId ? 'Update color' : 'Create color'))

const DEFAULT_STATE: SchemaInfer = {
  name: '',
  value: '',
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

const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionColor()
const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  if (!props.storeId) {
    console.error('Store ID is required')
    return
  }

  if (props.colorId) {
    await handleUpdate({
      storeId: props.storeId,
      colorId: props.colorId,
      payload: event.data,
    })
  } else {
    await handleCreate({
      storeId: props.storeId,
      payload: event.data,
    })
  }

  await modal.close()
}
</script>

<template>
  <UModal :title="modalTitle" :prevent-close="isSubmitLoading">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Value" name="value" required>
          <div class="grid grid-cols-[40px_1fr] gap-2">
            <ColorPicker v-model="state.value" />
            <UInput v-model="state.value" />
          </div>
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            type="button"
            block
            :loading="isSubmitLoading"
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
