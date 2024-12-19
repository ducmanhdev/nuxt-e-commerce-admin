<script setup lang="ts">
import { ACCEPTED_UPLOAD_IMAGE_MIME_TYPES, MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } from '~/constants'

type Props = {
  existing?: string[]
  multiple?: boolean
  maxFileSize?: number
}

const { existing = [], multiple = false, maxFileSize = MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } = defineProps<Props>()

type Emit = {
  (e: 'update:existing', images: string[]): void
  (e: 'update:deleted', images: string[]): void
  (e: 'update:new', images: File[]): void
}
const emit = defineEmits<Emit>()

const existingImages = ref<string[]>([...existing])
const deletedExistingImages = ref<string[]>([])
const newImages = ref<File[]>([])

const isContainsImages = computed(() => previewImages.value.length || existingImages.value.length)

const uploadDescription = computed(
  () =>
    `${ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.map((mime) => '.' + mime.split('/')[1])
      .join(', ')
      .toUpperCase()} up to ${maxFileSize} MB`,
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
    if (multiple) {
      newImages.value.push(file)
    } else {
      if (existingImages.value.length) {
        handleDeleteExistImage(existingImages.value[0])
      }
      newImages.value = [file]
    }
    emit('update:new', newImages.value)
  })
}

const previewImages = ref<string[]>([])

const cleanUpImages = () => {
  previewImages.value.forEach((image) => URL.revokeObjectURL(image))
}

watchEffect((onCleanup) => {
  previewImages.value = newImages.value.map((file) => URL.createObjectURL(file))
  onCleanup(cleanUpImages)
})

onBeforeUnmount(cleanUpImages)

const handleDeleteNewImage = (index: number) => {
  newImages.value.splice(index, 1)
  emit('update:new', newImages.value)
}

const handleDeleteExistImage = (imageSrc: string) => {
  deletedExistingImages.value.push(imageSrc)
  existingImages.value = existingImages.value.filter((image) => image !== imageSrc)
  emit('update:deleted', deletedExistingImages.value)
  emit('update:existing', existingImages.value)
}
</script>

<template>
  <div
    class="p-2 grid gap-2 border border-dashed rounded hover:border-primary transition cursor-pointer"
    :class="{
      'min-h-64': !isContainsImages,
      'grid-cols-3': multiple,
    }"
    @click="inputRef?.click()"
  >
    <div v-if="!isContainsImages" class="space-y-2 col-span-full flex flex-col justify-center items-center">
      <UIcon name="heroicons:arrow-up-tray" class="size-7" />
      <p class="text-gray-500">Click to upload {{ multiple ? 'images' : 'an image' }} here</p>
      <p class="text-xs text-gray-400">{{ uploadDescription }}</p>
    </div>
    <template v-else>
      <div v-for="image in existingImages" :key="image" class="relative aspect-square rounded overflow-hidden">
        <img :src="image" alt="" class="absolute top-0 left-0 w-full h-full object-cover" />
        <UButton
          icon="heroicons:x-circle"
          square
          color="error"
          variant="ghost"
          class="absolute top-0 right-0 z-2"
          size="sm"
          @click.stop="handleDeleteExistImage(image)"
        />
      </div>
      <div v-for="(image, index) in previewImages" :key="image" class="relative aspect-square rounded overflow-hidden">
        <img :src="image" alt="" class="absolute top-0 left-0 w-full h-full object-cover" />
        <UButton
          icon="heroicons:x-circle"
          square
          color="error"
          variant="ghost"
          class="absolute top-0 right-0 z-2"
          :padded="false"
          @click.stop="handleDeleteNewImage(index)"
        />
      </div>
      <div
        v-if="multiple"
        class="relative aspect-square grid place-content-center bg-black/10 dark:bg-white/10 rounded overflow-hidden"
      >
        <UIcon name="heroicons:plus" class="size-7" />
      </div>
    </template>

    <input
      ref="input"
      type="file"
      :multiple="multiple"
      :accept="ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.join(', ')"
      hidden
      @change="handleUploadImage"
    />
  </div>
</template>

<style scoped></style>
