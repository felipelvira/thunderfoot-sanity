<template>
    <v-row style="margin: 2% 0;">
        <label>Content / WYSIWYG </label>
    </v-row>
    <div v-if="editor" class="editor-chips">
        <v-chip variant="outlined" @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            bold
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }">
            italic
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }">
            strike
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
            code
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().unsetAllMarks().run()">
            clear marks
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().clearNodes().run()">
            clear nodes
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }">
            paragraph
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
            h1
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
            h2
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
            h3
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
            h4
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
            h5
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
            h6
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }">
            bullet list
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }">
            ordered list
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }">
            code block
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }">
            blockquote
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().setHorizontalRule().run()">
            horizontal rule
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().setHardBreak().run()">
            hard break
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()">
            undo
        </v-chip>
        <v-chip variant="outlined" @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()">
            redo
        </v-chip>
    </div>
    <div>
        <editor-content :editor="editor" class="editor-content" />
    </div>
</template>


  
<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
    components: {
        EditorContent,
    },

    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],

    data() {
        return {
            editor: null,
        }
    },

    watch: {
        modelValue(value) {
            // HTML
            const isSame = this.editor.getHTML() === value
            // JSON
            // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
            if (isSame) {
                return
            }
            this.editor.commands.setContent(value, false)
        },
    },

    mounted() {
        this.editor = new Editor({
            content: this.modelValue,
            onUpdate: () => {
                // HTML
                this.$emit('update:modelValue', this.editor.getHTML())
                // JSON
                // this.$emit('update:modelValue', this.editor.getJSON())
            },
            extensions: [
                StarterKit,
            ],
        })
    },

    beforeUnmount() {
        this.editor.destroy()
    },
}
</script>


<style scoped>
.v-chip {
    margin: 2px 5px;
    border-color: rgba(145, 141, 141, 0.7);
}

.editor-content {
    height: 100px;
    border: dashed rgba(145, 141, 141, 0.7);
    overflow: auto;
    padding: 5px;
}

.editor-chips {
    max-height: 60px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}

/* :deep(<inner-selector>) */
::v-deep .ProseMirror {
    max-height: 100px;
    height: 100px;
}
</style>
  