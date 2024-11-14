<script setup lang="ts">
import { DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'

type Reference = {
  label: string
  value: string
}
type References = {
  categoryReference: Reference[]
  sizeReference: Reference[]
  colorReference: Reference[]
}
type Props = {
  storeId: string
  references: References
}
const props = defineProps<Props>()
const dayjs = useDayjs()
const storeId = toRef(props, 'storeId')

const {
  selectedRows,
  handleSelectRow,
  ORIGIN_COLUMNS,
  selectedColumns,
  columns,
  search,
  handleClearSearch,
  isShowClearSearchButton,
  isDisableResetButton,
  handleResetFilters,
  sort,
  page,
  pageCount,
  isFetchDataLoading,
  rows,
  pageTotal,
} = await useTableProduct(storeId)

const { handleShow: handleShowModalEdit } = useModalProduct()
const { handleDelete } = useProduct()
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
      :loading="isFetchDataLoading"
      sort-mode="manual"
      @select="handleSelectRow"
    >
      <template #price-data="{ row }">
        {{ formatMoney(row.price) }}
      </template>
      <template #categoryId-data="{ row }">
        {{ references.categoryReference.find((reference) => reference.value === row.categoryId)?.label }}
      </template>
      <template #sizeId-data="{ row }">
        {{ references.sizeReference.find((reference) => reference.value === row.sizeId)?.label }}
      </template>
      <template #colorId-data="{ row }">
        {{ references.colorReference.find((reference) => reference.value === row.colorId)?.label }}
      </template>
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
                  productId: row.id,
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
