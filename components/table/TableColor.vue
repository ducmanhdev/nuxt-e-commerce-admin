<script setup lang="ts">
import { DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'
import { upperFirst } from 'scule'
import type { Color } from '~/types'
import { refDebounced } from '@vueuse/core'
import type { TableColumn, TableData } from '@nuxt/ui'
import type { Row, Column, SortingState, VisibilityState } from '@tanstack/vue-table'

const UCheckbox = resolveComponent('UCheckbox')
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
const getActionItems = (row: Row<Color>) => {
  return [
    [
      {
        label: 'Edit',
        icon: 'heroicons:pencil-square',
        onSelect: () => handleShowModalEdit({ ...row.original }),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'heroicons:trash',
        color: 'error',
        onSelect: () => handleDelete({ ...row.original }),
      },
    ],
  ]
}
const getHeader = (column: Column<Color>, label: string) => {
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
const columns: TableColumn<Color>[] = [
  {
    id: 'select',
    enableHiding: false,
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
  },
  { accessorKey: 'name', header: ({ column }) => getHeader(column, 'Name') },
  { accessorKey: 'value', header: ({ column }) => getHeader(column, 'Value') },
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
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
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
              class: 'ml-auto',
            }),
        ),
      )
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
    desc: false,
  },
])
const page = ref(1)
const pageCount = ref(10)
const sortColumn = computed(() => sorting.value?.[0].id)
const sortDirection = computed(() => (sorting.value?.[0].desc ? 'desc' : 'asc'))

const { data, status } = await useFetch(() => `/api/stores/${storeId.value}/colors`, {
  key: 'colors',
  default: () => ({
    data: [],
    meta: undefined,
  }),
  query: {
    search: searchDebounced,
    page: page,
    limit: pageCount,
    sort: sortColumn,
    order: sortDirection,
  },
})
const isFetching = computed(() => status.value === 'pending')

const rows = computed(() => data.value?.data as Color[])
const meta = computed(() => data.value.meta)
const pageTotal = computed(() => meta.value?.totalPages || 1)

const { handleShow: handleShowModalEdit } = useModalColor()
const { handleDelete } = useActionColor()
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
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
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
          <USelect v-model.number="pageCount" :items="ROWS_PER_PAGE_OPTIONS" class="w-20" />
        </div>
        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
