# 016: Show the real Python version in the run toolbar (task A1)
Files: public/pyodide-worker.js, app/composables/usePython.ts, app/components/RunPanel.vue
Severity: med

## Problem
The run toolbar does not say which Python runs the code. The runtime is Pyodide 0.29.5,
which is CPython 3.13.2. The label must come from the running interpreter, not from a
hardcoded string. Today the worker posts `{ type: 'ready' }` with no version, and
`usePython()` returns only `{ ready, running, run, stop }`.

## Required change
1. In `public/pyodide-worker.js`, replace exactly these lines:
```js
pyodideReady.then(
  () => self.postMessage({ type: 'ready' }),
  () => self.postMessage({ type: 'load-error' }),
);
```
   with exactly:
```js
pyodideReady.then(
  (pyodide) => self.postMessage({ type: 'ready', version: pyodide.runPython('import sys\nsys.version.split()[0]') }),
  () => self.postMessage({ type: 'load-error' }),
);
```
   Change nothing else in this file.

2. In `app/composables/usePython.ts`:
   a. Below the line `const running = ref(false)` add:
```ts
const version = ref('')
```
   b. Replace exactly:
```ts
      if (e.data.type === 'ready') {
        ready.value = true
```
   with exactly:
```ts
      if (e.data.type === 'ready') {
        version.value = e.data.version
        ready.value = true
```
   c. Replace the last line of `usePython()`:
```ts
  return { ready, running, run, stop }
```
   with exactly:
```ts
  return { ready, running, version, run, stop }
```
   Change nothing else in this file.

3. In `app/components/RunPanel.vue`:
   a. Replace exactly:
```ts
const { ready, running, run, stop } = usePython()
```
   with exactly:
```ts
const { ready, running, version, run, stop } = usePython()
```
   b. In the template, directly after the closing `</p>` of `<p class="status" role="status">`
   and before the "Reset code" button, add:
```vue
      <span v-if="version" class="version">Python {{ version }}</span>
```
   c. In `<style scoped>`, directly after the `.status { ... }` rule, add:
```css
.version {
  color: var(--code-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}
```

## Acceptance gates
- `node --check public/pyodide-worker.js` exits 0.
- `grep -c "version" app/composables/usePython.ts` prints 3.
- `grep -n "Python {{ version }}" app/components/RunPanel.vue` prints one line.
- Browser (`npm run dev`, open `/learn/week0-functions/01-hello`): after Python loads,
  the toolbar shows `Python 3.13.2` to the left of "Reset code". Run still prints output.
