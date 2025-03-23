<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue'
import type { Column, Row, SortingState, VisibilityState } from '@tanstack/vue-table'
import type { Category } from '~/types'
import { LazyModalCategory, LazyModalConfirm } from '#components'
import { refDebounced } from '@vueuse/core'
import { upperFirst } from 'scule'
import { DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'

const props = defineProps<Props>()
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const NuxtImg = resolveComponent('NuxtImg')

interface Props {
  storeId: string
}
const dayjs = useDayjs()
const storeId = toRef(props, 'storeId')
const table = useTemplateRef('table')
const toast = useCustomToast()
const overlay = useOverlay()
const modalConfirm = overlay.create(LazyModalConfirm)
const modalCategory = overlay.create(LazyModalCategory)
const handleDelete = ({ storeId, id }: { storeId: string, id: string }) => {
  modalConfirm.open({
    props: {
      message: 'Are you absolutely to delete this item?',
      onConfirm: async () => {
        try {
          await $fetch(`/api/stores/${storeId}/categories/${id}`, {
            method: 'DELETE',
          })
          toast.success('Deleted successfully')
          refreshNuxtData('categories')
        }
        catch (error) {
          console.error(error)
          toast.error(error)
        }
      },
    },
  })
}
const getActionItems = (row: Row<Category>) => {
  return [
    [
      {
        label: 'Edit',
        icon: 'lucide:pencil-line',
        onSelect: () =>
          modalCategory.open({
            props: {
              storeId: row.original.storeId,
              categoryId: row.original.id,
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
const getHeader = (column: Column<Category>, label: string) => {
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
const columns: TableColumn<Category>[] = [
  { accessorKey: 'name', header: ({ column }) => getHeader(column, 'Name') },
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => {
      return h(NuxtImg, {
        src: row.getValue('imageUrl'),
        placeholder: 'blur',
        width: 80,
        height: 80,
        quality: 80,
        fit: 'contain',
      })
    },
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

const { data: cachedCategories } = useNuxtData('categories')
const { data, status } = await useFetch(() => `/api/stores/${storeId.value}/categories`, {
  key: 'categories',
  lazy: !!cachedCategories.value,
  default: () => cachedCategories.value,
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
const rows = computed(() => data.value?.data as Category[])
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
