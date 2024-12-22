<script setup lang="ts">
import { COMMON_STATUSES, DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'
import { upperFirst } from 'scule'
import type { Product } from '~/types'
import { refDebounced } from '@vueuse/core'
import type { TableColumn } from '#ui/components/Table.vue'
import type { Column, Row, SortingState, VisibilityState } from '@tanstack/vue-table'
import { LazyModalConfirm, LazyModalProduct } from '#components'

const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Props = {
  storeId: string
}
const props = defineProps<Props>()
const dayjs = useDayjs()
const storeId = toRef(props, 'storeId')

const table = useTemplateRef('table')
const rowSelection = ref({})

const toast = useCustomToast()
const modal = useModal()
const handleDelete = ({ storeId, id }: { storeId: string; id: string }) => {
  modal.open(LazyModalConfirm, {
    message: 'Are you absolutely to delete this item?',
    onConfirm: async () => {
      try {
        await $fetch(`/api/stores/${storeId}/products/${id}`, {
          method: 'DELETE',
        })
        toast.success('Deleted successfully')
        refreshNuxtData('products')
      } catch (error) {
        console.error(error)
        toast.error(error)
      }
    },
  })
}
const getActionItems = (row: Row<Product>) => {
  return [
    [
      {
        label: 'Edit',
        icon: 'heroicons:pencil-square',
        onSelect: () =>
          modal.open(LazyModalProduct, {
            storeId: row.original.storeId,
            productId: row.original.id,
            initialValues: { ...row.original },
          }),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'heroicons:trash',
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
const getHeader = (column: Column<Product>, label: string) => {
  const isEnableSort = column.getCanSort()
  if (!isEnableSort) return label

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
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          },
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
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
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-[var(--ui-bg-elevated)]',
      }),
  )
}
const columns: TableColumn<Product>[] = [
  {
    id: 'select',
    enableHiding: false,
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value),
        ariaLabel: 'Select row',
      }),
  },
  { accessorKey: 'name', header: ({ column }) => getHeader(column, 'Name') },
  { accessorKey: 'description', header: ({ column }) => getHeader(column, 'Description') },
  {
    accessorKey: 'status',
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const value = row.getValue('status')
      const color = {
        [COMMON_STATUSES.VISIBLE]: 'primary' as const,
        [COMMON_STATUSES.ARCHIVED]: 'secondary' as const,
        [COMMON_STATUSES.HIDDEN]: 'error' as const,
      }[value as string]
      const label = Object.entries(COMMON_STATUSES).find(([_, _value]) => _value === value)?.[0]
      return h(UBadge, { color, label, variant: 'subtle' })
    },
  },
  { accessorKey: 'category.name', header: ({ column }) => getHeader(column, 'Category') },
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
            icon: 'ion:ellipsis-vertical',
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
const columnVisibility = ref<VisibilityState>({})

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

const { data: cachedProducts } = useNuxtData('products')
const { data, status } = await useFetch(() => `/api/stores/${storeId.value}/products`, {
  key: 'products',
  lazy: !!cachedProducts.value,
  default: () => cachedProducts.value,
  query: {
    search: searchDebounced,
    page: page,
    limit: itemsPerPage,
    sort: sortColumn,
    order: sortDirection,
  },
  onResponseError({ response }) {
    toast.error(response._data?.statusMessage)
  },
})
const isFetching = computed(() => status.value === 'pending')

const rows = computed(() => data.value?.data as Product[])
const meta = computed(() => data.value?.meta)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <UInput
          v-model="search"
          leading-icon="heroicons:magnifying-glass-20-solid"
          placeholder="Search..."
          class="max-w-sm"
        >
          <template v-if="search?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              icon="heroicons:x-mark-20-solid"
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
            <UButton label="Columns" color="neutral" variant="outline" trailing-icon="ion:chevron-down" />
          </UDropdownMenu>
          <UButton
            leading-icon="i-heroicons-funnel"
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
