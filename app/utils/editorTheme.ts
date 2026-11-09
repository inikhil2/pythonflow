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
