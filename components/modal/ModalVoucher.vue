<script setup lang="ts">
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/voucher.schema'
import { CURRENCY_FORMAT_OPTIONS, VOUCHER_DISCOUNT_TYPES } from '~/constants'
import { getLocalTimeZone } from '@internationalized/date'

const dayjs = useDayjs()
const modal = useModal()

type SchemaInfer = z.infer<typeof schema>

type Props = {
  title?: string
  storeId: string
  voucherId?: string
  initialValues?: SchemaInfer
}
const props = defineProps<Props>()

const modalTitle = computed(() => props.title || (props.voucherId ? 'Update voucher' : 'Create voucher'))
const submitSuccessMessage = computed(() =>
  props.voucherId ? 'Updated voucher successfully' : 'Created voucher successfully',
)

const DEFAULT_STATE: SchemaInfer = {
  code: '',
  discountType: VOUCHER_DISCOUNT_TYPES.FIXED,
  discountValue: 0,
  startDate: dayjs().toDate(),
  endDate: dayjs().add(1, 'day').toDate(),
  maxDiscount: 0,
  minOrderValue: 0,
  usageLimit: 0,
}

const state = ref({ ...DEFAULT_STATE })
const attrs = useAttrs()
watch(
  [() => props.initialValues, () => attrs.open],
  ([newInitialValues, isOpen]) => {
    if (!isOpen) return
    Object.assign(state.value, {
      ...DEFAULT_STATE,
      ...newInitialValues,
      startDate: newInitialValues?.startDate ? dayjs(newInitialValues.startDate).toDate() : DEFAULT_STATE.startDate,
      endDate: newInitialValues?.endDate ? dayjs(newInitialValues.endDate).toDate() : DEFAULT_STATE.endDate,
    })
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

    const endpoint = props.voucherId
      ? `/api/stores/${props.storeId}/vouchers/${props.voucherId}`
      : `/api/stores/${props.storeId}/vouchers`
    const method = props.voucherId ? 'PATCH' : 'POST'
    await $fetch(endpoint, {
      method,
      body: event.data,
    })

    toast.success(submitSuccessMessage.value)
    refreshNuxtData('vouchers')
    await modal.close()
  } catch (error) {
    console.error(error)
    toast.error(error)
  } finally {
    isSubmitLoading.value = false
  }
}

const VOUCHER_DISCOUNT_TYPE_OPTIONS = Object.entries(VOUCHER_DISCOUNT_TYPES).map(([key, value]) => ({
  label: key,
  value: value,
}))
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
        <UFormField label="Code" name="code" required>
          <UInput v-model="state.code" />
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UFormField label="Discount type" name="discountType" required>
            <USelect v-model.number="state.discountType" :items="VOUCHER_DISCOUNT_TYPE_OPTIONS" />
          </UFormField>
          <UFormField label="Discount value" name="discountValue" required>
            <UInputNumber
              v-model.number="state.discountValue"
              :step="0.1"
              :format-options="
                state.discountType === VOUCHER_DISCOUNT_TYPES.PERCENTAGE
                  ? { style: 'percent' }
                  : CURRENCY_FORMAT_OPTIONS
              "
              orientation="vertical"
            />
          </UFormField>
        </div>
        <UFormField
          v-if="state.discountType === VOUCHER_DISCOUNT_TYPES.PERCENTAGE"
          label="Max discount"
          name="maxDiscount"
          required
        >
          <UInputNumber
            v-model.number="state.maxDiscount"
            :format-options="CURRENCY_FORMAT_OPTIONS"
            orientation="vertical"
          />
        </UFormField>
        <UFormField label="Min order value" name="minOrderValue" required>
          <UInputNumber
            v-model.number="state.minOrderValue"
            :format-options="CURRENCY_FORMAT_OPTIONS"
            orientation="vertical"
          />
        </UFormField>
        <UFormField label="Usage limit" name="usageLimit" required>
          <UInputNumber v-model.number="state.usageLimit" orientation="vertical" />
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UFormField label="Start date" name="startDate" required>
            <DatePicker
              v-model="state.startDate"
              :is-date-disabled="(date) => date.toDate(getLocalTimeZone()) < dayjs().toDate()"
            />
          </UFormField>
          <UFormField label="End date" name="endDate" required>
            <DatePicker
              v-model="state.endDate"
              :is-date-disabled="(date) => date.toDate(getLocalTimeZone()) < dayjs(state.startDate).toDate()"
            />
          </UFormField>
        </div>
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
