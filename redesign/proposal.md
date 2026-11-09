# PythonFlow redesign proposal

Status: the user approved the full scope of the brief and the mock-up. Every open
decision in section 8 carries a recommended default; the orchestrator applies the
defaults without asking. Author: principal engineer. Date: 2026-10-23.

Inputs read: `design-brief.md` (the user's brief), the mock-up
`PythonFlow Learning App Interface Collection.png` (seven screens), `plan.md`,
`DESIGN.md`, `docs/lesson-format.md`, and all code in `app/`, `content/`, and
`public/pyodide-worker.js`.

The working name is **PythonFlow**. It teaches the CS50P syllabus with original
lessons, attributed to CS50P on the About page.

---

## 1. Screen analysis

The mock-up image is 1536 x 1024 px and holds six screens of about 530 px width plus
one dark strip. Each screen is a desktop design of about 1440 px width scaled down by
about 2.7. The sizes below are design sizes, estimated from the image at that scale.
Colours are pixel samples from the image, rounded.

### Shared frame (all screens)
- Left sidebar, about 240 px wide, with the same near-white background as the page.
  A faint 1 px rule separates it from the content. It holds the wordmark (a Python
  logo and "PythonFlow", 16 px semibold), then the nav items Home, Learn, Practice,
  Projects and Progress. Each item is an 18 px line icon, a 15 px label, about 40 px
  tall with 8 px radius. The selected item is a pale blue fill (`#dfeefe`) with blue
  text and icon. The footer holds Settings (13 px, grey) and an avatar with the name
  "Nikhil Pandey" and the level "Beginner".
- Page background `#f6fafc`, a cool blue-white. Cards are white with a 12 to 14 px
  radius and a very soft, wide shadow with no visible border.
- Text: headings near-black navy (about `#141a26`), secondary text slate grey (about
  `#5f6b7d`), tertiary text lighter grey.
- Accent: one bright blue, about `#1a73f0` on buttons (swatch `#3580e5`). There is no
  second accent hue. Green appears only on "Completed" and success, and red only on
  mistakes.

### Screen 1: Learning dashboard (Home)
- Layout: content max about 1100 px. A two-column grid, about 2/3 and 1/3, with a 24 px
  gap. There is a top bar with a search field (about 380 px wide, pill, grey
  placeholder "Search lessons, projects..."), a sun icon button (theme), and an avatar.
- Header: "Good evening, Nikhil" plus a waving-hand emoji, 30 px bold, letter-spacing
  about -0.02em. Below it the subline "Small steps. Big progress. You're doing great!",
  15 px, grey.
- Continue Learning card (left, about 140 px tall): a Python logo tile (56 px, 12 px
  radius), the eyebrow "Continue Learning" (13 px semibold), the meta "Python Basics -
  3.3.1" (12 px, light grey), the title "Variables and Data Types" (17 px semibold), a
  thin 4 px progress bar (blue fill on grey track) with "4 / 8 lessons" (12 px), and a
  "Continue" button (pill, blue, white text, about 36 px tall).
- Your Learning Path: section title (18 px semibold) and a "View all" link (13 px,
  blue). It is a vertical list of four modules joined by a thin vertical connector.
  Each row has a number badge (28 px circle; filled gradient when done or current,
  grey when locked), a title (15 px semibold), a subtitle (13 px grey), and a status
  chip on the right. The chip states are "Completed" (green on pale green), "In
  Progress" (blue on pale blue) and "Locked" (grey with a lock icon). 1 px hairlines
  separate the rows.
- Right column cards: "Daily Practice" shows "2 / 5 exercises completed" with a ring
  (about 56 px, 4 px stroke, partly filled). "This Week" shows seven vertical bars
  Mon to Sun with gradient fill and day labels. "Recent Activity" has three rows, each
  with an icon, a title ("Completed: Data Types") and a time ("2 hours ago"), 13 and
  11 px. "Recommended Next" is a row with an icon tile, "Try the Control Flow lesson",
  a subline, and a chevron.
- States shown: completed, in progress and locked modules, and a partial ring.

### Screen 2: Guided lesson
- Layout: the sidebar plus a single content card (about 760 px). A top row holds a back
  chevron (left) and a progress pill (right) with "4 / 8" and a 160 px bar.
- Eyebrow "Python Basics - 3.2" (13 px grey), title "Variables and Data Types" (32 px
  bold), and a clock icon with "8 min" (13 px).
- Body paragraph at 16 px, line-height about 1.7, max about 620 px.
- Code example: a light grey block (`#f3f6f9`, 12 px radius, about 20 px padding,
  14 px monospace) with syntax colours (strings dark red, numbers purple, `print` blue).
  An annotation card on the right ("This creates a variable called `name` and stores
  the string "Nikhil" in it.") is linked to line 1 by a thin connector and a green
  marker on the line.
- "Try it yourself" card: a title (17 px semibold), an instruction (14 px grey), and a
  primary button "Start exercise".
- Two collapsible rows, "Key concepts" and "Glossary", each with a circle icon and a
  chevron, separated by hairlines.
- Footer navigation: "Previous" (white button, 1 px grey border, left arrow) and
  "Continue" (blue, right arrow).
- States: collapsed disclosures, and lesson position 4 of 8.

### Screen 3: Interactive playground
- Layout: a split pane. On the left, about 40%, are the instructions on the page
  background. On the right, about 60%, is a dark workbench card (`#15202d`, 12 px
  radius).
- Left: a breadcrumb "Control Flow - 4.2", the title "For Loops" (26 px bold), body text
  (15 px), a light code example, an inline code chip `range(5)` (blue text on pale
  blue, 6 px radius), and a "Try it yourself" block with a "Hint" secondary button
  (pale blue, blue text, 8 px radius).
- Workbench header: a "Python 3.10" dropdown (left, 14 px, white), plus "Reset"
  (outlined dark button with an icon) and "Run" (blue, with an icon), both about 36 px
  tall with an 8 px radius.
- Editor: line-number gutter (grey numbers, 14 px mono), a comment in green-grey, the
  keyword `for` in pink-purple, strings in amber, and an indent guide. The line
  numbers read 1, 2, 3, 6, which is a mock-up error.
- Output area: two tabs, "Output" (active, with an underline) and "Errors". The stdout
  lines are 14 px mono, white.
- Status bar: a green check icon and "Code executed successfully" (13 px, green), on a
  slightly lighter dark strip (`#182432`).
- States: after a successful run. Not shown: running, error, timeout, or loading.

### Screen 4: Visual concept explorer
- Layout: the sidebar (Learn selected), then a topic list card (about 280 px) and a main
  card. The header is "Visual Explorer" (28 px bold) with the subline "See how Python
  concepts work in real time." There is a small settings icon at the top right.
- Topic list: Variables (selected, pale blue), Data Types, Lists, Dictionaries,
  Conditionals, Loops, Functions, Exceptions. Each has a 20 px icon.
- Main card: the title "Variables" (20 px semibold) and a description. A code card
  holds `x = 10`, `print(x)`, `x = 25`, `print(x)` with a small "Run" button (blue,
  8 px radius). An Output card shows `10` and `25`. A state strip below shows a name
  chip `x`, a value box `10` ("Initial value"), an arrow, and a value box `25`
  ("Updated value"). The value boxes are pale blue, about 64 px tall, with 20 px
  numbers.
- States: one static before and after pair. No stepping is visible.

### Screen 5: Projects and practice
- Header "Projects" (28 px bold) with the subline "Build real-world projects and apply
  what you've learned." A segmented control has "Projects" (selected, pale blue pill)
  and "Practice".
- A two-column card grid with a 24 px gap. Each card has an icon tile (48 px, 12 px
  radius; blue tint, or green tint for Expense Tracker), a chevron at the top right, a
  title (17 px semibold), a two-line description (14 px grey), a status chip ("In
  Progress", blue, or "Not started", grey), and a "2/4 milestones" count (12 px) on
  the right.
- Cards: Calculator (In Progress, 2/4), Number Guessing Game (0/4), Expense Tracker
  (0/5), Text Analyzer (0/6).
- Mock-up error: the sidebar highlights Progress on this screen.

### Screen 6: Progress and mastery
- Header "Your Progress" with a range dropdown "Last 7 days" at the top right.
- Three stat tiles: "Lessons Completed 18 / 42" with a bar, "Concepts Mastered 12" with a
  "+2" green delta chip, and "Time Spent 6h 45m" with a "+1h 20m" chip. The numbers are
  28 px semibold.
- "Weekly Activity": a heatmap grid (rows Mon to Sun, about 11 columns) of 14 px blue
  squares in five intensities, with a "Less" to "More" legend. The row labels skip days
  (a mock-up error).
- "Skill Mastery": a ring (about 120 px, "57%" in the centre) and a legend list:
  Variables 100%, Control Flow 75%, Data Structures 50%, Functions 25%.
- "Recent Mistakes": three rows with a red icon, the text ("For loop off by one error",
  "List index out of range", "Indentation error") and a time ("2 days ago").
- "Recommended Revision": "Control Flow", the text "You struggled with conditional
  statements. Try this short exercise to build confidence.", and a "Start now" button
  (pale blue).

### Screen 7: Dark theme and palette
- Dark dashboard strip: page `#0f1825`, sidebar `#162230`, cards `#1e2c3e`. The
  selected nav item is a lighter slate fill. Text is near-white, and secondary text is
  `#8e9fbf`. The Continue button is the same bright blue with white text. The greeting
  uses a moon emoji.
- Palette swatches (sampled): Primary Blue `#3580e5`, Dark Surface `#253144`, Secondary
  Text `#8e9fbf`, Success Green `#11bb5f`, Warning Orange `#fa803b`. The swatches have
  a 12 px radius.

### Extracted token set
The mock-up colours are adjusted where they fail WCAG 4.5:1. White on the sampled
`#3580e5` is about 3.9:1, so the fill blue is deepened. Every pair below was computed
with the WCAG formula. The final values are in section 6.

| Role | Light | Dark | Contrast (measured) |
|---|---|---|---|
| Page `--bg` | `#f5f7fa` | `#0e1622` | text 16.4 / 15+ |
| Card `--surface` | `#ffffff` | `#172131` | |
| Sunken `--surface-2` | `#edf1f6` | `#212d40` | text-2 5.52 / 5.43 |
| `--text` | `#141922` | `#e9eef6` | |
| `--text-2` | `#566173` | `#93a3bd` | 5.84 on bg / 7.10 on bg |
| Fill `--accent` (white text) | `#1462d6` | `#2b6fdc` | 5.60 / 4.76 |
| Link `--accent-text` | `#1462d6` | `#6aa8ff` | 5.22 on bg / 6.67 on surface |
| Tint `--accent-soft` | `#e3edfc` | `#1c3152` | accent-text on it 4.75 / 5.38 |
| `--success` | `#157a3f` | `#3fcf7f` | 5.40 / 8.04 |
| `--warning` | `#a35200` | `#ff9d57` | 5.58 / 7.87 |
| `--error` | `#c8281e` | `#ff6b61` | 5.56 / 5.80 |
| Code bg (both) | `#121b27` | same | code text 14.3, muted 5.52 |
| Code syntax (both) | keyword `#ff7ab2`, string `#f2c46d`, number `#c3a6ff`, comment `#7d8ea6`, function `#6cb6ff` | same | 7.16 / 10.6 / 8.43 / 5.19 / 8.06 |

---

## 2. Conflicts and rulings

| # | Conflict | Ruling | Why |
|---|---|---|---|
| 1 | DESIGN.md: translucent sidebar. Brief: "glass sparingly, floating controls only". Mock-up: solid. | Solid sidebar (same tone as the page). Glass only on the floating mobile tab bar. | The brief is the user's newest and most specific word. |
| 2 | DESIGN.md: no divider lines. Brief: "thin separators and tonal differences". Mock-up: hairlines in lists. | 1 px `--line` hairlines between rows inside a list only. Cards have no border: a soft shadow in light, tonal lift in dark. | Brief plus mock-up agree. |
| 3 | DESIGN.md: pill buttons. Mock-up: 8 to 10 px rounded rectangles (pill only on chips). | Buttons 10 px radius, chips pill. | The mock-up is the visual reference the user supplied. |
| 4 | DESIGN.md: "not Home". Mock-up: a Home item. Brief: sidebar = Learn, Practice, Projects, Progress. | Nav = **Today**, Learn, Practice, Projects, Progress. Today is the dashboard at `/`. | Keeps the brief's four items, gives the dashboard a named home, and names it for its content. |
| 5 | Mock-up emoji (waving hand, moon). Brief: no emoji as icons. | No emoji anywhere. The greeting is text only. | The brief forbids it outright. |
| 6 | Mock-up Python logo tile in the Continue card and wordmark. | Wordmark is text only. The Continue card shows a week badge ("W0"). | The logo is a PSF trademark and decorative. |
| 7 | Mock-up "Locked" modules. Brief: adults, agency. | No locks. Status is Not started / In progress / Completed, plus a "Recommended next" pointer. | Locks are fake gating; adults may skip ahead. |
| 8 | Mock-up Output / Errors tabs. | One console: stdout, then the traceback in red, then a plain-English explanation. | Tabs hide the error at the moment it matters. |
| 9 | Mock-up "Python 3.10" dropdown. | A static label read from the runtime ("Python 3.13"). No dropdown. | There is one runtime. A dropdown with one item is a dead control, and 3.10 is false. |
| 10 | plan.md: textarea editor. Brief: highlighting, line numbers, shortcuts. | CodeMirror 6 (section 4.5). | A textarea cannot meet the brief. |
| 11 | plan.md: route `/lessons/[...slug]`. | `/learn/<week-folder>/<lesson>` via the collection `prefix`. | Learn nav state matches the URL. |
| 12 | plan.md: "`input()` becomes an inline prompt". Spec 011 was skipped. | Keep the stdin box ("Input", one line per `input()` call). Live prompt deferred (section 8, D9). | It needs COOP/COEP headers; the cost is high and the value is low now. |
| 13 | plan.md: "mobile not polished". Brief: verify desktop, tablet, mobile. | Mobile is a first-class layout: bottom tab bar, stacked panes. | Brief wins. |
| 14 | plan.md T8: a final "styling pass". | Dropped. DESIGN.md and the exemplars apply from the first task. | Late styling passes rewrite everything twice. |
| 15 | Brief: "warm white or neutral". Mock-up: cool blue-white. | Neutral-cool `#f5f7fa`. | Sits between them and avoids the cream default. |
| 16 | Mock-up: editor dark in the light theme. Brief: light default. | The code workbench (editor, output) is dark in both themes. Lesson code examples follow the page theme. | Matches the mock-up. One syntax palette and one contrast check. |
| 17 | Mock-up: settings, avatar, user name, top-bar search. | Avatar dropped (no accounts). Settings is a real page (theme, optional name, export, reset). Search is deferred until it is real. | There are no dead controls. |
| 18 | Mock-up numbering ("3.2", "3.3.1", "4.2"), Projects screen highlighting Progress, line numbers 1, 2, 3, 6. | Not copied. Lessons show "Week 0 - Lesson 1 of 8". | These are mock-up errors. |

---

## 3. Honesty check

The brief forbids fake progress and dead buttons. Each item below is backed by local
data (`localStorage`, key `pythonflow:v1`) or dropped.

| Feature | Real if... | Verdict |
|---|---|---|
| Continue Learning card | It shows the most recently opened lesson that is not completed, from `lessons[path].openedAt`. | Keep. Empty state: "Start with Week 0, Hello, world". |
| Lesson x / y bar | It counts completed lessons in that week against the lesson count from content. | Keep. A lesson counts as completed only when every exercise in it has passed. |
| Learning path status | It is derived per week from lesson completion. | Keep. Locks are dropped. |
| Daily Practice "2 / 5" ring | It needs a daily goal the user never set. | Drop the ring. Show "Exercises passed today: N" on the dashboard (a real count). |
| This Week bars / weekly activity heatmap | It counts attempts per day from `attempts[].at` over the last 7 days. | Keep 7 bars on the dashboard and on Progress. The 11-week heatmap is dropped until there is that much history. |
| Recent activity | It lists the last 5 events (lesson opened, exercise passed, project milestone) from the stored log. | Keep. |
| Recommended next | Rule: (1) a concept needing revision, else (2) the next lesson in order after the last completed one. The text names the reason. | Keep. |
| Concepts mastered / Skill mastery % | A concept is mastered when every exercise tagged with it has passed, at least one of them without hints. The percentage is the share of a group's concepts that are mastered. | Keep, with the rule shown in a footnote on the page. |
| Concepts needing revision | A concept needs revision when 2 or more of its last 3 attempts failed. | Keep. |
| Recent mistakes | It lists the failed attempts with their category: the Python exception name (`IndexError`) or "Wrong output", plus the lesson and the time. | Keep. Labels like "for loop off by one" are invented and are dropped. |
| Common mistakes, improvement over time | It counts failures by category, comparing the last 7 days with the previous 7. | Keep as one list with counts. No trend graphics. |
| Time spent "6h 45m" | It cannot be measured honestly (open tabs, idle time). | **Drop.** |
| "+2" / "+1h 20m" delta chips | They depend on dropped or unstable figures. | Drop. |
| "Python 3.10" | The runtime is Pyodide 0.29.5 = CPython 3.13.2 (read from `pyodide-lock.json`). | The worker reports `sys.version` and the label shows it. |
| Adaptive practice | The queue is built from the needs-revision concepts first, then unpassed exercises in opened lessons. Each item says why it is there. | Keep (rule-based, explainable). No claims of "AI adaptation". |
| "Explain why an answer is incorrect" | A per-test diff (expected against your output), plus the plain-English error map. | Keep. |
| Concept explorer state | It runs the learner's code under `sys.settrace` in the worker and shows the recorded steps (section 4.6). | Keep. No canned animations. |
| Projects "2/4 milestones" | It counts the milestones passed, from stored results. | Keep. |
| Greeting "Good evening, Nikhil" | It uses the time of day from the clock and an optional name from Settings. | Keep. Without a name it says "Good evening". |
| Search | It would need a real index (Nuxt Content `queryCollectionSearchSections`). | Deferred (task E6). Not shown until built. |
| "Beginner" level badge | Undefined. | Drop. |
| Sync | None. | Settings says "Progress is saved in this browser only", with an Export / Import JSON backup. |

---

## 4. Architecture

### 4.1 Keep
- Nuxt 4.6 static generation, Vue 3.5, `@nuxt/content` 3.16 (native sqlite), plain
  scoped CSS, no CSS framework.
- The Pyodide worker (`public/pyodide-worker.js`) and `usePython()` interface
  `{ ready, running, run(code, stdin), stop }`. One shared worker per page, a 10 s
  timeout, and restart on stop. It was verified in T3. It gets small additive changes
  only: `version` (A1) and `trace` (C1).
- Lesson Markdown files with frontmatter and the `::exercise` MDC block.

### 4.2 Routes

| Route | Page file | Content |
|---|---|---|
| `/` | `app/pages/index.vue` | Today: greeting, Continue, exercises today, 7-day bars, learning path, recent activity, recommended next |
| `/learn` | `app/pages/learn/index.vue` | Weeks 0 to 9 with lessons and status, plus an entry card to the explorer |
| `/learn/<week>/<lesson>` | `app/pages/learn/[...slug].vue` | Lesson page (exemplar) |
| `/learn/explore` and `/learn/explore/<topic>` | `app/pages/learn/explore/[[topic]].vue` | Visual explorer |
| `/practice` | `app/pages/practice.vue` | Practice queue |
| `/projects` | `app/pages/projects/index.vue` | Project gallery |
| `/projects/<id>` | `app/pages/projects/[id].vue` | Project workspace with milestones |
| `/progress` | `app/pages/progress.vue` | Progress and mastery |
| `/playground` | `app/pages/playground.vue` | Free workbench, code saved locally |
| `/settings` | `app/pages/settings.vue` | Theme, name, export / import / reset |
| `/about`, others | `app/pages/[...slug].vue` | `pages` collection (About and attribution) |

The playground is linked from the Learn page header and from the sidebar footer. The
explorer is linked from Learn and from lessons via `::trace`.

### 4.3 Data model (structured, separate from components)

Content (`content.config.ts`, typed with zod):
- `lessons` collection, type `page`, `source: { include: 'week*/**/*.md', prefix: '/learn' }`.
  Frontmatter: `title`, `week` (0 to 9), `order`, `minutes` (number), `concepts`
  (concept ids, optional until B1).
- The `::exercise` block gains fields. Existing fields stay unchanged:
  - `hints: string[]` (optional, revealed one at a time);
  - `tests[]`, where each case is either `{ stdin, stdout }` or `{ check }`. A `check`
    case is Python appended after the learner's code; it passes if it raises nothing,
    for example `assert square(3) == 9`.
- `weeks` collection, type `data`, `content/weeks.yml`: `[{ week, title, summary }]`,
  for example `{ week: 1, title: Conditionals }`.
- `concepts` collection, type `data`, `content/concepts.yml`:
  `[{ id, title, week, group, requires: [ids] }]`. Groups are Python basics, Control
  flow, Data structures, Functions, Errors and testing, Files and text, Objects, and
  Going further. Prerequisites live here (concept to concept). Lessons point at
  concepts.
- `projects` collection, type `data`, `content/projects/*.yml`:
  `{ id, title, summary, icon, requires: [concept ids], afterWeek, milestones: [{ id, title, prompt, starter, tests, hints, solution }] }`.
- `explorer` collection, type `data`, `content/explorer/*.yml`:
  `{ topic, title, summary, icon, code, week }`.
- `pages` collection, type `page`: `index.md` (removed once `/` is a Vue page),
  `about.md`.

Progress (browser only, `localStorage['pythonflow:v1']`, a JSON object with a version
field):
```ts
interface Progress {
  version: 1
  name: string                                   // optional greeting name, '' if unset
  lessons: Record<string, { openedAt: string; completedAt?: string }>   // key = lesson path
  exercises: Record<string, { code: string; passedAt?: string; hintsUsed: number }>  // key = exercise id
  attempts: Attempt[]                            // newest last, capped at 500
}
interface Attempt { id: string; at: string; passed: boolean; category: string | null; concepts: string[] }
```
`category` is the exception name (`NameError`), `Wrong output`, or `Timeout`. All
derived figures (mastery, activity, recommendations) are pure functions of
`Progress` plus content. Nothing derived is stored.

### 4.4 Modules: composables, utilities, components

Logic lives in `app/utils/*.ts` as pure functions with one Node assert script each in
`scripts/check-*.ts`. Composables wrap state and side effects. Components hold markup
and call composables. Deep modules with small interfaces:

| Module | Interface | Hides |
|---|---|---|
| `usePython()` (kept) | `ready, running, version, run(code, stdin), stop, trace(code, stdin)` | the worker, its lifecycle, the timeout, restart |
| `useProgress()` | `progress` (readonly), `openLesson(path)`, `saveCode(id, code)`, `recordAttempt(a)`, `useHint(id)`, `setName(n)`, `exportJson()`, `importJson(s)`, `reset()` | storage, versioning, SSR safety, the cap |
| `utils/progress.ts` | pure reducers used by `useProgress` | |
| `useChecker()` | `check(code, tests) -> CaseResult[]` | sequential runs, stdout normalising, check cases |
| `utils/compareOutput.ts` | `sameOutput(expected, actual)` | trailing-whitespace rules |
| `utils/errorHelp.ts` | `explainError(errorLine) -> { title, body } or null` | the mapping table |
| `utils/lessonExercises.ts` | `exerciseIds(body)` | the minimark AST walk |
| `utils/mastery.ts` | `conceptStatus(progress, concepts, exerciseConcepts)`, `recommendations(...)`, `activity(progress, days)` | all mastery rules |
| `useTheme()` | `theme` ('system', 'light' or 'dark'), `setTheme()` | `color-scheme` on `<html>`, storage |
| `useTrace()` | `steps`, `index`, `step(delta)`, `go(code)` | the trace protocol |

Components (each under 150 lines, one job):
- Shell: `AppSidebar` (exemplar).
- Workbench: `CodeEditor`, `RunPanel`, `RunOutput` (all exemplars), `TestResults`,
  `HintList`, `ErrorHelp`.
- Content: `content/Exercise` (exemplar), `content/Trace` (embed the explorer in a
  lesson), `content/Note` (annotation callout).
- Lesson: `LessonNav` (previous / next, folded into the exemplar lesson page),
  `Disclosure` (`<details>` styled, for Key concepts and Glossary).
- Dashboard: `ContinueCard`, `LearningPath`, `ActivityBars`, `RecentActivity`,
  `NextStep`.
- Progress: `StatTile`, `MasteryList`, `MistakeList`.
- Explorer: `TraceStepper`, `VariableBoxes`, `CallStack`.
- Projects: `ProjectCard`, `MilestoneList`.
- Generic: `EmptyState` (exemplar), `StatusChip`, `ProgressBar`.

### 4.5 Editor decision: CodeMirror 6, wrapped once
- Packages: `codemirror` 6.0.2, `@codemirror/lang-python` 6.2.1, plus the directly
  imported `@codemirror/view`, `@codemirror/state`, `@codemirror/commands`,
  `@codemirror/language` and `@lezer/highlight` (already transitive; declared because
  we import them).
- What it gives: real syntax highlighting, line numbers, Python auto-indent, bracket
  matching and closing, undo history, Tab indent (Escape then Tab leaves the editor,
  which is CodeMirror's built-in focus escape), and Ctrl/Cmd+Enter to run.
- Cost: about 150 KB gzipped of JavaScript. It loads only on pages that show an editor
  because `Exercise` is a lazily loaded global content component.
- Cost for Qwen: CodeMirror's API is large and easy to misuse. It is contained:
  `CodeEditor.vue` and `utils/editorTheme.ts` are written once (exemplar) and are off
  limits to Qwen tasks. Every other file uses only `<CodeEditor v-model="code" label="..." @run="..." />`.
- Smaller routes rejected: a textarea with a highlighted `<pre>` overlay (fragile caret
  sync, no auto-indent), and Prism plus a contenteditable (worse). Monaco is about
  2 MB and poor on mobile.
- Lesson code examples (read-only) use Shiki at build time through Nuxt Content's
  built-in `highlight` option. That means zero runtime JavaScript and dual light and
  dark themes.

### 4.6 Visual explorer: trace the real code
- Worker: a new message `{ type: 'trace', code, stdin }`. Python helper run inside the
  worker:
  `sys.settrace(tracer)` then `exec(compile(code, 'main.py', 'exec'), g)`. On each
  `line`, `call`, `return` and `exception` event whose `co_filename == 'main.py'`, it
  records `{ event, line, stack: [function names], locals: {name: {type, repr}}, stdoutLength }`.
  The repr is capped at 80 characters. Lists, tuples and dicts are shallow-expanded to
  12 items. Locals starting with `__` and modules are skipped.
- The trace stops at 1000 steps with a final note "Stopped after 1000 steps". The
  normal 10 s timeout still applies.
- UI: `TraceStepper` has First, Back, Step and Last buttons, a range slider (arrow keys
  work natively), and "Step 4 of 23". The editor highlights the current line (a
  CodeMirror line decoration, added inside `CodeEditor` as a `highlightLine` prop).
  `VariableBoxes` shows one box per variable with its type, and the value changes with
  a 200 ms fade (none under reduced motion). `CallStack` lists frames with their
  arguments. On an exception step it shows the error plus its plain-English
  explanation. The output shows stdout up to the current step.
- The learner edits the code and presses "Run and trace". The state shown always comes
  from that run. Explorer topics come from `content/explorer/*.yml`: variables, types
  and conversion, lists, dictionaries, conditionals, loops, functions and call stack,
  and exceptions.

### 4.7 Error explanations
`utils/errorHelp.ts` maps the exception name (the first word of `result.error`) to a
title and one or two sentences. It is shown in `ErrorHelp` below the real traceback,
never instead of it. The first set covers SyntaxError (plus a special case for
"unterminated string literal"), IndentationError, NameError, TypeError, ValueError,
IndexError, KeyError, ZeroDivisionError, AttributeError, ModuleNotFoundError,
EOFError ("your program asked for input but the Input box has no more lines; add a
line to the Input box"), RecursionError, and the timeout message. Unknown errors show
nothing extra.

### 4.8 Icons
`@lucide/vue` (1.61.0). The older `lucide-vue-next` is deprecated in favour of it.
Named imports in each component (`import { BookOpen } from '@lucide/vue'`) keep it
tree-shaken. Icons are 18 px in nav and 16 px in buttons, with stroke width 1.75 and
`aria-hidden="true"`, always next to a visible text label.

### 4.9 Theme
Tokens are defined once with the CSS `light-dark()` function, so there is no
duplicated dark block. `color-scheme: light dark` follows the OS. `useTheme` sets
`style.colorScheme` on `<html>` to `light` or `dark` for a manual choice, and Settings
offers System / Light / Dark. Browser support is Chrome 123+, Safari 17.5+ and
Firefox 120+.

---

## 5. Curriculum fit

The learning path shows **CS50P weeks as modules** with plain titles. The mock-up's
four coarse groups (Python Basics, Control Flow and so on) become the concept
**groups** used on the Progress page, so both views exist without renaming the
syllabus.

| Week (module) | Title in the path | Concept group(s) | Explorer topics | Project unlocked as recommended next |
|---|---|---|---|---|
| 0 | Functions and variables | Python basics, Functions | Variables, Data types | |
| 1 | Conditionals | Control flow | Conditionals | Calculator |
| 2 | Loops | Control flow, Data structures | Loops, Lists, Dictionaries | |
| 3 | Exceptions | Errors and testing | Exceptions | |
| 4 | Libraries | Going further | | Number guessing game; API client (mocked) |
| 5 | Unit tests | Errors and testing | | |
| 6 | File I/O | Files and text | | Expense tracker |
| 7 | Regular expressions | Files and text | | Text analyser |
| 8 | Object-oriented programming | Objects | | |
| 9 | Et cetera | Going further | | |

Projects live in `content/projects/<id>.yml` and run in the project workspace
(`/projects/<id>`). Each milestone is an exercise with tests.
- **Calculator** (after week 1), 4 milestones: read two numbers; add; choose an
  operator with `if/elif`; guard against division by zero.
- **Number guessing game** (after week 4), 4 milestones: `check_guess(secret, guess)`
  returns "Too low", "Too high" or "Correct", tested with `check` cases; a loop over
  `input()` guesses; count the attempts; pick the secret with `random.randint`. That
  last milestone is tested by seeding with `random.seed(1)` in a check case.
- **API client with mocked data** (after week 4), 4 milestones: parse a JSON string with
  `json.loads`; pick fields; handle a missing key; format a report. A starter module
  `fake_api.get(path)` returns canned JSON. Real network calls are not possible in
  Pyodide's sandbox, so this is stated on the project card.
- **Expense tracker** (after week 6), 5 milestones: parse "amount,category" lines; sum;
  totals by category with a dict; write and read a CSV in Pyodide's in-memory
  filesystem; report the top category. Files do not persist between visits, and the
  project says so.
- **Text analyser** (after week 7), 5 milestones: count words; count lines; most common
  word with a dict; find emails with `re`; print a summary.

Prerequisites are advisory. The project card lists "Uses: ..." concepts and shows
"Recommended after Week N". Nothing is locked.

---

## 6. New DESIGN.md (paste as the whole file)

~~~markdown
# DESIGN.md: PythonFlow design rules

Follow exactly. Plain CSS in `<style scoped>`. No CSS framework, no animation library.
Every value below is already a variable in `app/assets/css/main.css`. Use the variable;
never type a hex colour, a shadow or a duration in a component.

## Colour tokens (`light-dark(light, dark)` in main.css)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f5f7fa` | `#0e1622` | page and sidebar |
| `--surface` | `#ffffff` | `#172131` | cards |
| `--surface-2` | `#edf1f6` | `#212d40` | sunken areas, lesson code blocks, secondary buttons, chips |
| `--text` | `#141922` | `#e9eef6` | body and headings |
| `--text-2` | `#566173` | `#93a3bd` | secondary text, labels |
| `--accent` | `#1462d6` | `#2b6fdc` | button fills (with `--on-accent` text) |
| `--accent-text` | `#1462d6` | `#6aa8ff` | links, selected nav text, icons |
| `--accent-soft` | `#e3edfc` | `#1c3152` | selected nav fill, info chips |
| `--on-accent` | `#ffffff` | `#ffffff` | text on `--accent` |
| `--success` | `#157a3f` | `#3fcf7f` | passed, completed |
| `--warning` | `#a35200` | `#ff9d57` | needs revision |
| `--error` | `#c8281e` | `#ff6b61` | failed, mistakes |
| `--line` | `rgb(20 25 34 / 0.08)` | `rgb(233 238 246 / 0.08)` | hairlines between list rows only |

Code workbench (same in both themes; it is always dark):
`--code-bg #121b27`, `--code-bar #18222f`, `--code-line #1a2534`, `--code-text #e4eaf2`,
`--code-muted #8193ab`, `--code-selection #2a4470`, `--code-ok #4cd788`,
`--code-err #ff7b72`. Syntax: `--syn-keyword #ff7ab2`, `--syn-string #f2c46d`,
`--syn-number #c3a6ff`, `--syn-comment #7d8ea6`, `--syn-function #6cb6ff`.

All text pairs above are at least 4.5:1. Colour is never the only signal: pair it with a
text label or an icon.

## Typography

- UI: `var(--font)` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`
- Code: `var(--font-mono)` = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`
- Scale (rem): `--text-xs 0.75` (chips, captions), `--text-s 0.8125` (meta),
  `--text-m 0.9375` (UI default, buttons, nav), `--text-body 1.0625` (lesson prose),
  `--text-l 1.25` (card titles), `--text-xl 1.75` (page titles),
  `--text-2xl clamp(1.75rem, 3vw, 2.25rem)` (lesson title, greeting).
- Weights: 400 body, 500 buttons and nav, 600 titles, 700 page titles only.
- Tracking: -0.02em on `--text-xl` and up, -0.01em on `--text-l`, 0 below.
- Leading: 1.1 on page titles, 1.3 on card titles, 1.5 UI, 1.65 lesson prose.
- Lesson prose width: max `40rem`. Code is `0.875rem` with line-height 1.6.

## Spacing, radius, shadow

- Spacing scale (rem only): `--s1 0.25`, `--s2 0.5`, `--s3 0.75`, `--s4 1`, `--s5 1.5`,
  `--s6 2`, `--s7 3`. No other values.
- Page padding `--s6` desktop, `--s4` under 48rem. Grid gap `--s5`.
- Radius: `--r-s 6px` (inline code, small chips), `--r-m 10px` (buttons, inputs, nav
  items), `--r-l 14px` (cards, workbench), `--r-pill 999px` (status chips, bars).
- Shadow: `--shadow-card` on cards only (light: soft and wide; dark: none, tonal lift).
  `--shadow-float` only on floating UI (mobile tab bar, popovers).
- Cards have no border. Never stack a card inside a card; inside a card use `--surface-2`.

## Layout

- Desktop: sidebar `15rem` + content. Content max width `72rem`, centred.
- Under `48rem`: the sidebar becomes a fixed bottom tab bar (icons over labels, glass:
  `--glass` background with `backdrop-filter: blur(20px) saturate(180%)`). Content gets
  bottom padding `5rem`.
- Lesson page: one column, max `46rem`. From `75rem`: the workbench moves right and
  sticks (split pane, text 1fr, workbench 1.2fr).
- One primary button per view. Secondary actions use the secondary button.

## Components

- **Primary button** `.btn-primary`: `--accent` fill, `--on-accent` text, `--r-m`,
  padding `var(--s2) var(--s4)`, weight 500, `--text-m`, optional 16px icon before the label.
- **Secondary button** `.btn-secondary`: `--surface-2` fill, `--text` text, same shape.
  On the dark workbench, use `--code-line` fill and `--code-text` text.
- **Status chip**: pill, `--text-xs`, weight 500, padding `var(--s1) var(--s3)`, a 12px
  icon plus a word: Completed (success), In progress (accent-text on accent-soft),
  Not started (text-2 on surface-2), Needs revision (warning).
- **Nav item**: 18px icon + label, `--r-m`, padding `var(--s2) var(--s3)`. Selected:
  `--accent-soft` fill, `--accent-text` text, `aria-current="page"`.
- **Workbench**: `--code-bg`, `--r-l`. A toolbar (`--code-bar`) with status on the left
  and Reset and Run on the right. Run turns into Stop while running (same place). The
  output console is below, mono, stdout in `--code-text`, errors in `--code-err`, and a
  status line with an icon and words.
- **Progress bar**: 6px tall, pill, `--surface-2` track, `--accent` fill, the width
  animates.
- **Lists**: rows separated by 1px `--line`; no card per row.
- **Icons**: `@lucide/vue`, stroke-width 1.75, `aria-hidden="true"`, always next to a text
  label. No emoji in the interface.

## Motion

- Tokens: `--ease cubic-bezier(0.2, 0.8, 0.2, 1)`, `--dur-fast 100ms`, `--dur 200ms`,
  `--dur-slow 400ms`.
- Press feedback: `button:active { transform: scale(0.97) }` over `--dur-fast`.
- Hover: colour or background change only, `--dur`.
- Progress bars and value changes in the explorer: `--dur-slow`.
- Animate `opacity` and `transform` (and `width` on progress bars) only. No bounce.
  Never block input during a transition. Theme changes ease the background over `--dur`.

## Accessibility (required)

- Focus: `:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px }`
  (global in main.css; it survives forced-colors mode). Never remove it.
- `prefers-reduced-motion: reduce` sets all durations to 1ms. `prefers-reduced-transparency`
  makes the tab bar solid `--surface`. `prefers-contrast: more` turns `--line` into
  `currentColor` and gives cards a 1px border.
- Real `<button>` for actions, `<NuxtLink>` for navigation. Every icon-only control has
  an `aria-label`. Status text changes go in a `role="status"` element.
- Every page has one `<h1>`. Landmarks: `<nav aria-label="Main">`, `<main>`.
- Touch targets at least 2.75rem tall on mobile.

## Voice

- Sentence case. Specific verbs: "Run", "Stop", "Reset code", "Check answer",
  "Show hint", "Next lesson". Never "Submit" or "Go".
- Errors say what happened and what to do next. Empty states invite one action.
- Lessons: warm, second person, one idea per paragraph.
~~~

---

## 7. Revised task list (replaces T4 to T8 and T19 in plan.md)

Each task is one aider session for Qwen. A task touches at most 3 files and under 150
changed lines, and every gate can be observed. "Browser:" gates are checked by the
orchestrator in `npm run dev`. Each task gets a full spec in `specs/open/` once this
proposal is applied; this list is the order and the contract. Qwen also reads
`docs/patterns.md` with every task.

### E0. Exemplars: done by the principal engineer in this session (not Qwen)
`main.css` tokens, `layouts/default.vue`, `AppSidebar`, `CodeEditor` +
`utils/editorTheme.ts`, `RunPanel`, `RunOutput`, `content/Exercise`, `EmptyState`,
`pages/learn/index.vue`, `pages/learn/[...slug].vue`, the empty-state pages for
practice, projects and progress, `content.config.ts`, the `nuxt.config.ts` highlight
option, `app.vue`, and `docs/patterns.md`. After E0 the path Learn > lesson > edit >
Run works in the browser.

### Phase A: core learning loop (first working, testable app)
- **A1 Runtime version.** Files: `public/pyodide-worker.js`, `app/composables/usePython.ts`,
  `app/components/RunPanel.vue`. The worker posts `{ type: 'ready', version }`, taken
  from `sys.version.split()[0]`. `usePython` exposes `version: Ref<string>`. The RunPanel
  toolbar shows "Python 3.13.2". Gate: the label is shown after loading; `node --check`
  passes on the worker.
- **A2 Error help.** Files: `app/utils/errorHelp.ts`, `app/components/ErrorHelp.vue`,
  `scripts/check-error-help.ts`. Mapping as in 4.7. `RunOutput` renders
  `<ErrorHelp :error>` under stderr. This is a one-line edit, done by the orchestrator
  in the shell list if it would exceed 3 files. Gate:
  `node scripts/check-error-help.ts` prints `ok`; browser: `print(x)` shows NameError
  plus its explanation.
- **A3 Progress store.** Files: `app/utils/progress.ts` (types + pure reducers),
  `app/composables/useProgress.ts` (load and save, client only, ignores corrupt JSON),
  `scripts/check-progress.ts`. Gate: the check script prints `ok`; browser: after
  `openLesson` the key `pythonflow:v1` exists in localStorage.
- **A4 Checker.** Files: `app/utils/compareOutput.ts`, `app/composables/useChecker.ts`,
  `scripts/check-compare.ts`. Cases run one at a time through `usePython().run`. A
  `check` case runs `code + '\n' + check`. Gate: the script prints `ok`.
- **A5 Check answer UI.** Files: `app/components/content/Exercise.vue`,
  `app/components/TestResults.vue`. A "Check answer" button sits beside the workbench.
  It shows per-case Passed / Failed with the expected output against yours, records an
  attempt, and marks the exercise passed. Gate (browser): the sample solution passes;
  `print("hi")` fails with a readable diff.
- **A6 Hints.** Files: `app/components/HintList.vue`, `app/components/content/Exercise.vue`,
  `docs/lesson-format.md`. "Show hint 1 of N" reveals one at a time and increments
  `hintsUsed`. Gate (browser): an exercise with 2 hints reveals them in order.
- **A7 Resume code.** Files: `app/components/content/Exercise.vue`,
  `app/pages/learn/[...slug].vue`. Saved code loads on mount and saves on change
  (500 ms debounce). The lesson calls `openLesson(path)`. Gate (browser): edit, reload,
  and the edit is still there.
- **A8 Lesson completion.** Files: `app/utils/lessonExercises.ts`,
  `scripts/check-lesson-exercises.ts`, `app/pages/learn/[...slug].vue`. The lesson
  shows "Completed" once every exercise has passed, and `completedAt` is stored. Gate:
  the script prints `ok`; browser: pass the hello exercise, reload, and the lesson shows
  Completed.
- **A9 Weeks data + Learn page status.** Files: `content/weeks.yml`, `content.config.ts`,
  `app/pages/learn/index.vue`. It shows the week titles and the status chip per lesson.
  Gate (browser): week 0 shows "Functions and variables" and the hello lesson shows its
  real status.
- **A10 Lesson header position.** Files: `app/pages/learn/[...slug].vue`. It shows "Lesson n
  of m" within the week and a week progress bar of the completed count. Gate (browser):
  correct for 01-hello.
- **A11 Today page part 1.** Files: `app/pages/index.vue`, `app/components/ContinueCard.vue`.
  The greeting by hour (and name if set) and the Continue card (rule in section 3).
  Gate (browser): with fresh storage it shows "Start with Hello, world"; after opening
  the lesson it shows that lesson.
- **A12 Today page part 2.** Files: `app/pages/index.vue`, `app/components/LearningPath.vue`,
  `app/components/StatusChip.vue`. It shows weeks 0 to 9 with a status per week.
- **A13 Today page part 3.** Files: `app/utils/mastery.ts` (only `activity()` and
  `recentEvents()`), `app/components/ActivityBars.vue`, `app/components/RecentActivity.vue`.
  Seven days of attempt counts as accessible bars: each bar has a text value, plus a
  visually hidden table. Gate: `scripts/check-mastery.ts` (added in B2) or browser
  counts match the attempts made.

### Phase B: concepts, progress, practice
- **B1 Concepts data.** Files: `content/concepts.yml`, `content.config.ts`,
  `docs/lesson-format.md`. Week 0 to 9 concepts with groups and `requires`. The lesson
  frontmatter field `concepts`.
- **B2 Mastery rules.** Files: `app/utils/mastery.ts`, `scripts/check-mastery.ts`. Implements
  `conceptStatus` and `recommendations` exactly as in section 3. Gate: the script prints
  `ok` on 6 fixed cases.
- **B3 Progress page tiles.** Files: `app/pages/progress.vue`, `app/components/StatTile.vue`,
  `app/components/ProgressBar.vue`. Lessons completed x / y, concepts mastered n / m,
  exercises passed.
- **B4 Progress page lists.** Files: `app/pages/progress.vue`, `app/components/MasteryList.vue`,
  `app/components/MistakeList.vue`. Mastery per group, plus the mistake categories with
  counts (last 7 days against the previous 7) and the last date.
- **B5 Recommended next and revision.** Files: `app/components/NextStep.vue`,
  `app/pages/index.vue`, `app/pages/progress.vue`. Each recommendation shows its reason
  in words.
- **B6 Practice page.** Files: `app/pages/practice.vue`, `app/components/PracticeItem.vue`.
  The queue from `recommendations()`. Each item opens the lesson anchored at
  `#<exercise id>`.
- **B7 Concepts in lessons.** Files: the week 0 lesson files only (content). Add
  `concepts` and `minutes`.

### Phase C: visual explorer
- **C1 Worker trace.** Files: `public/pyodide-worker.js`, `app/composables/usePython.ts`.
  The protocol is as in 4.6. This is the hardest Qwen task, so the spec contains the
  full Python helper verbatim. Gate (orchestrator, Node script with pyodide 0.29.5):
  tracing `x = 10\nx = 25` yields steps with `x` = 10, then 25.
- **C2 useTrace.** Files: `app/composables/useTrace.ts`.
- **C3 Current-line highlight.** Files: `app/components/CodeEditor.vue`,
  `app/utils/editorTheme.ts`. A `highlightLine?: number` prop. Written by the principal
  engineer as a spec with the full code, because this is CodeMirror.
- **C4 Stepper + variables.** Files: `app/components/TraceStepper.vue`,
  `app/components/VariableBoxes.vue`.
- **C5 Call stack + explorer page.** Files: `app/components/CallStack.vue`,
  `app/pages/learn/explore/[[topic]].vue`.
- **C6 Explorer topics.** Files: `content/explorer/*.yml` (8 small files, 2 per task, so
  4 tasks), `content.config.ts`.
- **C7 `::trace` in lessons.** Files: `app/components/content/Trace.vue`,
  `docs/lesson-format.md`.

### Phase D: projects
- **D1 Projects collection + gallery.** Files: `content.config.ts`,
  `app/pages/projects/index.vue`, `app/components/ProjectCard.vue`.
- **D2 Project workspace.** Files: `app/pages/projects/[id].vue`,
  `app/components/MilestoneList.vue`. The milestones reuse `Exercise` (props passed from
  YAML).
- **D3 to D7 One project file each.** Files: `content/projects/<id>.yml`. The solution
  of each milestone passes its tests (orchestrator gate with the check script runner).
- **D8 Projects / Practice segmented control.** Folded into the nav: Practice has its own
  page, so the mock-up's segmented control is **dropped** (it duplicated the nav).

### Phase E: settings, polish, integration
- **E1 Theme.** Files: `app/composables/useTheme.ts`, `app/pages/settings.vue`. System /
  Light / Dark segmented control, stored in `pythonflow:theme`.
- **E2 Settings data.** Files: `app/pages/settings.vue`. Name field; Export (download JSON),
  Import (file input), Reset progress with a confirmation dialog (the only destructive
  action).
- **E3 Split-pane lesson layout at 75rem and up.** Files: `app/pages/learn/[...slug].vue`,
  `app/components/content/Exercise.vue`. Decided default: no drag resize; a fixed ratio.
- **E4 Playground page.** Files: `app/pages/playground.vue`. A free workbench with code
  saved under `pythonflow:playground`.
- **E5 404 + About.** Files: `app/error.vue`, `content/about.md`. The About page credits
  CS50P (Harvard, CC BY-NC-SA) and states local-only storage.
- **E6 Search.** Deferred: only after content weeks 0 to 3 exist.
- **T7 Ask the tutor: kept unchanged**, scheduled after Phase A.
- **T19 Integration, rewritten:** `npm run generate` exits 0. The orchestrator clicks
  through Today > Learn > lesson > Run > Check answer > Progress shows the pass, in
  light and dark, at 1440, 834 (tablet) and 390 px widths.

### Content T9 to T18 (kept, amended)
The lesson format gains `minutes`, `concepts`, `hints` and `check` tests. There is no
`# H1` in the lesson body: the page renders the title from frontmatter. Each week task
also adds that week's entries to `content/weeks.yml` and `content/concepts.yml`.

### Old briefs and specs

| Item | Verdict |
|---|---|
| T4a (textarea `CodeEditor`) | **Dropped**, replaced by the E0 CodeMirror `CodeEditor`. |
| T4b (`RunPanel`) | **Dropped**, replaced by the E0 `RunPanel` + `RunOutput`. |
| T4c (wire into `Exercise`) | **Dropped**, done in E0. |
| spec 012 (contrast tokens, held) | **Superseded** by the section 6 tokens, all measured at 4.5:1 or more. |
| spec 013 (forced-colors focus ring, held) | **Superseded**: the new focus style is an `outline`, which survives forced colors. |
| spec 014 (hello lesson wording, open) | **Still valid.** E0 adds `minutes` and removes the duplicate `# Hello, world` line only. 014's text matches are untouched. |
| spec 015 (lesson-format rules, open) | **Partly superseded.** Its stdin/stdout rules stay correct; rewrite it after A6 to include `hints`, `check`, `minutes`, `concepts` and the no-H1 rule. |
| spec 011 (live input, skipped) | Stays skipped (D9). |

### Shell steps for the orchestrator (Qwen cannot do these)
1. E0 (done by the principal engineer, this exception only): `npm install codemirror @codemirror/lang-python @codemirror/view @codemirror/state @codemirror/commands @codemirror/language @lezer/highlight @lucide/vue`.
2. After each phase: `npm run generate` (expect exit 0) and `git add -A cs50p-tutor && git commit`.
3. After A2, A3, A4, A8 and B2: run `node scripts/check-<name>.ts` (expect `ok`). Node 24
   runs TypeScript directly.
4. After A11: `git rm cs50p-tutor/content/index.md` (the `/` route becomes a Vue page).
5. After C1: run the trace check script with the pyodide 0.29.5 package.
6. Move finished specs to `specs/done/`.

---

## 8. Risks and decisions

### Risks
1. **Scope.** About 45 Qwen tasks plus about 50 lessons and 5 projects. Mitigation: Phase A
   alone is a complete, honest product (learn, run, check, resume, progress basics).
   Ship and commit after every phase, and stop at any phase boundary without broken
   screens.
2. **Qwen and CodeMirror.** Wrong extensions break the editor silently. Mitigation:
   `CodeEditor.vue` and `editorTheme.ts` are off limits to Qwen. C3 is specced with full
   code.
3. **The trace protocol (C1) for a 9B model.** Mitigation: the spec carries the Python
   helper verbatim, and a Node gate checks it.
4. **localStorage loss** (cleared site data, private windows). Mitigation: the Export /
   Import JSON backup and a clear "this browser only" message.
5. **Pyodide CDN offline.** It is already handled with a clear load-error message. Vendoring
   Pyodide locally (about 10 MB) is possible later.
6. **The mock-up is a polished concept.** Heatmaps, rings and delta chips look rich but
   have no honest data at the start. Removing them makes the app look sparser than the
   picture. That is intended.
7. **`light-dark()` support:** Safari 17.5+. Older Safari shows the light theme only.
8. **The bundle:** CodeMirror is about 150 KB gzipped, loaded only on editor pages.
   Shiki runs at build time only.
9. **Mastery is rule-based.** It can mislabel a concept. Mitigation: the rule is written
   on the Progress page, so the learner can judge it.

### Decisions (the recommended default is applied)

| # | Decision | Default (recommended) | Why |
|---|---|---|---|
| D1 | App name | PythonFlow, with "Lessons follow Harvard's CS50P" on About and in the footer | It is in the mock-up, and it is honest about the source. |
| D2 | Editor | CodeMirror 6 | The only option that meets the brief at a sane size. |
| D3 | Workbench colour | Dark in both themes | Mock-up; one syntax palette. |
| D4 | Locked modules | None; recommended order only | Adults, agency, and no fake gating. |
| D5 | Time spent, daily goal ring | Dropped | Cannot be made true. |
| D6 | Greeting name | Optional field in Settings, stored locally | Personal without accounts. |
| D7 | Theme control | System / Light / Dark in Settings | The mock-up shows a toggle; System respects the OS by default. |
| D8 | Mobile workbench | Stacked (editor, then output), no tabs | Simpler and accessible. The brief allows either. |
| D9 | Live `input()` prompt | Not now; the stdin box stays | It needs COOP/COEP headers and a worker rewrite. The box is honest and works. |
| D10 | Split-pane resize | Fixed ratio, no drag handle | Drag adds a gesture system for little gain. Revisit after use. |
| D11 | Search | Deferred until content exists | A search over 1 lesson is a dead feature. |
| D12 | Ask the tutor (T7) | Keep, after Phase A | Already agreed in plan.md. Independent of this redesign. |
| D13 | Projects / Practice segmented control | Dropped; separate nav items | It duplicated the nav. |
| D14 | Build order | E0, then A, B, C, D, E | A working app first, with the most visible new feature (explorer) third. |

### What to build first, what to defer
- **First (E0 + Phase A):** the shell, the lesson page with the real editor, run, check,
  hints, resume, completion, the Learn page, and Today with real data. This is a
  testable app on its own.
- **Then:** Progress and Practice (B), the Explorer (C), and Projects (D).
- **Defer:** search, live `input()`, split-pane drag, the activity heatmap beyond 7
  days, and vendoring Pyodide.
