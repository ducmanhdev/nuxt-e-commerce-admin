<script setup lang="ts">
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import { LazyModalConfirm, LazyModalStore } from '#components'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Colors,
)

useHead({
  title: 'Overview',
})

const route = useRoute()
const storeId = computed(() => route.params.storeId as string)

const { data } = await useFetch(() => `/api/stores/${storeId.value}`, {
  key: `store-${storeId.value}`,
})
const store = computed(() => data.value?.data)
watchEffect(() => {
  if (!store.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store not found',
      fatal: true,
    })
  }
})

const modal = useModal()
const storesStore = useStoresStore()
const handleShowEditModal = () => {
  modal.open(LazyModalStore, {
    storeId: store.value?.id,
    initialValues: {
      name: store.value?.name,
    },
  })
}

const toast = useCustomToast()
const isDeleteLoading = ref(false)
const handleDelete = () => {
  modal.open(LazyModalConfirm, {
    description: 'Are you sure you want to delete this item?',
    onConfirm: async () => {
      try {
        isDeleteLoading.value = true
        await $fetch(`/api/stores/${storeId.value}`, {
          method: 'DELETE',
        })
        toast.success('Deleted successfully')
        await storesStore.fetchStores()
        await navigateTo('/')
      } catch (error) {
        console.error(error)
        toast.error(error)
      } finally {
        isDeleteLoading.value = false
      }
    },
  })
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
}
const chartBarData = {
  labels: ['T-Shirt', 'Jeans', 'Sneakers', 'Handbag', 'Cap', 'T-Shirt', 'Jeans', 'Sneakers', 'Handbag', 'Cap'],
  datasets: [
    {
      label: 'Previous month',
      data: [120, 85, 300, 150, 90, 120, 85, 300, 150, 90],
      // backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'This month',
      data: [120, 85, 300, 150, 90, 120, 85, 300, 150, 90],
      // backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
}
const chartLineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Monthly Revenue ($)',
      data: [5000, 7000, 6000, 8000, 9000, 10000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Overview</h2>
      <div class="flex gap-2">
        <UButton leading-icon="heroicons:pencil-square" label="Edit" @click="handleShowEditModal" />
        <UButton
          leading-icon="heroicons:trash"
          label="Delete"
          color="error"
          :loading="isDeleteLoading"
          @click="handleDelete"
        />
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <UCard>
        <template #header> Title 1</template>
        <Line :data="chartLineData" :options="chartOptions" />
      </UCard>
      <UCard>
        <template #header> Title 2</template>
        <Line :data="chartLineData" :options="chartOptions" />
      </UCard>
      <UCard>
        <template #header> Title 3</template>
        <Line :data="chartLineData" :options="chartOptions" />
      </UCard>
      <UCard>
        <template #header> Title 4</template>
        <Line :data="chartLineData" :options="chartOptions" />
      </UCard>
      <UCard class="col-span-4">
        <template #header> Title 5</template>
        <Bar :data="chartBarData" :options="chartOptions" />
      </UCard>
    </div>
  </section>
</template>
