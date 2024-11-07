import { refDebounced } from '@vueuse/core'
import type { Billboard } from '~/types'

export const useTableBillboard = (storeId: ComputedRef<string>) => {
  const columns = [
    { key: 'label', label: 'Label', sortable: true },
    { key: 'imageUrl', label: 'Image' },
    { key: 'createdAt', label: 'Created at', sortable: true },
    { key: 'updatedAt', label: 'Updated at', sortable: true },
    { key: 'actions', label: 'Actions', class: 'text-end', disabled: true },
  ]
  const selectedRows = ref<Billboard[]>([])
  const selectedColumns = ref(columns)
  const columnsTable = computed(() => columns.filter(column => selectedColumns.value.includes(column)))

  const search = ref('')
  const searchDebounced = refDebounced(search, 300)

  const isDisableResetButton = computed(() => !(search.value || selectedColumns.value.length !== columns.length))
  const handleResetFilters = () => {
    search.value = ''
    selectedColumns.value = columns
  }

    type Sort = {
      column: string
      direction: 'asc' | 'desc'
    }
    const sort = ref<Sort | undefined>(undefined)
    const page = ref(1)
    const pageCount = ref(10)
    const sortColumn = computed(() => sort.value?.column)
    const sortDirection = computed(() => sort.value?.direction)

    const {
      data,
      status,
    } = useFetch(() => `/api/stores/${storeId.value}/billboards`, {
      key: 'billboards',
      default: () => ({
        billboards: [],
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

    const isFetchBillboardsLoading = computed(() => status.value === 'pending')
    const billboards = computed(() => data.value.billboards)
    const meta = computed(() => data.value.meta)
    const pageTotal = computed(() => meta.value?.totalPages || 1)
    const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
    const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

    return {
      columns,
      selectedRows,
      selectedColumns,
      columnsTable,
      search,
      isDisableResetButton,
      handleResetFilters,
      sort,
      page,
      pageCount,
      isFetchBillboardsLoading,
      billboards,
      meta,
      pageTotal,
      pageFrom,
      pageTo,
    }
}
