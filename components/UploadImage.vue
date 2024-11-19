<script setup lang="ts">
type Props = {
  multiple?: boolean
  maxFileSize?: number
}

const { multiple = true, maxFileSize = 5500000 } = defineProps<Props>()

const ACCEPT = ['image/png', 'image/jpeg', 'image/jpg']

const bytesToMB = (bytes: number) => {
  if (bytes < 0) {
    throw new Error('Input must be a non-negative number.')
  }
  const MB = bytes / (1024 * 1024)
  return MB.toFixed(2)
}
const uploadDescription = computed(
  () =>
    ACCEPT.map((mine) => '.' + mine.split('/')[1])
      .join(', ')
      .toUpperCase() +
    ' up to ' +
    bytesToMB(maxFileSize) +
    'MB',
)

const inputRef = useTemplateRef('input')
const files = ref<File[]>([])
const handleInputChange = () => {
  Array.from(inputRef.value?.files || []).forEach((file) => {
    console.log(file.type)
    if (!file.type.startsWith('image/')) {
      console.error(`${file.name} is not a valid image file.`)
      return
    }
    if (!ACCEPT.includes(file.type)) {
      console.error(`${file.name} is not acceptable`)
      return
    }
    if (file.size > maxFileSize) {
      console.error(`${file.name} exceeds ${maxFileSize} bytes`)
      return
    }
    files.value.push(file)
  })
}

const previewImages = ref<string[]>([])
watchEffect((onCleanup) => {
  previewImages.value = files.value.map((file) => URL.createObjectURL(file))
  onCleanup(() => {
    previewImages.value.forEach((image) => URL.revokeObjectURL(image))
  })
})

const handleDeleteImage = (index: number) => {
  files.value.splice(index, 1)
}
</script>

<template>
  <div
    class="p-2 grid gap-2 border border-dashed rounded hover:border-primary transition cursor-pointer"
    :class="{
      'min-h-64': previewImages.length === 0,
      'grid-cols-3': multiple,
    }"
    @click="inputRef?.click()"
  >
    <div class="space-y-2 col-span-full flex flex-col justify-center items-center" v-if="previewImages.length === 0">
      <UIcon name="heroicons:arrow-up-tray" size="28" />
      <p class="text-gray-500">Click to upload {{ multiple ? 'images' : 'an image' }} here</p>
      <p class="text-xs text-gray-400">{{ uploadDescription }}</p>
    </div>
    <template v-else>
      <div v-for="(image, index) in previewImages" class="relative aspect-square rounded overflow-hidden">
        <img :src="image" alt="" class="absolute top-0 left-0 w-full h-full object-cover" />
        <UButton
          icon="heroicons:x-circle"
          square
          color="red"
          class="absolute top-0 right-0 z-2"
          @click.stop="handleDeleteImage(index)"
        />
      </div>
      <div
        class="relative aspect-square grid place-content-center bg-black/10 dark:bg-white/10 rounded overflow-hidden"
      >
        <UIcon name="heroicons:plus" size="28" />
      </div>
    </template>

    <input
      type="file"
      :multiple="multiple"
      :accept="ACCEPT.join(', ')"
      hidden
      ref="input"
      @change="handleInputChange"
    />
  </div>
</template>

<style scoped></style>
