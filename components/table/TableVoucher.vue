<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue'
import type { Column, Row, SortingState, VisibilityState } from '@tanstack/vue-table'
import type { Voucher } from '~/types'
import { LazyModalConfirm, LazyModalVoucher } from '#components'
import { refDebounced } from '@vueuse/core'
import { upperFirst } from 'scule'
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  ROWS_PER_PAGE_OPTIONS,
  VOUCHER_DISCOUNT_TYPES,
  VOUCHER_STATUSES,
} from '~/constants'

const props = defineProps<Props>()
const UIcon = resolveComponent('UIcon')
const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')

interface Props {
  storeId: string
}
const dayjs = useDayjs()
const storeId = toRef(props, 'storeId')

const table = useTemplateRef('table')
const rowSelection = ref({})

const toast = useCustomToast()
const overlay = useOverlay()
const modalConfirm = overlay.create(LazyModalConfirm)
const modalVoucher = overlay.create(LazyModalVoucher)
const handleDelete = ({ storeId, id }: { storeId: string, id: string }) => {
  modalConfirm.open({
    props: {
      message: 'Are you absolutely to delete this item?',
      onConfirm: async () => {
        try {
          await $fetch(`/api/stores/${storeId}/vouchers/${id}`, {
            method: 'DELETE',
          })
          toast.success('Deleted successfully')
          refreshNuxtData('vouchers')
        }
        catch (error) {
          console.error(error)
          toast.error(error)
        }
      },
    },
  })
}
const getActionItems = (row: Row<Voucher>) => {
  return [
    [
      {
        label: 'Edit',
        icon: 'lucide:pencil-line',
        onSelect: () =>
          modalVoucher.open({
            props: {
              storeId: row.original.storeId,
              voucherId: row.original.id,
              initialValues: { ...row.original },
            },
          }),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'lucide:trash',
        color: 'error',
        onSelect: () =>
          handleDelete({
            storeId: row.original.storeId,
            id: row.original.id,
          }),
      },
    ],
  ]
}
const getHeader = (column: Column<Voucher>, label: string) => {
  const isEnableSort = column.getCanSort()
  if (!isEnableSort)
    return label

  const isSorted = column.getIsSorted()
  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start',
      },
      items: [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'lucide:arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            }
            else {
              column.toggleSorting(false)
            }
          },
        },
        {
          label: 'Desc',
          icon: 'lucide:arrow-up-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            }
            else {
              column.toggleSorting(true)
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'lucide:arrow-up-narrow-wide'
            : 'lucide:arrow-up-wide-narrow'
          : 'lucide:arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-[var(--ui-bg-elevated)]',
      }),
  )
}
const columns: TableColumn<Voucher>[] = [
  {
    id: 'select',
    enableHiding: false,
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsAllPageRowsSelected(),
        'indeterminate': table.getIsSomePageRowsSelected(),
        'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(value),
        'ariaLabel': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value),
        'ariaLabel': 'Select row',
      }),
  },
  {
    accessorKey: 'code',
    header: ({ column }) => getHeader(column, 'Code'),
    cell: ({ row }) => {
      const value = row.getValue<string>('code')
      // const copyToClipboard = () => {
      //   navigator.clipboard
      //     .writeText(value)
      //     .then(() => {
      //       toast.success('Voucher code copied to clipboard')
      //     })
      //     .catch((err) => {
      //       console.error('Failed to copy: ', err)
      //       toast.error('Failed to copy voucher code')
      //     })
      // }
      return h(
        'div',
        {
          class: 'flex items-center gap-2',
        },
        [
          h(UIcon, { name: 'lucide:ticket' }),
          h('span', value),
          // h(UButton, {
          //   icon: 'lucide:clipboard',
          //   variant: 'ghost',
          //   onClick: copyToClipboard,
          //   ariaLabel: 'Copy voucher code',
          // }),
        ],
      )
    },
    meta: {
      class: {
        td: 'font-bold text-primary',
      },
    },
  },
  {
    accessorKey: 'discountType',
    header: ({ column }) => getHeader(column, 'Discount type'),
    cell: ({ row }) => {
      const value = row.getValue('discountType')
      const color = {
        [VOUCHER_DISCOUNT_TYPES.FIXED]: 'primary' as const,
        [VOUCHER_DISCOUNT_TYPES.PERCENTAGE]: 'secondary' as const,
      }[value as string]
      const label = Object.entries(VOUCHER_DISCOUNT_TYPES).find(([_, _value]) => _value === value)?.[0]
      return h(UBadge, { color, label, variant: 'subtle' })
    },
  },
  {
    accessorKey: 'discountValue',
    header: ({ column }) => getHeader(column, 'Discount value'),
    cell: ({ row }) =>
      row.getValue('discountType') === VOUCHER_DISCOUNT_TYPES.PERCENTAGE
        ? `${row.getValue('discountValue')}%`
        : formatCurrency(row.getValue('discountValue')),
  },
  {
    accessorKey: 'minOrderValue',
    header: ({ column }) => getHeader(column, 'Min order value'),
    cell: ({ row }) => formatCurrency(row.getValue('minOrderValue')),
  },
  {
    accessorKey: 'maxDiscount',
    header: ({ column }) => getHeader(column, 'Max discount'),
    cell: ({ row }) =>
      row.getValue('discountType') === VOUCHER_DISCOUNT_TYPES.PERCENTAGE
        ? formatCurrency(row.getValue('maxDiscount'))
        : '-',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const value = row.getValue('status')
      const color = {
        [VOUCHER_STATUSES.ACTIVE]: 'primary' as const,
        [VOUCHER_STATUSES.INACTIVE]: 'secondary' as const,
        [VOUCHER_STATUSES.EXPIRED]: 'warning' as const,
        [VOUCHER_STATUSES.REVOKED]: 'error' as const,
      }[value as string]
      const label = Object.entries(VOUCHER_STATUSES).find(([_, _value]) => _value === value)?.[0]
      return h(UBadge, { color, label, variant: 'subtle' })
    },
  },
  { accessorKey: 'usageLimit', header: ({ column }) => getHeader(column, 'Usage limit') },
  { accessorKey: 'usedCount', header: ({ column }) => getHeader(column, 'Usage count') },
  {
    accessorKey: 'startDate',
    header: ({ column }) => getHeader(column, 'Start date'),
    cell: ({ row }) => dayjs(row.getValue('startDate')).format(DATE_FORMAT),
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => getHeader(column, 'End date'),
    cell: ({ row }) => dayjs(row.getValue('endDate')).format(DATE_FORMAT),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Created at'),
    cell: ({ row }) => dayjs(row.getValue('createdAt')).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => getHeader(column, 'Updated at'),
    cell: ({ row }) => dayjs(row.getValue('updatedAt')).format(DATE_TIME_FORMAT),
  },
  {
    accessorKey: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: 'end',
          },
          items: getActionItems(row),
        },
        () =>
          h(UButton, {
            icon: 'lucide:ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
          }),
      )
    },
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right',
      },
    },
  },
]
const columnVisibility = ref<VisibilityState>({
  createdAt: false,
  updatedAt: false,
})

