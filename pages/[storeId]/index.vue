<script setup lang="ts">
useHead({
  title: 'Overview',
})

const route = useRoute();
const storeId = computed(() => route.params.storeId);

const {data: store} = await useFetch(() => `/api/stores/${storeId.value}`, {
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
    push.error(error.statusMessage || 'Something went wrong');
  } finally {
    isDeleteStoreLoading.value = false;
  }
}
</script>

<template>
  <section class="py-4">
    <UContainer>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Overview</h2>
        <UButton
            trailing-icon="ion:trash-outline"
            label="Delete"
            color="red"
            :loading="isDeleteStoreLoading"
            @click="handleDeleteStore"
        />
      </div>
    </UContainer>
  </section>
</template>