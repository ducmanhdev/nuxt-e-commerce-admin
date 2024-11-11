import type { z } from 'zod'
import type schema from '~/schemas/size.schema'

export const useSize = () => {
  type Schema = z.infer<typeof schema>

  type CreateArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateLoading = ref(false)
  const handleCreate = async ({ storeId, payload }: CreateArgs) => {
    try {
      isCreateLoading.value = true
      await $fetch(`/api/stores/${storeId}/sizes`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created successfully')
      await refreshNuxtData('sizes')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isCreateLoading.value = false
    }
  }

  type UpdateArgs = {
    storeId: string
    sizeId: string
    payload: Schema
  }
  const isUpdateLoading = ref(false)
  const handleUpdate = async ({ storeId, sizeId, payload }: UpdateArgs) => {
    try {
      isUpdateLoading.value = true
      await $fetch(`/api/stores/${storeId}/sizes/${sizeId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated successfully')
      await refreshNuxtData('sizes')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isUpdateLoading.value = false
    }
  }

  type DeleteArgs = {
    storeId: string
    sizeId: string
  }
  const { handleShow: handleShowConfirm } = useModalConfirm()
  const isDeleteLoading = ref(false)
  const handleDelete = ({ storeId, sizeId }: DeleteArgs) => handleShowConfirm({
    message: 'Are you absolutely to delete this item?',
    callbackFn: async () => {
      try {
        isDeleteLoading.value = true
        await $fetch(`/api/stores/${storeId}/sizes/${sizeId}`, {
          method: 'DELETE',
        })
        push.success('Deleted successfully')
        await refreshNuxtData('sizes')
      }
      catch (error: any) {
        console.log(error)
        push.error(error.statusMessage || 'Something went wrong')
      }
      finally {
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
