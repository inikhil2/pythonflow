# 023: Keep the learner's code across reloads, record lesson opens (task A7)
Files: app/components/content/Exercise.vue, app/pages/learn/[...slug].vue
Severity: med

## Problem
Code typed into an exercise is lost on reload, and opening a lesson is never recorded,
so the Today page (A11) cannot say where to continue. Do this spec only after spec 022
is done.

## Required change
1. In `app/components/content/Exercise.vue` make exactly these edits. Change nothing
   else.
   a. Replace
```ts
const { progress, recordAttempt, revealHint } = useProgress()
```
   with
```ts
const { progress, recordAttempt, revealHint, saveCode } = useProgress()
```
   b. Add this block directly after the `const hintsUsed = ...` line. It must come
   after the `useProgress()` call: `useProgress()` loads storage in its own
   `onMounted`, and hooks run in the order they are registered.
```ts
onMounted(() => {
  // '' means never saved: hints and attempts create the entry with empty code.
  const saved = progress.value.exercises[props.id]?.code
  if (saved) code.value = saved
})

// Save 500 ms after the last change, and at once when the lesson closes.
let timer: ReturnType<typeof setTimeout> | undefined
function flush() {
  clearTimeout(timer)
  timer = undefined
  saveCode(props.id, code.value)
}
watch(code, () => {
  clearTimeout(timer)
  timer = setTimeout(flush, 500)
})
onBeforeUnmount(() => {
  if (timer) flush()
})
```

2. In `app/pages/learn/[...slug].vue`, replace exactly
```ts
useHead({ title: `${lesson.value.title} · PythonFlow` })
```
   with
```ts
useHead({ title: `${lesson.value.title} · PythonFlow` })

// Progress is keyed by the content path, which does not change with trailing slashes.
const path = lesson.value.path
const { openLesson } = useProgress()
onMounted(() => openLesson(path))
```
   Change nothing else in this file.

## Acceptance gates
- `grep -c "saveCode" app/components/content/Exercise.vue` prints 2.
- `grep -c "openLesson(path)" 'app/pages/learn/[...slug].vue'` prints 1.
- `npm run generate` exits 0.
- Browser (`/learn/week0-functions/01-hello`, fresh localStorage):
  1. `JSON.parse(localStorage['pythonflow:v1']).lessons['/learn/week0-functions/01-hello'].openedAt`
     is set.
  2. Type `print("saved")` into the editor, wait one second, and reload. The editor
     shows `print("saved")`.
  3. Press Reset code, wait one second, and reload. The editor shows the starter
     `# write your code below`.
  4. Type into the editor and press "Next lesson" or "All lessons" at once, then come
     back. The edit is still there.
