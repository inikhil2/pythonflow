# 133: Trace: show the main program's variables while inside a function
Files: app/components/VariableBoxes.vue, app/components/content/Trace.vue
Severity: med

## Problem
Spec 132 makes the tracer record `globals` on steps inside a function: the main program's
variables, such as `count` in week 9 lesson 02. The panel still shows only `locals`, so while the
trace is inside `add`, it says "No variables yet." and the global `count` cannot be seen changing.

This spec shows the main program's variables in a second box titled "Global variables", only on
steps that have them. Do spec 132 first. Change nothing else; the existing grid in `.state`
already lays out a third child, so no CSS changes.

## Required change
1. In `app/components/VariableBoxes.vue`, change the props line to:
```ts
defineProps<{ locals: Record<string, TraceValue>; title: string }>()
```
2. In `app/components/VariableBoxes.vue`, change `<h3 class="title">Variables</h3>` to:
```html
    <h3 class="title">{{ title }}</h3>
```
3. In `app/components/content/Trace.vue`, replace the line
   `<VariableBoxes :locals="current.locals" />` with these two lines, at the same indentation:
```html
          <VariableBoxes :locals="current.locals" title="Variables" />
          <VariableBoxes v-if="current.globals" :locals="current.globals" title="Global variables" />
```

## Acceptance gates
1. `grep -c "{{ title }}" app/components/VariableBoxes.vue` prints `1`, and
   `grep -c ">Variables<" app/components/VariableBoxes.vue` prints `0`.
2. `grep -c 'title="Global variables"' app/components/content/Trace.vue` prints `1`, and
   `grep -c "<VariableBoxes" app/components/content/Trace.vue` prints `2`.
3. `npx nuxi typecheck` exits 0, and `npm run generate` exits 0.
4. `git diff --stat` lists only these two files, plus the two files from spec 132 if that spec is not
   committed yet.
