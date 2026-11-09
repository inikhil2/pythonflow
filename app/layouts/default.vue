<template>
  <div class="shell">
    <AppSidebar />
    <main class="content">
      <div class="top">
        <ThemeToggle />
      </div>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  min-height: 100vh;
}

.content {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: var(--s6);
}

.top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--s4);
}

@media (max-width: 48rem) {
  .shell { grid-template-columns: minmax(0, 1fr); }
  .content { padding: var(--s4) var(--s4) 5rem; }
}
</style>
