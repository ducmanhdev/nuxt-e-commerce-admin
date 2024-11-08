<script setup lang="ts">
import { DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '~/constants'

useHead({
  title: 'Billboards',
})

const dayjs = useDayjs()
const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const {
  selectedRows,
  handleSelectRow,
  selectedColumns,
  columns,
  search,
  isDisableResetButton,
  handleResetFilters,
  sort,
  page,
  pageCount,
  isFetchBillboardsLoading,
  billboards,
  pageTotal,
} = await useTableBillboard(storeId)

const { handleShow } = useModalBillboard()
const { handleDeleteBillboard, isDeleteBillboardLoading } = useBillboard()
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">
          Billboards
        </h2>
        <UButton
          leading-icon="heroicons:plus"
          label="Create"
          @click="handleShow({ storeId })"
        />
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <UInput v-model="search" leading-icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
            <div class="flex gap-1.5 items-center">
              <USelectMenu
                v-model="selectedColumns"
                :options="columns"
                multiple
              >
                <UButton
                  leading-icon="heroicons:view-columns"
                  color="gray"
                  label="Columns"
                />
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
          :rows="billboards"
          :columns="columns"
          :loading="isFetchBillboardsLoading"
          sort-mode="manual"
          @select="handleSelectRow"
        >
          <template #imageUrl-data="{ row }">
            <CldImage
              v-if="row.imageUrl"
              :src="row.imageUrl"
              :alt="row.imageUrl"
              width="100"
              height="100"
            />
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
                  @click.stop="handleShow({
                    storeId,
                    ...row,
                  })"
                />
              </UTooltip>
              <UTooltip text="Delete">
                <UButton
                  color="red"
                  leading-icon="heroicons:trash"
                  :loading="isDeleteBillboardLoading"
                  @click.stop="handleDeleteBillboard({
                    storeId,
                    billboardId: row.id,
                  })"
                />
              </UTooltip>
            </div>
          </template>
        </UTable>
        <template #footer>
          <div class="flex items-center justify-end gap-4">
            <div class="flex items-center gap-1.5">
              <span class="text-sm leading-5">Rows per page:</span>
              <USelect
                v-model.number="pageCount"
                :options="ROWS_PER_PAGE_OPTIONS"
              />
            </div>
            <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />
          </div>
        </template>
      </UCard>
    </UContainer>

    <Teleport to="body">
      <LazyModalBillboard />
    </Teleport>
  </section>
</template>
