import { defineStore } from 'pinia'
import type { Store } from '~/types'

export const useStoresStore = defineStore('stores', {
  state: () => ({
    stores: [] as Store[],
    isFetchingStores: false,
  }),
  actions: {
    async fetchStores() {
      try {
        this.isFetchingStores = true
        const response = await $fetch('/api/stores')
        this.stores = JSON.parse(JSON.stringify(response.data))
      } catch (error) {
        const toast = useCustomToast()
        console.error(error)
        toast.error(error)
      } finally {
        this.isFetchingStores = false
      }
    },
  },
})
