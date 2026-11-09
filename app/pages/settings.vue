<script setup lang="ts">
const { progress, setName, exportJson, importJson, reset } = useProgress()

// The field fills in once progress loads after mount, and empties again after a reset.
const name = ref('')
watch(() => progress.value.name, (saved) => (name.value = saved), { immediate: true })
const nameStatus = ref('')
const dataStatus = ref('')

const picker = ref<HTMLInputElement>()
const dialog = ref<HTMLDialogElement>()

function saveName() {
  setName(name.value)
  nameStatus.value = progress.value.name ? `Saved. Today greets you as ${progress.value.name}.` : 'Saved. Today greets you without a name.'
}

// A temporary link starts the browser's normal download of the JSON text.
function exportProgress() {
  const url = URL.createObjectURL(new Blob([exportJson()], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `pythonflow-progress-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  dataStatus.value = 'Exported. The file is in your downloads.'
}

async function importProgress() {
  const file = picker.value?.files?.[0]
  if (!file) return
  dataStatus.value = importJson(await file.text())
    ? `Imported ${file.name}. Your progress now comes from that file.`
    : `${file.name} is not a PythonFlow progress file. Nothing changed.`
  if (picker.value) picker.value.value = ''
}

function confirmReset() {
  reset()
  dialog.value?.close()
  dataStatus.value = 'Progress reset. Lessons, saved code, hints, attempts and your name are cleared.'
}

useHead({ title: 'Settings · PythonFlow' })
</script>

<template>
  <div class="page">
    <h1>Settings</h1>
    <section class="card" aria-labelledby="name-title">
      <h2 id="name-title">Your name</h2>
      <p class="sub">Today greets you by this name. Leave it empty for no name.</p>
      <form class="row" @submit.prevent="saveName">
        <label class="field">
          <span>Name</span>
          <input v-model="name" type="text" autocomplete="given-name" maxlength="40">
        </label>
        <button type="submit" class="btn-primary">Save name</button>
      </form>
      <p class="status" role="status">{{ nameStatus }}</p>
    </section>
    <section class="card" aria-labelledby="data-title">
      <h2 id="data-title">Your progress</h2>
      <p class="sub">
        PythonFlow saves your progress in this browser only. Clearing site data or using a private
        window loses it, so export a copy now and then. Importing a file replaces your current progress.
      </p>
      <div class="row">
        <button type="button" class="btn-secondary" @click="exportProgress">Export progress</button>
        <button type="button" class="btn-secondary" @click="picker?.click()">Import progress</button>
        <button type="button" class="btn-secondary danger" @click="dialog?.showModal()">Reset progress…</button>
      </div>
      <input ref="picker" type="file" accept=".json,application/json" hidden @change="importProgress">
      <p class="status" role="status">{{ dataStatus }}</p>
    </section>
    <dialog ref="dialog" class="card dialog" aria-labelledby="reset-title">
      <h2 id="reset-title">Reset all progress?</h2>
      <p class="sub">
        This clears your completed lessons, saved code, hints, attempts and name from this browser.
        It cannot be undone, so export first if you might want them back.
      </p>
      <div class="row">
        <button type="button" class="btn-secondary" @click="dialog?.close()">Cancel</button>
        <button type="button" class="btn-secondary danger" @click="confirmReset">Reset progress</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--s5);
  max-width: 46rem;
}

.sub {
  margin: var(--s2) 0 var(--s4);
  color: var(--text-2);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--s3);
}

.field {
  display: grid;
  gap: var(--s1);
  font-size: var(--text-s);
  color: var(--text-2);
}

.field input {
  min-width: 16rem;
  padding: var(--s2) var(--s3);
  border: 1px solid var(--line);
  border-radius: var(--r-m);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
  font-size: var(--text-m);
}

.danger {
  color: var(--error);
}

.status {
  min-height: 1.5em;
  margin: var(--s3) 0 0;
  color: var(--text-2);
  font-size: var(--text-s);
}

.dialog {
  max-width: 28rem;
  border: 0;
  color: var(--text);
}
</style>
