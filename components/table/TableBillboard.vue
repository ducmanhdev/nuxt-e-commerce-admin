<script setup lang="ts">
import { DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'
import type { Billboard } from '~/types'
import { refDebounced } from '@vueuse/core'

type Props = {
  storeId: string
}
const props = defineProps<Props>()
const dayjs = useDayjs()
const storeId = toRef(props, 'storeId')

const selectedRows = ref<Billboard[]>([])
const handleSelectRow = (row: Billboard) => {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value = [...selectedRows.value, row]
    return
  }
  selectedRows.value = selectedRows.value.filter((item) => item.id !== row.id)
}

const ORIGIN_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'imageUrl', label: 'Image' },
  { key: 'createdAt', label: 'Created at', sortable: true },
  { key: 'updatedAt', label: 'Updated at', sortable: true },
  { key: 'actions', label: 'Actions', class: 'text-end', disabled: true },
]
const selectedColumns = ref(ORIGIN_COLUMNS)
const columns = computed(() => ORIGIN_COLUMNS.filter((COLUMNS) => selectedColumns.value.includes(COLUMNS)))

const search = ref('')
const searchDebounced = refDebounced(search)
const isShowClearSearchButton = computed(() => search.value !== '')
const handleClearSearch = () => {
  search.value = ''
}

const isDisableResetButton = computed(() => !(search.value || selectedColumns.value.length !== ORIGIN_COLUMNS.length))
const handleResetFilters = () => {
  search.value = ''
  selectedColumns.value = ORIGIN_COLUMNS
}

type Sort = {
  column: string
  direction: 'asc' | 'desc'
}
const sort = ref<Sort | undefined>({
  column: 'createdAt',
  direction: 'desc',
})
const page = ref(1)
const pageCount = ref(10)
const sortColumn = computed(() => sort.value?.column)
const sortDirection = computed(() => sort.value?.direction)

const { data, status } = await useFetch(() => `/api/stores/${storeId.value}/billboards`, {
  key: 'billboards',
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
const rows = computed(() => data.value.data)
const meta = computed(() => data.value.meta)
const pageTotal = computed(() => meta.value?.totalPages || 1)

const { handleShow: handleShowModalEdit } = useModalBillboard()
const { handleDelete } = useActionBillboard()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <UInput
          v-model="search"
          leading-icon="heroicons:magnifying-glass-20-solid"
          placeholder="Search..."
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="isShowClearSearchButton"
              color="gray"
              variant="link"
              icon="heroicons:x-mark-20-solid"
              :padded="false"
              @click="handleClearSearch"
            />
          </template>
        </UInput>
        <div class="flex gap-1.5 items-center">
          <USelectMenu v-model="selectedColumns" :options="ORIGIN_COLUMNS" multiple>
            <UButton leading-icon="heroicons:view-columns" color="gray" label="Columns" />
          </USelectMenu>
          <UButton
            leading-icon="i-heroicons-funnel"
            color="gray"
            :disabled="isDisableResetButton"
            label="Reset"
            @click="handleResetFilters"
          />
        </div>
      </div>
    </template>
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="rows"
      :columns="columns"
      :loading="isFetching"
      sort-mode="manual"
      @select="handleSelectRow"
    >
      <template #createdAt-data="{ row }">
        {{ dayjs(row.createdAt).format(DATE_TIME_FORMAT) }}
      </template>
      <template #updatedAt-data="{ row }">
        {{ dayjs(row.updatedAt).format(DATE_TIME_FORMAT) }}
      </template>
      <template #actions-data="{ row }">
        <div class="text-right space-x-2">
          <UTooltip text="Edit">
            <UButton
              leading-icon="heroicons:pencil-square"
              @click.stop="
                handleShowModalEdit({
                  storeId,
                  ...row,
                })
              "
            />
          </UTooltip>
          <UTooltip text="Delete">
            <UButton
              color="red"
              leading-icon="heroicons:trash"
              @click.stop="
                handleDelete({
                  storeId,
                  billboardId: row.id,
                })
              "
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>
          <USelect v-model.number="pageCount" :options="ROWS_PER_PAGE_OPTIONS" />
        </div>
        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
