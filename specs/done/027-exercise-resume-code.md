# 027: Exercise keeps the learner's code across reloads (rest of task A7)
Files: app/components/content/Exercise.vue
Severity: med

## Problem
Spec 023 only half landed. `app/components/content/Exercise.vue` never saves code and
never loads saved code, so an edit is lost on reload.

## Required change
In `app/components/content/Exercise.vue` make exactly these two edits. Change nothing
else.

1. Replace exactly
```ts
const { progress, recordAttempt, revealHint } = useProgress()
```
with exactly
```ts
const { progress, recordAttempt, revealHint, saveCode } = useProgress()
```

2. Directly after this existing line
```ts
const hintsUsed = computed(() => progress.value.exercises[props.id]?.hintsUsed ?? 0)
```
add exactly this block. It must stay below the `useProgress()` line: `useProgress()`
loads storage in its own `onMounted`, and hooks run in the order they are registered.
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

## Acceptance gates
- `grep -c "saveCode" app/components/content/Exercise.vue` prints 2.
- `grep -c "onBeforeUnmount" app/components/content/Exercise.vue` prints 1.
- `npm run generate` exits 0.
- Browser (`/learn/week0-functions/01-hello`, fresh localStorage):
  1. Type `print("saved")`, wait one second, and reload. The editor shows `print("saved")`.
  2. Press Reset code, wait one second, and reload. The editor shows `# write your code below`.
  3. Type into the editor, press "All lessons" at once, then come back. The edit is still there.
