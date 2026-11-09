# Plan: CS50P Personal Tutor web app

Owner: main session (Sonnet 5.5). All code and content is written by Qwen agents
through aider. Sonnet plans, briefs, reviews, and validates against the gates below.

## Goal

A web app that teaches Python the way a personal tutor would, covering the full
CS50P syllabus (Harvard), with an in-browser "Run" feature that executes the
learner's code and shows the output.

## Redesign (2026-10-23): supersedes T4 to T8, T19 and parts of Decisions

The user approved the full scope of an Apple-style brief and the PythonFlow mock-up.
The principal engineer's `redesign/proposal.md` is the source of truth for screens,
data model, architecture, DESIGN.md and the task list, and its recommended defaults
(D1 to D14) are accepted. Where this file disagrees with it, the proposal wins.
Changes to the table below: Nuxt 4 not 3; the editor is CodeMirror 6 not a textarea;
`input()` stays a stdin box (live prompt deferred); the app is called PythonFlow.

Order: E0 (exemplars, written by the principal) -> Phase A core loop -> B concepts,
progress, practice -> C visual explorer -> D projects -> E settings, polish,
integration -> T7 Ask the tutor after Phase A -> content T9 to T18 in batches (first
batch is one lesson, then 3 lessons per batch, each reviewed before the next) -> T19.
Ship and commit after every phase. The task list with gates is section 7 of the proposal.

## Decisions (settled with the user)

