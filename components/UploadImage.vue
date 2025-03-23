<script setup lang="ts">
import { ACCEPTED_UPLOAD_IMAGE_MIME_TYPES, MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } from '~/constants'

interface Props {
  multiple?: boolean
  maxFileSize?: number
}
const { multiple = false, maxFileSize = MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } = defineProps<Props>()

const images = defineModel<(File | string)[]>({
  default: [],
})
const isContainsImages = computed(() => images.value.length > 0)

const uploadDescription = computed(
  () =>
    `${ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.map(mime => `.${mime.split('/')[1]}`)
      .join(', ')
      .toUpperCase()} up to ${bytesToMB(maxFileSize)} MB`,
)

const inputRef = useTemplateRef('input')
const handleUploadImage = () => {
  Array.from(inputRef.value?.files || []).forEach((file) => {
    if (!file.type.startsWith('image/')) {
      console.error(`${file.name} is not a valid image file.`)
      return
    }
    if (!ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.includes(file.type)) {
      console.error(`${file.name} is not acceptable.`)
      return
    }
    if (file.size > MBToBytes(maxFileSize)) {
      console.error(`${file.name} exceeds ${maxFileSize} MB.`)
      return
    }
    images.value = multiple ? [...images.value, file] : [file]
  })
}

const previewImages = ref<string[]>([])
watchEffect((onCleanup) => {
  previewImages.value = images.value.map((item) => {
    if (typeof item === 'string')
      return item
    const url = URL.createObjectURL(item)
    onCleanup(() => URL.revokeObjectURL(url))
    return url
  })
})

const handleDeleteImage = (index: number) => {
  images.value = images.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div
    class="p-2 grid gap-2 border border-dashed rounded hover:border-primary transition cursor-pointer"
    :class="{ 'min-h-56': !isContainsImages, 'grid-cols-3': multiple }"
    @click="inputRef?.click()"
  >
    <div v-if="!isContainsImages" class="space-y-2 col-span-full flex flex-col justify-center items-center">
      <UIcon name="lucide:upload" class="size-7" />
      <p class="text-gray-500">Click to upload {{ multiple ? 'images' : 'an image' }} here</p>
      <p class="text-xs text-gray-400">{{ uploadDescription }}</p>
    </div>
    <template v-else>
      <div v-for="(image, index) in previewImages" :key="image" class="relative aspect-square rounded overflow-hidden">
        <NuxtImg :src="image" fit="contain" class="absolute top-0 left-0 w-full h-full object-cover" />
        <UButton
          icon="lucide:circle-x"
          square
          color="error"
          variant="ghost"
          class="absolute top-0 right-0 z-2"
          :padded="false"
          @click.stop="handleDeleteImage(index)"
        />
      </div>
      <div
        v-if="multiple"
        class="relative aspect-square grid place-content-center bg-black/10 dark:bg-white/10 rounded overflow-hidden"
      >
        <UIcon name="lucide:plus" class="size-7" />
      </div>
    </template>

    <input
      ref="input"
      type="file"
      :multiple="multiple"
      :accept="ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.join(', ')"
      hidden
      @change="handleUploadImage"
    >
  </div>
</template>

<style scoped></style>
