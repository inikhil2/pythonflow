<script setup lang="ts">
import { BookOpen, BriefcaseBusiness, ChartLine, FolderKanban, House, Target } from '@lucide/vue'

const items = [
  { to: '/', label: 'Today', icon: House },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/interview', label: 'Interview', icon: BriefcaseBusiness },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/progress', label: 'Progress', icon: ChartLine },
]

const footer = [
  { to: '/playground', label: 'Playground' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About PythonFlow' },
]

const route = useRoute()
// A section stays selected on its sub-pages, e.g. Learn on a lesson.
const isCurrent = (to: string) => route.path === to || (to !== '/' && route.path.startsWith(to + '/'))
</script>

<template>
  <nav class="sidebar" aria-label="Main">
    <NuxtLink to="/" class="wordmark">PythonFlow</NuxtLink>
    <ul>
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to" class="item" :aria-current="isCurrent(item.to) ? 'page' : undefined">
          <component :is="item.icon" :size="18" :stroke-width="1.75" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
    <ul class="footer">
      <li v-for="link in footer" :key="link.to">
        <NuxtLink :to="link.to" :aria-current="isCurrent(link.to) ? 'page' : undefined">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s5);
  height: 100vh;
  padding: var(--s5) var(--s3);
}

.wordmark {
  padding: 0 var(--s3);
  color: var(--text);
  font-size: var(--text-l);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
}

ul {
  display: grid;
  gap: var(--s1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s2) var(--s3);
  border-radius: var(--r-m);
  color: var(--text-2);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.item:hover { background: var(--surface-2); color: var(--text); }
.item[aria-current='page'] { background: var(--accent-soft); color: var(--accent-text); }

.footer {
  margin-top: auto;
  padding: 0 var(--s3);
  font-size: var(--text-s);
}

.footer a { color: var(--text-2); }
.footer a:hover,
.footer a[aria-current='page'] { color: var(--text); }

/* Phones: a floating tab bar at the bottom. */
@media (max-width: 48rem) {
  .sidebar {
    position: fixed;
    inset: auto var(--s2) var(--s2);
    z-index: 10;
    height: auto;
    padding: var(--s1);
    border-radius: var(--r-l);
    background: var(--glass);
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: var(--shadow-float);
  }

  .wordmark, .footer { display: none; }
  ul { grid-template-columns: repeat(6, 1fr); }

  .item {
    flex-direction: column;
    gap: var(--s1);
    min-height: 2.75rem;
    padding: var(--s1);
    font-size: var(--text-xs);
  }
}
</style>
