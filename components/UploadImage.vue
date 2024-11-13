<script setup lang="ts">
type Props = {
  multiple?: boolean
  uploadButtonLabel?: string
}
const { multiple = false, uploadButtonLabel = 'Upload images' } = defineProps<Props>()

const imageUrls = defineModel<string[]>({ default: () => [] })

const onSuccess = (result: any) => {
  if (result.event !== 'success') {
    return
  }
  imageUrls.value = [...(imageUrls.value || []), result.info.secure_url]
}
const onError = () => {}
const onResult = () => {}

const deleteImagesQueue = ref<string[]>([])
const handleTempDeleteImages = (urls: string[]) => {
  deleteImagesQueue.value.push(...urls)
  imageUrls.value = (imageUrls.value || []).filter((url) => !urls.includes(url))
}

const extractPublicId = (url: string) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^/.]+)(?:\.\w+)?$/)
  return match ? match[1] : null
}
const handleDeleteImages = async (urls: string[]) => {
  const publicIds = urls.map((url) => extractPublicId(url))
  try {
    $fetch('/api/cloudinary/delete-images', {
      method: 'DELETE',
      body: {
        publicIds,
      },
    })
  } catch (error: any) {
    console.log(error)
  }
}
onBeforeUnmount(() => {
  // handleDeleteImages(deleteImagesQueue.value)
})
</script>

<template>
  <div>
    <div
      v-if="imageUrls?.length"
      class="grid gap-2 mb-2"
      :class="{
        'grid-cols-4': multiple,
        'grid-cols-1': !multiple,
      }"
    >
      <div v-for="url in imageUrls" :key="url" class="relative">
        <UButton
          icon="heroicons:x-circle"
          color="gray"
          variant="link"
          class="absolute top-0 right-0"
          @click="handleTempDeleteImages([url])"
        />
        <CldImage :src="url" width="100%" height="100%" aspect-ratio="1" crop="fill" :alt="url" />
      </div>
    </div>
    <CldUploadWidget
      v-slot="{ open, isLoading }"
      signature-endpoint="/api/cloudinary/sign"
      :options="{
        multiple,
        sources: ['local', 'url'],
        clientAllowedFormats: ['png', 'jpeg', 'jpg'],
        autoMinimize: true,
      }"
      @success="onSuccess"
      @error="onError"
      @result="onResult"
    >
      <UButton
        type="button"
        block
        variant="outline"
        :label="uploadButtonLabel"
        leading-icon="heroicons:cloud-arrow-up"
        :loading="isLoading"
        @click="open"
      />
    </CldUploadWidget>
  </div>
</template>

<style scoped></style>
