<script setup lang="ts">
type Props = {
  multiple?: boolean;
  initialImages?: string[];
  uploadButtonLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  initialImages: () => [],
  uploadButtonLabel: 'Upload images',
})

type Emit = {
  (e: 'change', imageUrls: string[]): void
}

const emit = defineEmits<Emit>()

const images = ref<string[]>(props.initialImages);

type Result = {
  info: {
    secure_url: string,
    url: string,
    public_id: number,
  }
};

const handleUploadSuccess = (result: Result) => {
  images.value.push(result.info.secure_url);
  emit('change', images.value);
};
</script>

<template>
  <div>
    <div
        v-if="images?.length"
        class="grid gap-2 mb-4"
        :class="{
            'grid-cols-4': multiple,
            'grid-cols-1': !multiple,
          }
        ">
      <CldImage
          v-for="imageUrl in images"
          :key="imageUrl"
          :src="imageUrl"
          width=""
          height=""
          alt=""
      />
    </div>
    <CldUploadWidget
        v-slot="{ open, isLoading }"
        upload-preset="image-present"
        :options="{
          multiple: props.multiple,
          sources: ['local', 'url'],
          clientAllowedFormats: ['png', 'jpeg', 'jpg'],
        }"
        @success="handleUploadSuccess"
    >
      <UButton type="button" block variant="soft" :label="uploadButtonLabel" :loading="isLoading" @click="open"/>
    </CldUploadWidget>
  </div>
</template>

<style scoped>

</style>