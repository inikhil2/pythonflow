<script setup lang="ts">
// The dark code workbench: the editor above its Run panel. Ctrl+Enter in the editor runs the code.
defineProps<{ label: string, prelude?: string }>()
const code = defineModel<string>({ required: true })
const emit = defineEmits<{ reset: [] }>()

const panel = ref<{ run: () => void }>()
</script>

<template>
  <div class="workbench">
    <CodeEditor v-model="code" :label="label" @run="panel?.run()" />
    <RunPanel ref="panel" :code="code" :prelude="prelude" @reset="emit('reset')" />
  </div>
</template>

<style scoped>
.workbench {
  overflow: hidden;
  border-radius: var(--r-l);
  background: var(--code-bg);
}
</style>
