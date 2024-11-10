import type { z } from 'zod'
import type schema from '~/schemas/category.schema'

export const useCategory = () => {
  type Schema = z.infer<typeof schema>

  type CreateCategoryArgs = {
    storeId: string
    payload: Schema
  }
  const isCreateCategoryLoading = ref(false)
  const handleCreateCategory = async ({ storeId, payload }: CreateCategoryArgs) => {
    try {
      isCreateCategoryLoading.value = true
      await $fetch(`/api/stores/${storeId}/categories`, {
        method: 'POST',
        body: payload,
      })
      push.success('Created category successfully')
      await refreshNuxtData('categories')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isCreateCategoryLoading.value = false
    }
  }

  type UpdateCategoryArgs = {
    storeId: string
    categoryId: string
    payload: Schema
  }
  const isUpdateCategoryLoading = ref(false)
  const handleUpdateCategory = async ({ storeId, categoryId, payload }: UpdateCategoryArgs) => {
    try {
      isUpdateCategoryLoading.value = true
      await $fetch(`/api/stores/${storeId}/categories/${categoryId}`, {
        method: 'PATCH',
        body: payload,
      })
      push.success('Updated category successfully')
      await refreshNuxtData('categories')
    }
    catch (error: any) {
      console.log(error)
      push.error(error.statusMessage || 'Something went wrong')
    }
    finally {
      isUpdateCategoryLoading.value = false
    }
  }

  type DeleteCategoryArgs = {
    storeId: string
    categoryId: string
  }
  const { handleShow: handleShowConfirm } = useModalConfirm()
  const isDeleteCategoryLoading = ref(false)
  const handleDeleteCategory = ({ storeId, categoryId }: DeleteCategoryArgs) => handleShowConfirm({
    message: 'Are you absolutely to delete this category?',
    callbackFn: async () => {
      try {
        isDeleteCategoryLoading.value = true
        await $fetch(`/api/stores/${storeId}/categories/${categoryId}`, {
          method: 'DELETE',
        })
        push.success('Deleted category successfully')
        await refreshNuxtData('categories')
      }
      catch (error: any) {
        console.log(error)
        push.error(error.statusMessage || 'Something went wrong')
      }
      finally {
        isDeleteCategoryLoading.value = false
      }
    },
  })

  return {
    isCreateCategoryLoading,
    handleCreateCategory,
    isUpdateCategoryLoading,
    handleUpdateCategory,
    isDeleteCategoryLoading,
    handleDeleteCategory,
  }
}
