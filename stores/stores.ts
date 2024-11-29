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
        this.stores = response.data as any
      } catch (error) {
        console.log('[FETCH_STORES_ERROR]', error)
        const toast = useCustomToast()
        toast.error('Fetch stores error')
      } finally {
        this.isFetchingStores = false
      }
    },
  },
})
