<script setup lang="ts">
import type {Store} from "~/types";

useHead({
  title: 'Overview',
})

const toast = useCustomToast();
const route = useRoute();
const {storeId} = route.params;

const {data: store} = await useFetch<Store>(() => `/api/stores/${storeId}`, {
  key: 'store'
});

watchEffect(() => {
  if (!store.value) {
    navigateTo('/');
  }
})

const isDeleteStoreLoading = ref(false);
const handleDeleteStore = async () => {
  try {
    isDeleteStoreLoading.value = true;
    await $fetch(`/api/stores/${store.value?.id}`, {
      method: 'DELETE',
    });
    navigateTo('/');
  } catch (error: any) {
    console.log(error);
    toast.error(error.statusMessage || 'Something went wrong');
  } finally {
    isDeleteStoreLoading.value = false;
  }
}
</script>

<template>
  <div class="py-4">
    <UContainer>
      <div class="flex items-center justify-between">
        <div>{{ store?.name }}</div>
        <UButton
            trailing-icon="ion:trash-outline"
            label="Delete"
            color="red"
            :loading="isDeleteStoreLoading"
            @click="handleDeleteStore"
        />
      </div>
    </UContainer>
  </div>
</template>