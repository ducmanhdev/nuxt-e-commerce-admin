<script setup lang="ts">
type Props = {
  multiple?: boolean
  allowedFormats?: string[]
  maxFileSize?: number
}

const { multiple = false, allowedFormats = ['png', 'jpeg', 'jpg'], maxFileSize = 5500000 } = defineProps<Props>()

const bytesToMB = (bytes: number) => {
  if (bytes < 0) {
    throw new Error('Input must be a non-negative number.')
  }
  const MB = bytes / (1024 * 1024)
  return MB.toFixed(2)
}
const uploadDescription = computed(
  () => allowedFormats.join(', ').toUpperCase() + ' up to ' + bytesToMB(maxFileSize) + 'MB',
)

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
        multiple: multiple,
        sources: ['local', 'url'],
        clientAllowedFormats: allowedFormats,
        autoMinimize: true,
        maxFileSize: maxFileSize,
      }"
      @success="onSuccess"
      @error="onError"
      @result="onResult"
    >
      <UButton
        class="flex flex-col items-center justify-center space-y-2 h-64"
        variant="outline"
        block
        :disabled="isLoading"
        @click="open"
      >
        <UIcon :name="isLoading ? 'heroicons:loading' : 'heroicons:arrow-up-tray'" size="28" />
        <span class="text-gray-500">Click to upload {{ multiple ? 'images' : 'an image' }} here</span>
        <span class="text-xs text-gray-400">{{ uploadDescription }}</span>
      </UButton>
    </CldUploadWidget>
  </div>
</template>

<style scoped></style>
