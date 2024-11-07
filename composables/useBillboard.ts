import type { z } from 'zod'
import type schema from '~/schemas/billboard.schema'

export const useBillboard = () => {
  type Schema = z.infer<typeof schema>

  type CreateBillboardArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateBillboardLoading = useState(() => false)
  const handleCreateBillboard = async ({ storeId, payload }: CreateBillboardArgs) => {
    try {
      isCreateBillboardLoading.value = true
      await $fetch(`/api/stores/${storeId}/billboards`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created billboard successfully')
      await refreshNuxtData('billboards')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isCreateBillboardLoading.value = false
    }
  }

  type UpdateBillboardArgs = {
    storeId: string
    billboardId: string
    payload: Schema
  }
  const isUpdateBillboardLoading = useState(() => false)
  const handleUpdateBillboard = async ({ storeId, billboardId, payload }: UpdateBillboardArgs) => {
    try {
      isUpdateBillboardLoading.value = true
      await $fetch(`/api/stores/${storeId}/billboards/${billboardId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated billboard successfully')
      await refreshNuxtData('billboards')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isUpdateBillboardLoading.value = false
    }
  }

  type DeleteBillboardArgs = {
    storeId: string
    billboardId: string
  }
  const { handleShow: handleShowConfirm } = useModalConfirm()
  const isDeleteBillboardLoading = useState(() => false)
  const handleDeleteBillboard = ({ storeId, billboardId }: DeleteBillboardArgs) => handleShowConfirm({
    message: 'Are you absolutely to delete this billboard?',
    callbackFn: async () => {
      try {
        isDeleteBillboardLoading.value = true
        await $fetch(`/api/stores/${storeId}/billboards/${billboardId}`, {
          method: 'DELETE',
        })
        push.success('Deleted billboard successfully')
        await refreshNuxtData('billboards')
      }
      catch (error: any) {
        console.log(error)
        push.error(error.statusMessage || 'Something went wrong')
      }
      finally {
        isDeleteBillboardLoading.value = false
      }
    },
  })

  return {
    isCreateBillboardLoading,
    handleCreateBillboard,
    isUpdateBillboardLoading,
    handleUpdateBillboard,
    isDeleteBillboardLoading,
    handleDeleteBillboard,
  }
}
