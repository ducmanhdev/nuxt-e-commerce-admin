<script setup lang="ts">
const files = ref<File[]>([])
const handleImageChange = (event) => {
  files.value = []
  Array.from(event.target.files).forEach((file) => {
    if (file.type.startsWith('image/')) {
      files.value.push(file)
    } else {
      console.error(`${file.name} is not a valid image file.`)
    }
  })
}

const removeImageByIndex = (index: number) => {
  console.log({ index })
  files.value = files.value.filter((_, _index) => _index !== index)
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const uploadToSupabase = () => {
  try {
    if (!user.value) {
      console.error('Not authenticated')
      return
    }
    if (!files.value.length) {
      console.error('No images to upload.')
      return
    }

    files.value.forEach(async (file) => {
      const fileName = `${user.value?.id}/${Date.now()}`
      const { data, error } = await supabase.storage.from('billboards').upload(fileName, file)
      if (error) {
        console.error('Upload error:', error.message)
      } else {
        console.log('Uploaded successfully:', data)
      }
    })
  } catch (error) {
    console.error('Error uploading images:', error)
  }
}
const handlePreviewImage = (file: File) => {
  return URL.createObjectURL(file)
}
</script>

<template>
  <div class="p-4">
    <UContainer>
      <label class="block p-4 border rounded cursor-pointer" for="upload-image-input">
        <span v-if="!files.length" class="text-center block">Empty</span>
        <span v-else class="grid grid-cols-8 gap-4">
          <span v-for="(file, index) in files" :key="file.name" class="relative">
            <img :src="handlePreviewImage(file)" alt="" class="aspect-square object-cover border rounded" />
            <button type="button" class="absolute top-0 right-0 z-2" @click.prevent.stop="removeImageByIndex(index)">
              Remove
            </button>
          </span>
          <span class="relative aspect-square flex justify-center items-center border rounded">Add more</span>
        </span>
        <input type="file" multiple accept="image/*" @change="handleImageChange" hidden id="upload-image-input" />
      </label>
      <UButton @click="uploadToSupabase">Save</UButton>
    </UContainer>
  </div>
</template>
