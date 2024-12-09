<script setup lang="ts">
import { z } from 'zod'
import dayjs from 'dayjs'
import type { FormSubmitEvent } from '#ui/types'
import schema from '~/schemas/voucher.schema'
import { CURRENCY_FORMAT_OPTIONS, VOUCHER_DISCOUNT_TYPES, VOUCHER_STATUSES } from '~/constants'
import { getLocalTimeZone } from '@internationalized/date'

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

const DEFAULT_STATE: Partial<SchemaInfer> = {
  code: '',
  discountType: VOUCHER_DISCOUNT_TYPES.FIXED,
  discountValue: 0,
  startDate: dayjs().toDate(),
  endDate: dayjs().add(1, 'day').toDate(),
  maxDiscount: 0,
  minOrderValue: 0,
  status: VOUCHER_STATUSES.ACTIVE,
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

const date1 = dayjs('2024-12-12T07:35:34.459Z')
const date2 = dayjs('2024-12-13T07:35:34.459Z')

console.log(date1.isSameOrAfter(date2)) // false
console.log(date2.isSameOrAfter(date1)) // true

const toast = useCustomToast()
const isSubmitLoading = ref(false)
const handleSubmit = async (event: FormSubmitEvent<SchemaInfer>) => {
  try {
    isSubmitLoading.value = true

    if (!props.storeId) {
      console.error('Store ID is required')
      return
    }

    if (props.voucherId) {
      await $fetch(`/api/stores/${props.storeId}/vouchers/${props.voucherId}`, {
        method: 'PATCH',
        body: event.data,
      })
    } else {
      await $fetch(`/api/stores/${props.storeId}/vouchers`, {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success(submitSuccessMessage.value)
    refreshNuxtData('vouchers')
    await modal.close()
  } catch (error: any) {
    console.log(error)
    toast.error(error.statusMessage || 'Something went wrong')
  } finally {
    isSubmitLoading.value = false
  }
}

const VOUCHER_DISCOUNT_TYPE_OPTIONS = Object.entries(VOUCHER_DISCOUNT_TYPES).map(([key, value]) => ({
  label: key,
  value: value,
}))

const VOUCHER_STATUS_OPTIONS = Object.entries(VOUCHER_STATUSES).map(([key, value]) => ({
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
        <UFormField label="Status" name="status" required>
          <USelect v-model="state.status" :items="VOUCHER_STATUS_OPTIONS" />
        </UFormField>
        <div class="grid grid-cols-2 gap-2">
          <UFormField label="Discount type" name="discountType" required>
            <USelect v-model="state.discountType" :items="VOUCHER_DISCOUNT_TYPE_OPTIONS" />
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
