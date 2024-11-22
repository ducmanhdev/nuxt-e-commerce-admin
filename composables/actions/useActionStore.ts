import type { z } from 'zod'
import type schema from '~/schemas/store.schema'
import { LazyModalConfirm } from '#components'

export const useActionStore = () => {
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
      await refreshNuxtData('stores')
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
      await refreshNuxtData('stores')
      await refreshNuxtData(`store-${storeId}`)
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
          await refreshNuxtData('stores')
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
    isCreateLoading,
    handleCreate,
    isUpdateLoading,
    handleUpdate,
    isDeleteLoading,
    handleDelete,
  }
}
