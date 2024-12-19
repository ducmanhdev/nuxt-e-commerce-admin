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
        const toast = useCustomToast()
        console.log(error)
        toast.error(error)
      } finally {
        this.isFetchingStores = false
      }
    },
  },
})
