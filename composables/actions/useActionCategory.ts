import type { z } from 'zod'
import type schema from '~/schemas/category.schema'
import { LazyModalConfirm } from '#components'

export const useActionCategory = () => {
  type Schema = z.infer<typeof schema>

  type CreateArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateLoading = ref(false)
  const handleCreate = async ({ storeId, payload }: CreateArgs) => {
    try {
      isCreateLoading.value = true
      await $fetch(`/api/stores/${storeId}/categories`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created successfully')
      await refreshNuxtData('categories')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isCreateLoading.value = false
    }
  }

  type UpdateArgs = {
    storeId: string
    categoryId: string
    payload: Schema
  }
  const isUpdateLoading = ref(false)
  const handleUpdate = async ({ storeId, categoryId, payload }: UpdateArgs) => {
    try {
      isUpdateLoading.value = true
      await $fetch(`/api/stores/${storeId}/categories/${categoryId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated successfully')
      await refreshNuxtData('categories')
    } catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    } finally {
      isUpdateLoading.value = false
    }
  }

  type DeleteArgs = {
    storeId: string
    id: string
  }
  const modal = useModal()
  const isDeleteLoading = ref(false)
  const handleDelete = ({ storeId, id }: DeleteArgs) => {
    modal.open(LazyModalConfirm, {
      message: 'Are you absolutely to delete this item?',
      onConfirm: async () => {
        try {
          isDeleteLoading.value = true
          await $fetch(`/api/stores/${storeId}/categories/${id}`, {
            method: 'DELETE',
          })
          push.success('Deleted successfully')
          await refreshNuxtData('categories')
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