| Topic | Decision |
|---|---|
| Framework | Nuxt 3, static generation (`nuxt generate`), Vue 3. User said "Next"; confirmed as Nuxt. |
| Design | Apple-style, from the installed `apple-design` skill. Distilled into `DESIGN.md` because Qwen cannot load skills. |
| Tutor | Static lessons in a warm tutor voice, plus an "Ask the tutor" box that calls live Qwen through llama-server. |
| Code runner | Pyodide in the browser (in a Web Worker). No server. `input()` becomes an inline prompt. `requests`/network lessons use mocked examples. |
| Content | Original lessons and exercises following the CS50P syllabus, attributed to CS50P, non-commercial. No copying of CS50 notes or problem sets. |
| Location | `~/Desktop/AiderThings/cs50p-tutor/` (git root, so Qwen's work is committed). |
| Progress | Browser `localStorage`. No accounts, no backend. |
| Agents | Pure Qwen via aider (`--model openai/qwen`, no architect). One tmux window per agent. At most 2 agents at once. |

## Defaults I chose (not asked; change any of these)

- Editor is a plain `<textarea>` in a monospace font, not CodeMirror. Add CodeMirror later only if it feels bad.
- Exercise checking: each exercise has test cases (`stdin` -> expected `stdout`). The page runs the learner's code in Pyodide once per case and shows pass/fail per case.
- Lessons are Markdown files with frontmatter, loaded with `@nuxt/content`. No custom CMS.
- The "Ask the tutor" box sends the lesson text and the learner's code to `http://127.0.0.1:8080/v1/chat/completions` (model `qwen`). If the server is unreachable it shows a friendly "tutor is offline" message and the rest of the app still works.
- Desktop browsers first. Mobile layout must not break, but is not polished.

## Curriculum (CS50P weeks -> lesson files)

Each week is a folder `content/weekN-name/`. Each lesson is one short `.md` file.

0. Functions, variables: hello world, variables, `input`, strings, f-strings, ints/floats, defining functions, return values
1. Conditionals: `if/elif/else`, comparison, boolean logic, `match`
2. Loops: `while`, `for`, lists, `len`, `range`, dictionaries
3. Exceptions: `try/except`, `else`, `raise`, validating input
4. Libraries: `random`, `statistics`, `sys`/`argv`, packages, APIs (mocked), writing your own modules
5. Unit tests: `assert`, `pytest`, testing for exceptions, test layout
6. File I/O: `open`, `with`, reading/writing, CSV, binary basics
7. Regular expressions: `re.search`, `match`, `fullmatch`, groups, `sub`, validating formats
8. Object-oriented programming: classes, `self`, `__init__`, `__str__`, properties, class methods, inheritance, operator overloading
9. Et cetera: type hints, docstrings, `argparse`, unpacking, `*args`/`**kwargs`, `map`/`filter`, comprehensions, generators, `set`, constants, `global`

Roughly 50 lessons. A lesson is about 60 to 120 lines of Markdown.

## Lesson file format

```
---
title: Conditionals: if, elif, else
week: 1
order: 2
---
Tutor-voice explanation with short sections and worked examples.

::exercise
id: w1-l2-ex1
prompt: Ask for a number and print "even" or "odd".
starter: |
  n = int(input())
tests:
  - stdin: "4"
    stdout: "even"
::
```

The exact exercise syntax is fixed in task T2 and then frozen. Content tasks must not invent new fields.

## Working rules for the Qwen agents

- One task per aider session, one session per tmux window (`tmux new-window -n <agent-name>`).
- Launch: `aider --model openai/qwen --no-show-model-warnings --read DESIGN.md --read plan.md` with `OPENAI_API_BASE=http://127.0.0.1:8080/v1` and `OPENAI_API_KEY=local`, from `~/Desktop/AiderThings/cs50p-tutor`.
- Before the first parallel run, restart llama-server with `--parallel 2` (about 16k context per slot). Tasks must fit: name the files, give exact behavior, keep each change under about 150 lines.
- Sonnet briefs each task with only what it needs, then reads the resulting commit.
- Fail twice on the same gate: stop and tell the user. Sonnet does not write the code.

## Tasks and gates

Gates are checked by Sonnet by reading the diff and running the stated command. A task is not done until its gates pass.

**T0. Scaffold.** Create the Nuxt 3 project in `cs50p-tutor/`, add `@nuxt/content`, set `ssr: true` with static preset.
- Gate: `npm run generate` exits 0.
- Gate: `npm run dev` serves a page at `http://localhost:3000`.

**T1. DESIGN.md** (written by Sonnet, not Qwen: it is a planning document). Short rules from `apple-design`: type scale, spacing, color tokens for light and dark, motion rules, reduced-motion.
- Gate: under 120 lines, concrete values, no prose essays.

**T2. Lesson schema and one sample lesson.** Define the exercise syntax, a Vue component that renders it, and `content/week0-functions/01-hello.md`.
- Gate: the sample lesson renders at its URL with explanation text and one exercise box.
- Gate: the schema is documented in `docs/lesson-format.md`.

**T3. Pyodide runner.** A composable plus Web Worker: run code, capture stdout/stderr, feed `input()` from supplied lines or an inline prompt, stop on a timeout (10 seconds) and by a Stop button.
- Gate: `print("hi")` shows `hi`.
- Gate: `while True: pass` is stopped by the timeout and the page stays responsive.
- Gate: `input()` receives the supplied stdin.
- Gate: a syntax error shows a readable error message.

**T4. Code editor + Run panel.** Textarea editor, Run and Stop buttons, output area, tab key inserts four spaces.
- Gate: type code, press Run, see the output.

**T5. Lesson page, sidebar, progress.** Route `/lessons/[...slug]`, a curriculum sidebar grouped by week, Previous/Next links, and a progress composable using `localStorage` that marks a lesson done when all of its exercises pass.
- Gate: completed state survives a page reload.
- Gate: sidebar order matches the `week` and `order` frontmatter.

**T6. Exercise checker.** Run the learner's code against each test case, compare stdout (trailing whitespace trimmed), show pass/fail per case with a diff for failures.
- Gate: correct sample solution passes all cases, wrong solution fails with a readable diff.

**T7. Ask the tutor.** Chat box component that sends lesson context plus the learner's code to llama-server, with a system prompt that keeps answers short, encouraging, and hint-first rather than full solutions.
- Gate: answers appear when llama-server is up.
- Gate: shows the offline message, with no crash, when it is down.

**T8. Apple styling pass.** Apply `DESIGN.md` across layout, typography, buttons, sidebar, editor, and transitions. Light and dark mode. Respect `prefers-reduced-motion`.
- Gate: Sonnet checks every rule in `DESIGN.md` against the code.
- Gate: both color schemes render without unreadable text.

**T9 to T18. Content, one task per week (weeks 0 to 9).** The lesson-writer agent writes the lesson files for one week. The exercise-writer agent adds exercises with test cases for that week.
- Gate per week: every lesson in the curriculum list for that week exists and follows the frozen format.
- Gate per week: every exercise's reference solution passes its own test cases (the exercise-writer includes a `solution` field that the checker can run).
- Gate per week: no text copied from CS50 materials; Sonnet spot-checks voice and correctness.
- Gate per week: weeks 4 (APIs) and 6 (files) use only features Pyodide supports.

**T19. Integration.** Home page, about/attribution page crediting CS50P, 404 page, final full build.
- Gate: `npm run generate` exits 0 and the generated site works when served statically.
- Gate: Sonnet clicks through week 0 end to end: read a lesson, run code, pass an exercise, see progress saved.

## Order

T0 -> T1 and T2 together -> T3 and T4 together -> T5 and T6 together -> T7 -> T8 -> T9 to T18 two at a time -> T19.

Content tasks T9 to T18 only start after the format (T2) and checker (T6) are frozen and reviewed.

## Risks

- Qwen 9B quality on long lessons: mitigated by one lesson file per prompt, Sonnet review of every file.
- Nuxt build chain complexity for a small model: mitigated by small file-scoped tasks and by running the build as a gate after each task.
- 16k context per parallel slot: tasks that need more files than fit get split.
- Pyodide first load is large (several MB): acceptable; show a "loading Python" state.

## Phase 2 (2026-10-31): theme toggle and Interview track

Settled with the user on 2026-10-31 (all recommendations accepted).

Goal: (1) a Light / Dark / System toggle at the top of every page; (2) an Interview track of about 100 easy, 100 medium and 100 hard problems from and around MAANG companies, solved in Python in the in-browser runner, ordered by rising complexity and linked to the lessons they need.

Decisions:
- Never copy LeetCode text. Each problem has its own original statement, starter, hints, tests and solution, plus the LeetCode number, title, difficulty, company tags and a link.
- The problem list comes from the user's logged-in LeetCode tab, read only (titles, difficulty, company tags). No solving, submitting or changes. If company tags are hidden, use Blind 75, Grind 75 and NeetCode 150.
- A new Interview section (`/interview`) with Easy, Medium and Hard tiers. Each problem names the lesson it needs, and each lesson page ends with "Practice from this lesson" links to problems.
- Week 10 adds 3 to 4 short lessons (recursion, heaps and sorting with keys, BFS and DFS, dynamic programming, binary search). Easy problems stay within weeks 0 to 9. Medium and hard problems come after week 10.
- Build in batches of about 25. Easy first. The user reviews the first batch before the rest.
- Theme toggle: three-way control (sun, moon, monitor icons), top right of every page and in the mobile bar at 406 wide. Saved in the browser, default System. Princi writes it as its own specs.
- Problem tests use small inputs and are not performance tests. The runner's 10 s timeout stays.

Tasks and gates:

**P1. Theme toggle.** `useTheme` composable, `ThemeToggle.vue`, a CSS override so a saved choice beats the OS setting (the build turns `light-dark()` into `--lightningcss-light` and `--lightningcss-dark` switches), an early script so there is no flash, DESIGN.md note.
- Gate: choosing Light, Dark or System changes the page at once and survives a reload.
- Gate: System follows the OS again; no console errors; works at 406 and 1360 wide; `npx nuxi typecheck` exits 0.

**P2. Interview format and pages.** Content folder `content/interview/<tier>/NNN-slug.md` with frontmatter (title, tier, leetcode number and url, companies, topic, needs) and the existing `::exercise` syntax. Pages `/interview` and `/interview/<tier>/<slug>`, progress saved with the existing store, "Practice from this lesson" block on lesson pages, a checker `scripts/check-interview.ts`.
- Gate: the checker prints `interview ok: N problems` and fails on a missing field, a duplicate id, a `needs` lesson that does not exist, or a url that is not leetcode.com/problems/.
- Gate: a sample problem renders, runs and saves progress.
- Test rule (user, 2026-10-31: "I can't have wrong answers pass"): at least 5 tests for easy, 6 for medium and 8 for hard. Each exercise has a `wrong:` list of realistic wrong solutions (2 or more for easy, 3 or more for medium and hard), and the checker fails the problem if any wrong solution passes every test. The page never shows `wrong`.
- Sample problems follow docs/interview-list.yml numbering: `easy/012-valid-parentheses`, `easy/057-two-sum`. Gaps in a tier are allowed while it fills.

**P3. Solution runner script.** Dropped: `check-interview.ts` already runs every solution, starter and wrong solution in Pyodide, the same runtime as the app.

**P4. Problem list** (main session, from LeetCode read only): `docs/interview-list.yml` with about 300 entries (number, slug, title, tier, companies, topic, needs).
- Gate: 100 easy, 100 medium and 100 hard, no duplicate numbers, every `needs` names a real lesson.

**P5. Week 10 lessons.** Ten short lessons under `content/week10-algorithms/` in the existing lesson format, 1 or 2 exercises each, plus the weeks.yml entry. Expanded on 2026-10-31 (user approval relayed by Orca) so learners can solve most of the 300 problems. Each lesson is a CS50P-style walk-through of one pattern, with Python built-ins first (`sorted`, `collections.deque`, `heapq`, `bisect`), never a LeetCode copy.

| # | Slug | `needs` key | Covers | Sections inside |
|---|------|-------------|--------|-----------------|
| 01 | `01-two-pointers` | `twop` | two pointers, sliding window | |
| 02 | `02-stacks-and-queues` | `stack` | stack with a list, queue with `deque`, monotonic stack | |
| 03 | `03-prefix-sums-and-intervals` | `prefix` | running totals, sort-then-merge intervals | bit tricks (`&`, `|`, `^`, `<<`, `>>`) |
| 04 | `04-sorting-and-heaps` | `heap` | `sorted` with `key`, `heapq`, top-k | greedy |
| 05 | `05-binary-search` | `bs` | search a sorted list, search on the answer, `bisect` | |
| 06 | `06-recursion-and-backtracking` | `rec` | base case, call stack, choose-explore-undo | |
| 07 | `07-linked-lists` | `ll` | a node class, walking, reversing, fast and slow pointers | |
| 08 | `08-trees` | `tree` | binary tree node, recursive traversal, BST rules, level order | tries |
| 09 | `09-graphs` | `graph` | adjacency dict, BFS with `deque`, DFS, grids as graphs | |
| 10 | `10-dynamic-programming` | `dp` | from recursion to memo (`functools.cache`) to a table | |

Order reason: recursion (06) comes before linked lists, trees and graphs, which use it. Binary search (05) needs only loops, so it comes early. Each lesson's `needs` in `docs/interview-list.yml` points at `/learn/week10-algorithms/<slug>`. Easy problems still need only weeks 0 to 9.
- Decided (PE, 2026-10-31): linked-list and tree inputs. The checker and the app put one shared prelude before the learner's code: `ListNode(val, next)`, `TreeNode(val, left, right)`, `to_nodes(list)`, `from_nodes(head)`, `to_tree(list)` and `from_tree(root)`. Trees use LeetCode level order with `None` for gaps. Tests compare plain lists, e.g. `assert from_nodes(reverse_list(to_nodes([1, 2, 3]))) == [3, 2, 1]`. The `random` block gets an optional `wrap:` so `gen` returns plain lists. The starter shows the node class as a comment. One spec for the checker and the app, plus the format doc, lands before easy 81.
- Gate: `node scripts/check-lessons.ts` passes and every exercise solution passes in the browser.
- Gate: every `needs` key in docs/interview-list.yml resolves to an existing lesson file.

**Decisions taken by the PE (2026-10-31; the user handed all review decisions to the PE).**
- Pilot 001 to 003 accepted: checker passes, the browser pass covered all solutions, all wrong solutions and the chip on a fresh profile. The 1360-width check is dropped; at 1120 there is no horizontal overflow.
- Batch specs give the finished problem file, checked by the PE in Python first (solution passes, every wrong solution fails a test, `gen` gives at least 50 distinct inputs). Qwen copies; the checker's mutation test is the gate. One problem per spec, because three files in one pass failed (spec 143).
- Two Sum accepts either order (spec 151). Order-free answers use `sorted(...)` in tests and a matching `same`.
- Medium and hard get a speed test before P7: an optional `big:` test, a large input that the solution passes within the step limit and a listed `slow:` solution fails. The app stops a run after a few seconds and reports "too slow". Spec it before the first medium batch.
- Throughput (PE, 2026-11-01; the user asked for more speed with no weaker gates, and stricter medium and hard). Every gate stays on every problem. Medium and hard must have `big` and at least one `slow`, unless an explicit `no_slow:` reason is reviewed. Four Haiku problem developers write in parallel on separate order ranges: easy 026-060, easy 061-100, medium 001-050 and medium 051-100. Hard is split the same way once medium is done. A Sonnet reviewer checks originality, ranges, gen coverage, brute independence and equivalent reasons before the PE accepts. The checker takes file arguments and runs mutants in parallel. One tester and one browser. Developers report every 10 problems, the PE accepts in batches, and Orca commits explicit file lists.

**P6. Easy batches** (4 batches of about 25), **P7. Medium batches**, **P8. Hard batches**. One spec per problem (see the decisions above), to keep each Qwen task small.
- Gate per batch: `check-interview` passes for the new problems, the first problem of each spec passes in the browser, and the spec's grep gates print their expected numbers.

Order: P1 in parallel with P2 -> P4 -> P5 -> P6 (user reviews batch 1) -> P7 -> P8.

Risks: Qwen 9B writes wrong tests or solutions (the solver script and my review catch them); 300 problems is many hours of loop time (batching and the landing check limit the waste); some LeetCode problems need tools Pyodide lacks (skip them and choose a replacement); premium company tags may be hidden (fallback lists).

## Wrap-up and restart (2026-11-01)

Orca sends "wrap up" when /usage nears 95%. Princi then does the following:
1. Tell every writer to stop at the end of the file it is on. Nobody starts a new file, and every running checker batch finishes or is killed.
2. Send Orca the list of accepted batches. Orca commits each one with an explicit file list. Files that have not been accepted stay uncommitted on disk.
3. Fill in the restart note below: what is committed, what is on disk but not accepted, what is blocked, and each writer's range and next file.
4. The tester stops the server on port 3456 and leaves no temporary files in .output/public.
5. Close all teammates. Only Princi, Orca and the notes remain.

On restart, read this note, then the brief and the backlog in Princi's scratchpad. Copy both into the repo at wrap-up so they survive the restart: docs/interview-brief.md and docs/interview-backlog.md. Then start writers on their next files, and put fix lists first.

### Restart note (filled in at wrap-up)
- Committed: 136 problems before wrap-up, plus the checker (637810a, 5fec796) and the docs fix. At wrap-up, Princi sent Orca 87 accepted files, listed in the restart section of docs/interview-backlog.md. Check `git log` to see which went in; any that failed Orca's gate stay on disk.
- On disk, not accepted: everything under "Open fix lists" and "Status unknown" in docs/interview-backlog.md.
- Blocked: hard 021 (held). Parked: medium 006 and 035. Skipped: medium 082. Not written: easy 081. The old to_cycle, random-pointer and `driver:` blockers are resolved: those files now pass the checker.
- Waiting on the time limit: none. The time limit is in. The builtin slow backlog in docs/interview-backlog.md still applies, but only at LeetCode sizes; otherwise use a hint with a `# why`.
- First on restart: rerun the reviewer's size audit (every file against LeetCode's limits). It was cut off with nothing reported.
- Who writes (changed 2026-11-01 evening, by the user): no teammates or subagents. Qwen writes problem files through aider in ~/Desktop/AiderThings; Princi writes the specs and reviews; Orca gates and commits. Restart the llama-server and aider panes first if they're dead.
- Next work, in order (fix lists first, from docs/interview-backlog.md): the size audit; the five known oversize files; each per-file fix; hard 071–073 re-gate; the status-unknown files; then new problems: hard 018, 020, 022–025, 074–100.
- Checker: no features pending. Run a full sweep of the uncommitted files before the next commit batch.
