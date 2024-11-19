import type { z } from 'zod'
import type schema from '~/schemas/billboard.schema'

export const useActionBillboard = () => {
  type Schema = z.infer<typeof schema>

  type CreateArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateLoading = ref(false)
  const handleCreate = async ({ storeId, payload }: CreateArgs) => {
    try {
      isCreateLoading.value = true
      await $fetch(`/api/stores/${storeId}/billboards`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created successfully')
      await refreshNuxtData('billboards')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isCreateLoading.value = false
    }
  }

  type UpdateArgs = {
    storeId: string
    billboardId: string
    payload: Schema
  }
  const isUpdateLoading = ref(false)
  const handleUpdate = async ({ storeId, billboardId, payload }: UpdateArgs) => {
    try {
      isUpdateLoading.value = true
      await $fetch(`/api/stores/${storeId}/billboards/${billboardId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated successfully')
      await refreshNuxtData('billboards')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isUpdateLoading.value = false
    }
  }

  type DeleteArgs = {
    storeId: string
    billboardId: string
  }
  const { showModal } = useModalConfirm()
  const isDeleteLoading = ref(false)
  const handleDelete = ({ storeId, billboardId }: DeleteArgs) =>
    showModal({
      message: 'Are you absolutely to delete this item?',
      onConfirm: async () => {
        try {
          isDeleteLoading.value = true
          await $fetch(`/api/stores/${storeId}/billboards/${billboardId}`, {
            method: 'DELETE',
          })
          push.success('Deleted successfully')
          await refreshNuxtData('billboards')
        } catch (error: any) {
          console.log(error)
          push.error(error.statusMessage || 'Something went wrong')
        } finally {
          isDeleteLoading.value = false
        }
      },
    })

  return {
    isCreateLoading,
    handleCreate,
    isUpdateLoading,
    handleUpdate,
    isDeleteLoading,
    handleDelete,
  }
}