const search = ref('')
const searchDebounced = refDebounced(search)

const isDisableResetButton = computed(() => !(search.value || Object.keys(columnVisibility.value).length > 0))
const handleResetFilters = () => {
  search.value = ''
  columnVisibility.value = {}
}

const sorting = ref<SortingState>([
  {
    id: 'createdAt',
    desc: true,
  },
])
const page = ref(1)
const itemsPerPage = ref(10)
const sortColumn = computed(() => sorting.value?.[0].id)
const sortDirection = computed(() => (sorting.value?.[0].desc ? 'desc' : 'asc'))

const { data: cachedVoucher } = useNuxtData('categories')
const { data, status } = await useFetch(() => `/api/stores/${storeId.value}/vouchers`, {
  key: 'vouchers',
  lazy: !!cachedVoucher.value,
  default: () => cachedVoucher.value,
  query: {
    search: searchDebounced,
    page,
    limit: itemsPerPage,
    sort: sortColumn,
    order: sortDirection,
  },
  onResponseError({ response }) {
    toast.error(response._data?.statusMessage)
  },
})
const isFetching = computed(() => status.value === 'pending')

const rows = computed(() => data.value?.data as Voucher[])
const meta = computed(() => data.value?.meta)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <UInput v-model="search" leading-icon="lucide:search" placeholder="Search..." class="max-w-sm">
          <template v-if="search?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              icon="lucide:circle-x"
              aria-label="Clear input"
              @click="search = ''"
            />
          </template>
        </UInput>
        <div class="flex gap-1.5 items-center">
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  },
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton label="Columns" color="neutral" variant="outline" trailing-icon="lucide:chevron-down" />
          </UDropdownMenu>
          <UButton
            leading-icon="lucide:filter-x"
            color="neutral"
            :disabled="isDisableResetButton"
            label="Reset"
            @click="handleResetFilters"
          />
        </div>
      </div>
    </template>
    <UTable
      ref="table"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:sorting="sorting"
      :data="rows"
      :columns="columns"
      :loading="isFetching"
    />
    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>
          <USelect v-model.number="itemsPerPage" :items="ROWS_PER_PAGE_OPTIONS" class="w-20" />
        </div>
        <UPagination v-model:page="page" :items-per-page="itemsPerPage" :total="meta?.total" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
