# 079: Error page and the About page (task E5)
Files: app/error.vue, content/about.md
Severity: med

## Problem
There is no `app/error.vue`, so a bad link shows Nuxt's default error page without the
sidebar. The new page sits inside the default layout. It shows the status code, then
"Page not found" for a 404 or "Something went wrong" for anything else. Under that is one
line, plus "Go to Today" and "Browse lessons" buttons. They call `clearError` with a
redirect, which clears the error state.

`content/about.md` is still the starter placeholder. It must credit CS50P (Harvard, CC
BY-NC-SA 4.0), say PythonFlow is not made or endorsed by Harvard, and say that code runs
in the browser and progress is stored only in local storage. `app/pages/[...slug].vue`
already renders it at `/about`.

## Required change
1. **Create `app/error.vue`** with exactly this content.
```vue
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)

useHead({ title: `${missing.value ? 'Page not found' : 'Something went wrong'} · PythonFlow` })
</script>

<template>
  <NuxtLayout>
    <div class="page">
      <p class="code">{{ error.statusCode }}</p>
      <h1>{{ missing ? 'Page not found' : 'Something went wrong' }}</h1>
      <p class="sub">
        {{ missing
          ? 'This address has no page. The lesson may have moved, or the link has a typo.'
          : 'PythonFlow hit an error loading this page. Your progress is safe in this browser.' }}
      </p>
      <div class="actions">
        <button type="button" class="btn-primary" @click="clearError({ redirect: '/' })">Go to Today</button>
        <button type="button" class="btn-secondary" @click="clearError({ redirect: '/learn' })">Browse lessons</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s3);
  max-width: 40rem;
}

.code {
  margin: 0;
  color: var(--accent-text);
  font-family: var(--font-mono);
  font-size: var(--text-s);
}

h1,
.sub {
  margin: 0;
}

.sub {
  color: var(--text-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s3);
}
</style>
```
Keep every import line exactly as shown and add no others. Nuxt auto-imports Vue APIs, composables, utils and components. The only import is the `NuxtError` type.

2. **Replace the whole of `content/about.md`** with exactly this content. Delete everything in the file first.
```md
---
title: About PythonFlow
---

# About PythonFlow

PythonFlow is a place to learn Python by writing it. Each lesson explains one idea, then
gives you code to run and an exercise to check, right in the page.

## Where the course comes from

The lessons follow [CS50's Introduction to Programming with Python](https://cs50.harvard.edu/python/)
(CS50P) from Harvard University, taught by David J. Malan. CS50P is licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). PythonFlow is an
independent study companion. It is not made or endorsed by Harvard or CS50.

## Your code and progress

Your code runs in your browser with [Pyodide](https://pyodide.org/), a version of Python built
for the web. PythonFlow has no accounts and no server that stores your work. Your progress, saved
code and name stay in this browser's local storage. Clearing site data removes them, so use
[Settings](/settings) to export a copy.

[Back to Today](/)
```

## Acceptance gates
1. Sizes:
   wc -c "app/error.vue"   # expect 1367
   wc -c "content/about.md"   # expect 964
2. `grep -c "^import" app/error.vue` prints 1.
3. `npx nuxi typecheck` exits 0.
4. `npm run generate` exits 0. `grep -c "CC BY-NC-SA 4.0" .output/public/about/index.html` prints 1, and
   `grep -c "Content Version" .output/public/about/index.html` prints 0.
5. Browser gates are run by Orca, in the dark theme, at 1440, 834 and 390 px wide. `/nope` and `/projects/nope` show "404" and "Page not found" with the sidebar.
   Go to Today and Browse lessons both work. The tab title is "Page not found · PythonFlow".
