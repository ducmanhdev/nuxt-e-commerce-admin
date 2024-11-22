<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/store.schema'

const modal = useModal()

type SchemaInfer = z.infer<typeof schema>
type SchemaOutput = z.output<typeof schema>

type Props = {
  title?: string
  storeId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.storeId ? 'Update store' : 'Create store'))

const DEFAULT_STATE: SchemaInfer = {
  name: '',
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

const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionStore()
const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
  if (props.storeId) {
    await handleUpdate({
      storeId: props.storeId,
      payload: event.data,
    })
  } else {
    await handleCreate(event.data)
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
