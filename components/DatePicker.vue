<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const dayjs = useDayjs()
const isOpen = ref(false)

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const props = withDefaults(
  defineProps<{
    range?: boolean
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
  }>(),
  { range: false },
)

const model = defineModel({
  required: true,
})

type ModelForRange = {
  start: CalendarDate
  end: CalendarDate
}
type ModelForSingle = CalendarDate
const parsedModel = computed({
  get() {
    if (props.range) {
      const { start, end } = model.value as { start: Date; end: Date }
      return {
        start: new CalendarDate(dayjs(start).year(), dayjs(start).month() + 1, dayjs(start).date()),
        end: new CalendarDate(dayjs(end).year(), dayjs(end).month() + 1, dayjs(end).date()),
      }
    } else {
      const date = model.value as Date
      return new CalendarDate(dayjs(date).year(), dayjs(date).month() + 1, dayjs(date).date())
    }
  },
  set(value) {
    if (props.range) {
      model.value = {
        start: (value as ModelForRange).start.toDate(getLocalTimeZone()),
        end: (value as ModelForRange).end.toDate(getLocalTimeZone()),
      }
    } else {
      model.value = (value as ModelForSingle).toDate(getLocalTimeZone())
    }
    isOpen.value = false
  },
})

const formattedDate = computed(() => {
  if (props.range) {
    const { start, end } = parsedModel.value as { start: CalendarDate; end: CalendarDate }
    return start && end
      ? `${df.format(start.toDate(getLocalTimeZone()))} - ${df.format(end.toDate(getLocalTimeZone()))}`
      : start
        ? df.format(start.toDate(getLocalTimeZone()))
        : 'Pick a date'
  } else {
    return df.format((parsedModel.value as CalendarDate).toDate(getLocalTimeZone()))
  }
})
</script>

<template>
  <UPopover v-model:open="isOpen">
    <UButton color="neutral" variant="outline" icon="heroicons:calendar" block class="justify-start">
      {{ formattedDate }}
    </UButton>

    <template #content>
      <UCalendar
        v-model="parsedModel"
        class="p-2"
        :range="range"
        v-bind="range ? { 'number-of-months': 2 } : {}"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
      />
    </template>
  </UPopover>
</template>
