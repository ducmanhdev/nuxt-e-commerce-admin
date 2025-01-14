<script lang="ts" setup>
const modelValue = defineModel<string>({
  required: true
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
      class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none'
    }
  }
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <div class="border border-transparent dark:border-[var(--ui-border)] rounded">
    <div
      v-if="editor"
      class="flex flex-wrap gap-2 p-2.5 border-b border-transparent dark:border-[var(--ui-border)] rounded"
    >
      <UButton
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('bold') }"
        icon="lucide:bold"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('italic') }"
        icon="lucide:italic"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('strike') }"
        icon="lucide:strikethrough"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleStrike().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('code') }"
        icon="lucide:code"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleCode().run()"
      />
      <UButton
        icon="lucide:remove-formatting"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().unsetAllMarks().run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('paragraph') }"
        icon="lucide:text"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().setParagraph().run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 1 }) }"
        icon="lucide:heading-1"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 2 }) }"
        icon="lucide:heading-2"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 3 }) }"
        icon="lucide:heading-3"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 4 }) }"
        icon="lucide:heading-4"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 5 }) }"
        icon="lucide:heading-5"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('heading', { level: 6 }) }"
        icon="lucide:heading-6"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('bulletList') }"
        icon="lucide:list"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('orderedList') }"
        icon="lucide:list-ordered"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('codeBlock') }"
        icon="lucide:square-code"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      />
      <UButton
        :class="{ 'bg-primary text-black hover:bg-primary hover:text-black': editor.isActive('blockquote') }"
        icon="lucide:quote"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().toggleBlockquote().run()"
      />
      <UButton
        icon="lucide:separator-horizontal"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().setHorizontalRule().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().undo().run()"
        icon="lucide:undo"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().undo().run()"
      />
      <UButton
        :disabled="!editor.can().chain().focus().redo().run()"
        icon="lucide:redo"
        variant="outline"
        size="sm"
        @click="editor.chain().focus().redo().run()"
      />
    </div>
    <TiptapEditorContent class="p-2.5" :editor="editor" />
  </div>
</template>
