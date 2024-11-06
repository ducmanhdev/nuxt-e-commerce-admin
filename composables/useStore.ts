import type { z } from 'zod'
import type schema from '~/schemas/store.schema'

export const useStore = () => {
  type Schema = z.infer<typeof schema>

  type CreateStorePayload = Schema
  const isCreateStoreLoading = useState(() => false)
  const handleCreateStore = async (payload: CreateStorePayload) => {
    try {
      isCreateStoreLoading.value = true
      const store = await $fetch('/api/stores', {
        method: 'POST',
        body: payload,
      })
      await refreshNuxtData('stores')
      await navigateTo(`/${store.id}`)
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isCreateStoreLoading.value = false
    }
  }

  type UpdateStorePayload = {
    storeId: string
    payload: Schema
  }
  const isUpdateStoreLoading = useState(() => false)
  const handleUpdateStore = async ({ storeId, payload }: UpdateStorePayload) => {
    try {
      isUpdateStoreLoading.value = true
      await $fetch(`/api/stores/${storeId}`, {
        method: 'PATCH',
        body: payload,
      })
      await refreshNuxtData('stores')
      await refreshNuxtData('store')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isUpdateStoreLoading.value = false
    }
  }

  const isDeleteStoreLoading = useState(() => false)
  const handleDeleteStore = async (storeId: string) => {
    try {
      isDeleteStoreLoading.value = true
      await $fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      })
      await navigateTo('/')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isDeleteStoreLoading.value = false
    }
  }

  return {
    isCreateStoreLoading,
    handleCreateStore,
    isUpdateStoreLoading,
    handleUpdateStore,
    isDeleteStoreLoading,
    handleDeleteStore,
  }
}
