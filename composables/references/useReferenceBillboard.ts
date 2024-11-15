export const useReferenceBillboard = () => {
  type Data = {
    name: string
    id: string
  }
  const data = useState<Data[]>(() => [])
  const isFetching = useState(() => false)
  const handleFetchData = async (storeId: string) => {
    try {
      isFetching.value = true
      const res = await $fetch(`/api/stores/${storeId}/reference/billboards`)
      data.value = res.data
    } catch (error) {
      console.log(error)
    } finally {
      isFetching.value = false
    }
  }

  return {
    data,
    isFetching,
    handleFetchData,
  }
}
