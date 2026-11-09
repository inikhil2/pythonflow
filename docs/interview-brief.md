# Brief for interview problem developers

You write interview practice problems for PythonFlow, a CS50P practice app. The repo is
~/Desktop/AiderThings/cs50p-tutor. Princi, the principal engineer, reviews your work in batches.
Orca commits. You never commit, push, start servers or open a browser.

## Read first
- docs/interview-format.md: the file format and every rule. Read all of it.
- docs/interview-list.yml: the problem list. Each line gives number, slug, title, tier, order, topic, companies, needs.
  The key table at the top maps the `needs` keys to lesson paths.
- Two finished examples: content/interview/easy/011-best-time-to-buy-and-sell-stock.md (with `big`/`slow`)
  and content/interview/easy/082-reverse-linked-list.md (with `prelude: nodes`).

## What you write
One file per problem: content/interview/<tier>/NNN-slug.md, with NNN as the three-digit order.
Write only the orders you were given. Never edit any other file: not scripts, docs, app files,
or another developer's problems. If the checker or docs seem wrong, report it to Princi and do not fix it.

## Copyright
Never copy LeetCode's statement, examples' wording, or constraints text. Look at what the problem asks,
then write an original statement in your own words with your own story-free framing. Keep only the
number, title, difficulty, company tags and link in the frontmatter. You may use LeetCode's example
inputs and outputs as fixed tests (facts, not prose).

## Quality bar (none of this is optional)
- The statement states every input range, and says what to return for edge cases.
- Fixed tests: easy at least 5, medium at least 6, hard at least 8. Include LeetCode's examples,
  the smallest input, and the edge cases the statement names.
- `brute`: written from the statement in the plainest way, independently of `solution`.
- `random` with a `gen` whose every value is a valid input under the statement's ranges,
  and gives at least 50 distinct inputs.
- `wrong`: easy at least 2, medium and hard at least 3, each a mistake a learner really makes.
- Medium and hard: a `big` test and at least one `slow` solution, wherever a slower method is a
  real wrong answer (it almost always is at medium and hard). If you think a problem has no
  meaningful slow method, say so in your report with the reason.
- Linked list or tree input: `prelude: nodes` and `wrap:` as documented.
- `equivalent:` only with a real `# why:` reason. Never list a mutant as equivalent to get past a
  weak test; add the test instead.
  If the same mutant text survives on more than one line, the checker requires one entry per line,
  written `"<line>: <text>"`, each with its own reason.
- Quote any `check:` value that contains `: `.
- Never state a rule nothing checks. Examples: "don't convert to int", "reverse the existing nodes",
  "don't change the input" (the checker passes a copy). Put such ideas in a hint instead.
- Keep recursion depth at 500 or under: the stated ranges must not let a natural recursive answer go deeper.
- Wrong solutions are real learner mistakes, never random breaks, and never two that fail the same way.
- `big` and every fixed test must be valid inputs under the stated ranges. Write `big` at the stated maximum
  size, not past it. If the solution cannot pass a maximum-size input in the step limit, lower the stated range.
- `big`'s expected value must not come from running `solution` alone: use `brute` on the same input,
  a closed form, or an input built so the answer is known by design. `big` must contain `assert`.
  Preferred: a general deterministic input (seeded random or a formula), with the expected value
  computed once offline by running `brute` in plain python3, then hardcoded. Never make `big`
  degenerate just to get a closed form.
- `big` must make the intended solution pass on a general input (many distinct values), not only on a
  degenerate one that a shortcut skips through (e.g. all equal values).
- If more than one answer is correct, tests must accept every correct answer: check properties
  (length, set, sum, validity) or use `sorted(...)`, never one exact answer the statement does not force.
  A correct answer failing is as bad as a wrong answer passing.
- Easy problems also get `big` and `slow` when the obvious slower method (nested loops, repeated
  slicing or summing) is a real trap at the stated maximum size.
- The step limit counts only Python lines. A slow method written with builtins (`sum(nums[i:i+k])`,
  `x in list`, `list.index`, `.count`, repeated slicing) is not caught by steps alone. Choose the stated
  maximum (LeetCode-sized, often 10^5) so that such a version is also too slow, and add that builtin
  version as a second `slow:`. The checker's time limit is in: a slow version must run out of steps or
  take over 10 s, and the solution must run `big` in under 2 s. Window problems need n around 60000.
- Every slow version must do O(1) work per Python step (no slicing of huge strings or lists inside a
  loop): a run cannot be interrupted, so a slow that copies 10^5 items per step hangs the checker.
- Reword any example walkthrough in your own words; never reuse LeetCode's step-by-step text.

## Gate per file
`node scripts/check-interview.ts content/interview/<tier>/NNN-slug.md` must end with `interview ok: 1 problems`.
Check several at once by passing several paths. Run `node scripts/check-lessons.ts` once at the end.
Never use `pkill` or `killall`: other agents' checker runs match the same pattern. Stop only your own run, by exact PID.

## Report to Princi (SendMessage to team-lead) after each 10 problems, under 250 words
- Orders done, and the checker's last line for the whole set.
- Every brute/solution disagreement and how you resolved it (which side was wrong).
- Every `equivalent:` you added, with its reason.
- Any problem you think has no meaningful slow method, with the reason.
- Anything in the checker or docs that blocked you.
Then continue with the next 10 without waiting, but first finish every open fix list from Princi.
Fix lists always come before new problems. Report each fix by quoting the changed line.

## Binary search and other O(log n) problems
`no_slow` is never allowed when the intended answer is faster than linear. Use the many-queries form
(`f(nums, targets)` returning a list, about 20000 values and 20000 queries), so a linear scan per query runs out of steps.
If a binary-search file needs more than about 3 equivalents, the tests are too weak or the code is too clever:
simplify the loop (one standard `lo <= hi` form) instead of listing mutants.
