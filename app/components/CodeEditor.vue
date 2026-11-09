<script setup lang="ts">
// The only file that talks to CodeMirror. Everything else uses v-model and @run.
import { basicSetup } from 'codemirror'
import { Decoration, EditorView, keymap } from '@codemirror/view'
import { Prec, StateEffect, StateField, type EditorState } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { python } from '@codemirror/lang-python'

const props = defineProps<{ label: string, highlightLine?: number }>()
const code = defineModel<string>({ required: true })
const emit = defineEmits<{ run: [] }>()

const host = ref<HTMLDivElement>()
let view: EditorView | null = null

// The visual explorer's current line: one line decoration, moved by setHighlight.
const setHighlight = StateEffect.define<number | undefined>()

function lineDecoration(state: EditorState, line: number | undefined) {
  if (!line || line > state.doc.lines) return Decoration.none
  return Decoration.set([Decoration.line({ class: 'cm-traceLine' }).range(state.doc.line(line).from)])
}

const highlight = StateField.define({
  create: (state) => lineDecoration(state, props.highlightLine),
  update(decorations, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setHighlight)) return lineDecoration(tr.state, effect.value)
    }
    return decorations.map(tr.changes)
  },
  provide: (field) => EditorView.decorations.from(field),
})

onMounted(() => {
  view = new EditorView({
    parent: host.value!,
    doc: code.value,
    extensions: [
      basicSetup,
      python(),
      indentUnit.of('    '),
      // Highest so Mod-Enter beats basicSetup's insertBlankLine.
      // Escape, then Tab, moves focus out of the editor (CodeMirror built-in).
      Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => (emit('run'), true) }, indentWithTab])),
      editorTheme,
      highlight,
      EditorView.contentAttributes.of({ 'aria-label': props.label }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) code.value = u.state.doc.toString()
      }),
    ],
  })
})

// Outside changes (Reset) replace the document.
watch(code, (value) => {
  if (view && value !== view.state.doc.toString()) {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
  }
})

watch(() => props.highlightLine, (line) => view?.dispatch({ effects: setHighlight.of(line) }))

onBeforeUnmount(() => view?.destroy())
</script>

<template>
  <div ref="host" class="editor" />
</template>

<style scoped>
.editor {
  min-height: 10rem;
  background: var(--code-bg);
}

.editor :deep(.cm-editor) {
  min-height: 10rem;
}
</style>
