import { refDebounced } from '@vueuse/core'
import type { Billboard } from '~/types'

export const useTableBillboard = async (storeId: Ref<string>) => {
  const selectedRows = ref<Billboard[]>([])
  const handleSelectRow = (row: Billboard) => {
    const index = selectedRows.value.findIndex(item => item.id === row.id)
    if (index === -1) {
      selectedRows.value = [...selectedRows.value, row]
      return
    }
    selectedRows.value = selectedRows.value.filter(item => item.id !== row.id)
  }

  const ORIGIN_COLUMNS = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'imageUrl', label: 'Image' },
    { key: 'createdAt', label: 'Created at', sortable: true },
    { key: 'updatedAt', label: 'Updated at', sortable: true },
    { key: 'actions', label: 'Actions', class: 'text-end', disabled: true },
  ]
  const selectedColumns = ref(ORIGIN_COLUMNS)
  const columns = computed(() => ORIGIN_COLUMNS.filter(COLUMNS => selectedColumns.value.includes(COLUMNS)))

  const search = ref('')
  const searchDebounced = refDebounced(search, 300)
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

  const {
    data,
    status,
  } = await useFetch(() => `/api/stores/${storeId.value}/billboards`, {
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

  const isFetchDataLoading = computed(() => status.value === 'pending')
  const rows = computed(() => data.value.data)
  const meta = computed(() => data.value.meta)
  const pageTotal = computed(() => meta.value?.totalPages || 1)

  return {
    selectedRows,
    handleSelectRow,
    ORIGIN_COLUMNS: readonly(ORIGIN_COLUMNS),
    selectedColumns,
    columns,
    search,
    isShowClearSearchButton,
    handleClearSearch,
    isDisableResetButton,
    handleResetFilters,
    sort,
    page,
    pageCount,
    isFetchDataLoading,
    rows,
    meta,
    pageTotal,
  }
}
