import type { z } from 'zod'
import type schema from '~/schemas/store.schema'
import { LazyModalConfirm } from '#components'
import type { Store } from '~/types'

export const useActionStore = () => {
  const stores = useState<Store[]>('stores', () => [])
  const isFetchingStores = useState('isFetchingStores', () => false)
  const fetchStores = async () => {
    try {
      isFetchingStores.value = true
      const response = await $fetch('/api/stores')
      stores.value = response.data as any
    } catch (error) {
      console.log('[FETCH_STORES_ERROR]', error)
      push.error('Fetch stores error')
    } finally {
      isFetchingStores.value = false
    }
  }

  type Schema = z.infer<typeof schema>
  type CreateArgs = Schema
  const isCreateLoading = useState(() => false)
  const handleCreate = async (payload: CreateArgs) => {
    try {
      isCreateLoading.value = true
      const store = await $fetch('/api/stores', {
        method: 'POST',
        body: payload,
      })
      fetchStores()
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isCreateLoading.value = false
    }
  }

  type UpdateArgs = {
    storeId: string
    payload: Schema
  }
  const isUpdateLoading = useState(() => false)
  const handleUpdate = async ({ storeId, payload }: UpdateArgs) => {
    try {
      isUpdateLoading.value = true
      await $fetch(`/api/stores/${storeId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated successfully')
      fetchStores()
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isUpdateLoading.value = false
    }
  }

  const modal = useModal()
  const isDeleteLoading = useState(() => false)
  const handleDelete = (storeId: string) => {
    modal.open(LazyModalConfirm, {
      description: 'Are you sure you want to delete this item?',
      onConfirm: async () => {
        try {
          isDeleteLoading.value = true
          await $fetch(`/api/stores/${storeId}`, {
            method: 'DELETE',
          })
          push.success('Deleted successfully')
          fetchStores()
          await navigateTo('/')
        } catch (error: any) {
          console.log(error)
          push.error(error.statusMessage || 'Something went wrong')
        } finally {
          isDeleteLoading.value = false
        }
      },
    })
  }

  return {
    stores,
    isFetchingStores,
    fetchStores,

    isCreateLoading,
    handleCreate,
    isUpdateLoading,
    handleUpdate,
    isDeleteLoading,
    handleDelete,
  }
}
