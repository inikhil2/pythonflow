# 056: Current-line highlight in CodeEditor (shell step, task C3)
Files: app/components/CodeEditor.vue, app/utils/editorTheme.ts
Severity: med

## Why a shell step
Spec 056 failed twice with Qwen and left no change. These are full-file replacements, so
heredocs write them exactly. The content is the same as in specs/hold/056-editor-highlight.md.

What it does: `CodeEditor` gets an optional `highlightLine` prop (1-based). It draws a
CodeMirror line decoration with the class `cm-traceLine`, which moves when the prop
changes. With no prop, or a line past the end, nothing is highlighted. Existing uses of
`CodeEditor` do not change. `editorTheme` gets the one `.cm-traceLine` rule.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
cat > app/components/CodeEditor.vue <<'VUE'
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
VUE
cat > app/utils/editorTheme.ts <<'TS'
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// CodeMirror colours, read from the --code-* and --syn-* tokens in main.css.
const chrome = EditorView.theme(
  {
    '&': { backgroundColor: 'var(--code-bg)', color: 'var(--code-text)', fontSize: '0.875rem' },
    '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
    '.cm-content': { padding: 'var(--s3) 0', caretColor: 'var(--code-text)' },
    '.cm-cursor': { borderLeftColor: 'var(--code-text)' },
    '.cm-gutters': { backgroundColor: 'var(--code-bg)', color: 'var(--code-muted)', border: 'none' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--code-line)' },
    // The visual explorer's current line; after activeLine so it wins on the same line.
    '.cm-traceLine': { backgroundColor: 'var(--code-selection)', boxShadow: 'inset 3px 0 0 var(--accent)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: 'var(--code-selection)' },
    '&.cm-focused': { outline: 'none' },
    '.cm-matchingBracket': { backgroundColor: 'var(--code-selection)', color: 'inherit' },
    '.cm-tooltip': { backgroundColor: 'var(--code-bar)', color: 'var(--code-text)', border: 'none' },
  },
  { dark: true },
)

const syntax = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.operatorKeyword], color: 'var(--syn-keyword)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--syn-string)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--syn-number)' },
  { tag: t.comment, color: 'var(--syn-comment)', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--syn-function)' },
])

export const editorTheme = [chrome, syntaxHighlighting(syntax)]
TS
```

## Acceptance gates
- `git diff --stat HEAD -- app` lists only these two files.
- `wc -c < app/components/CodeEditor.vue` prints `2658` and `wc -c < app/utils/editorTheme.ts` prints `1879`.
- `grep -c "^import" app/components/CodeEditor.vue` prints `6`.
- `grep -c "^import" app/utils/editorTheme.ts` prints `3`.
- `npm run generate` exits 0.
- Browser (Orca): the hello lesson editor still types, runs with Ctrl+Enter and resets.
- Delete `specs/hold/056-editor-highlight.md` in the same commit, so 056 exists only once.
