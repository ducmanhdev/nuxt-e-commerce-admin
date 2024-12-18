<script lang="ts" setup>
const modelValue = defineModel<string>({
  required: true,
})

watch(modelValue, (newModelValue) => {
  if (!editor.value) return
  const isSame = editor.value.getHTML() === newModelValue
  if (isSame) {
    return
  }
  editor.value.commands.setContent(newModelValue || '', false)
})

const editor = useEditor({
  content: modelValue.value,
  onUpdate: () => {
    modelValue.value = editor.value?.getHTML() || ''
  },
  extensions: [TiptapStarterKit],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none',
    },
  },
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <div class="border border-transparent dark:border-[var(--ui-border)] rounded">
    <div
      class="flex flex-wrap gap-2 p-2.5 border-b border-transparent dark:border-[var(--ui-border)] rounded"
      v-if="editor"
    >
      <UButton
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('bold') }"
        icon="ri:bold"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('italic') }"
        icon="ri:italic"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('strike') }"
        icon="ri:strikethrough"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('code') }"
        icon="ri:code-view"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().unsetAllMarks().run()"
        icon="ri:format-clear"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('paragraph') }"
        icon="ri:paragraph"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 1 }) }"
        icon="ri:h-1"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 2 }) }"
        icon="ri:h-2"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 3 }) }"
        icon="ri:h-3"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 4 }) }"
        icon="ri:h-4"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 5 }) }"
        icon="ri:h-5"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 6 }) }"
        icon="ri:h-6"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('bulletList') }"
        icon="ri:list-unordered"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('orderedList') }"
        icon="ri:list-ordered"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('codeBlock') }"
        icon="ri:code-block"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('blockquote') }"
        icon="ri:double-quotes-l"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().setHorizontalRule().run()"
        icon="ri:separator"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        icon="ri:arrow-go-back-line"
        variant="outline"
        size="sm"
      />
      <UButton
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        icon="ri:arrow-go-forward-line"
        variant="outline"
        size="sm"
      />
    </div>
    <TiptapEditorContent class="p-2.5" :editor="editor" />
  </div>
</template>
