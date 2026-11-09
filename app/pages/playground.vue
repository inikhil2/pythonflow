<script setup lang="ts">
const { code, reset } = usePlayground()

useHead({ title: 'Playground · PythonFlow' })
</script>

<template>
  <div class="page">
    <header>
      <h1>Playground</h1>
      <p class="sub">Try any Python here. Nothing is checked, and your code stays in this browser.</p>
    </header>
    <Workbench v-model="code" label="Playground code" @reset="reset" />
    <p class="keys">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to run.</p>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
}

.sub {
  margin: var(--s2) 0 0;
  color: var(--text-2);
}

.keys {
  margin: 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

kbd {
  font-family: var(--font);
  font-size: var(--text-xs);
  padding: 0 var(--s1);
  border-radius: var(--r-s);
  background: var(--surface-2);
}
</style>
