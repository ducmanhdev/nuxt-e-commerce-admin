import type { z } from 'zod'
import type schema from '~/schemas/color.schema'

export const useColor = () => {
  type Schema = z.infer<typeof schema>

  type CreateArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateLoading = ref(false)
  const handleCreate = async ({ storeId, payload }: CreateArgs) => {
    try {
      isCreateLoading.value = true
      await $fetch(`/api/stores/${storeId}/colors`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created successfully')
      await refreshNuxtData('colors')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isCreateLoading.value = false
    }
  }

  type UpdateArgs = {
    storeId: string
    colorId: string
    payload: Schema
  }
  const isUpdateLoading = ref(false)
  const handleUpdate = async ({ storeId, colorId, payload }: UpdateArgs) => {
    try {
      isUpdateLoading.value = true
      await $fetch(`/api/stores/${storeId}/colors/${colorId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated successfully')
      await refreshNuxtData('colors')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isUpdateLoading.value = false
    }
  }

  type DeleteArgs = {
    storeId: string
    colorId: string
  }
  const { handleShow: handleShowConfirm } = useModalConfirm()
  const isDeleteLoading = ref(false)
  const handleDelete = ({ storeId, colorId }: DeleteArgs) =>
    handleShowConfirm({
      message: 'Are you absolutely to delete this item?',
      callbackFn: async () => {
        try {
          isDeleteLoading.value = true
          await $fetch(`/api/stores/${storeId}/colors/${colorId}`, {
            method: 'DELETE',
          })
          push.success('Deleted successfully')
          await refreshNuxtData('colors')
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
