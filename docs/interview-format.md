# Interview problem format

An interview problem is one Markdown file under `content/interview/<tier>/`. It is served at
`/interview/<tier>/NNN-slug`, for example `/interview/easy/057-two-sum`. Problems never appear
under `/learn`. Copy `content/interview/easy/057-two-sum.md` and change it.

Pyodide runs the learner's code with the Python standard library only. Do not use
third-party packages, and do not call `input()` (tests use the `check` form below).

## File name and folder

- Folder: `easy`, `medium` or `hard`. It must equal the `tier` field.
- File name: `NNN-slug.md`. `NNN` is a 3-digit order within the tier (`057`, `012`, ...).
  The number must equal the `order` field. The slug is lowercase words joined by hyphens.
- Gaps in the order are allowed while a tier fills up. The number does not have to be consecutive.
  It must match `docs/interview-list.yml`, which numbers the problems.

## Frontmatter

```yaml
---
title: Two Sum
tier: easy
order: 57
leetcode: 1
url: https://leetcode.com/problems/two-sum/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---
```

Every field is required.

- `title`: The problem name. It is shown as the page heading. Use the usual problem name.
- `tier`: `easy`, `medium` or `hard`. Must match the folder.
- `order`: The number in the file name, as a plain integer (`57`, not `057`).
- `leetcode`: The LeetCode problem number, a positive integer. Unique across all problems.
- `url`: Must start with `https://leetcode.com/problems/` and end with `/`.
- `companies`: A non-empty list of company names, in square brackets. Up to 3 are shown in
  the list, so put the most common first.
- `topic`: The topic slug from `docs/interview-list.yml` in sentence case, with the hyphens
  turned into spaces. `hash-table` becomes `Hash table`, and `dynamic-programming` becomes
  `Dynamic programming`.
- `needs`: A list of lesson paths the learner should know first, for example
  `[/learn/week2-loops/04-dictionaries]`. Each path must match a lesson file:
  `/learn/<folder>/<file>` is `content/<folder>/<file>.md`. Use an empty list `[]` if none.

## Exercise id

The exercise id is `iv-<tier>-<NNN>`, using the same `NNN` as the file name:
`iv-easy-057`, `iv-medium-012`, `iv-hard-003`. Each problem has exactly one exercise.
The id is unique across all problems.

## Body

The body is an original statement of the problem, written in plain words:

1. One to three short paragraphs. Say what the function receives and returns, and any rule
   that matters. Maybe name one hint about the approach.
2. Then exactly one `::exercise` block.

Never copy LeetCode's text. Write every statement yourself. Do not start the body with a `#`
heading; the page shows the title.

## Exercise block

- `prompt`: One or two sentences. Name the function and what it returns, for example
  `Write a function two_sum(nums, target) that returns ...`.
- `starter`: A commented line and a `def` with `pass`. It must fail at least one test, so
  the starter must not return the right answer.
- `hints`: Optional, one to two items, each one sentence.
- `tests`: `check` tests, each one line:
  `- check: assert function_name(small_input) == expected`. Use small inputs. Do not use
  `stdin` or `stdout` for interview problems. The minimum depends on the tier:
  **easy 5, medium 6, hard 8**. There is no maximum.
- `solution`: A correct function with the same name. It must pass every test.
- `brute`: Required. A second answer key with the same name, written from the statement, not copied
  from `solution`. It is slow but obviously correct: it follows the definition literally, for example by
  trying every pair, building every option, or counting directly. It must use a different method from
  `solution`, and it must never call `solution`. The checker runs `brute` on every fixed test, and on
  the 200 random inputs it compares `brute` with `solution`. If the two disagree, one of them is wrong.
  A `brute` that hits the step limit on an input is skipped for that input only. If more than 50 of the
  200 inputs are skipped, the checker fails with `brute too slow`.
- `random`: Required. The checker runs the learner's function and `solution` on 200 generated inputs,
  so a mistake that the fixed tests miss still fails. The checker also compares `brute` with `solution`
  on those inputs. Three keys:
  - `call`: the function the learner writes. It must name a `def` in `solution`.
  - `gen`: Python code with `def gen(rng, size)`. It returns the argument tuple for one call, such as
    `(nums, target)`. `rng` is a `random.Random`. `size` goes from 0 up to 12: case i uses
    `min(i // 10, 12)`, so the small inputs come first and the first failure is a small one.
  - `same` (optional): `def same(args, got, want)` returns True when `got` is right for `args`. Use it
    only when more than one answer is correct. The default is `got == want`.

  - `wrap` (optional, needs `prelude: nodes`): names which call arguments `gen` returns as plain lists and
    the checker turns into nodes, and what the result is turned back into before it is compared.
    `args` has one entry per argument: `nodes` (a linked list, via `to_nodes`), `tree` (a binary tree, via
    `to_tree`), or `null` to pass that argument as it is. `result` is `nodes` or `tree` (via `from_nodes`
    or `from_tree`), and is left out when the function returns a plain value such as a number. Examples:
    list in, list out is `wrap: {args: [nodes], result: nodes}`; tree in, number out is `wrap: {args: [tree]}`.
    With `wrap`, `gen`, `same`, the comparison with `brute` and every failure message use plain lists.

  `gen` must return valid inputs only. Where the problem needs at least n items, use `max(size, n)`.
  Cover negatives, zero and duplicates where the problem allows them. Random values in a small range
  usually give all three.
- `random.min_distinct` (optional): lowers the rule that `gen` must give at least 50 distinct inputs in 200
  cases. Use it only where the whole valid input space is small, for example `num_rows` from 1 to 30. It must
  be a whole number of at least 1, and its line needs a `# why:` comment:
  `min_distinct: 30   # why: num_rows is 1 to 30, so there are only 30 inputs`. The checker prints the value it
  used as `NNN-slug: min_distinct: N`. If `gen` reaches fewer than N, the failure is the usual
  `gen gives too few distinct inputs (X of 200, need N)`.
  A value below 10 is allowed only if `gen` gives exactly that many distinct inputs in 200 cases, which proves the
  input space is used up; otherwise the checker rejects it.
- `valid` (optional for now): a Python function `def valid(*args) -> bool` that encodes the statement's input
  rules (ranges, sizes, forbidden shapes). The checker calls it on the arguments of every fixed test, of
  `big` and of every random case, and fails naming the input that broke the rules, for example
  `the solution fails test 8: AssertionError: input breaks the problem's rules (valid): max_profit([0, 1, 2, ...`.
  It receives the arguments the function receives, so with `prelude: nodes` it gets nodes, not lists. How it
  works: the checker wraps the solution's function so `valid` runs before it; only the outermost call is
  checked, so a recursive solution's inner calls are not. `valid` never reaches the page and is not mutated.
  Write it from the statement, not from the tests:

  ```yaml
  valid: |
    def valid(prices):
        return 1 <= len(prices) <= 100000 and all(0 <= p <= 10000 for p in prices)
  ```
- `random.driver` (optional): for a **class** problem (Min Stack, LRU Cache). `solution`, `brute`, `wrong` and
  `slow` are then complete classes, and fixed tests build one in a single line, for example
  `check: s = MinStack(); s.push(2); assert s.get_min() == 2`. The random check needs one function to call, so
  `driver` is Python that defines it, replaying operations on the learner's class by global name:

  ```yaml
  random:
    call: _pf_drive
    driver: |
      def _pf_drive(ops, args):
          s = MinStack()
          return [getattr(s, op)(*a) for op, a in zip(ops, args)]
    gen: |
      def gen(rng, size): ...   # returns (ops, args)
  ```

  `call` must name a `def` in the driver, not the solution. The driver runs next to the learner's code, the
  reference solution and `brute` (as a class), so all three are replayed the same way, and it is never
  mutated. `valid` then receives `(ops, args)`. Mutation testing, `wrong` and `slow` work as for functions.
  A `big` for a class should call the expensive method thousands of times, so a slow version runs out of steps.
- `big` (optional): one `check` line with a large input, such as
  `big: assert max_profit(list(range(20000))) == 19999`. Build the input with an expression, not a literal.
  `solution` must pass it within the checker's step limit (2,000,000 Python lines), and the page runs it as
  "Big input" after the fixed tests. Use it where a slow method is a real wrong answer: medium and hard
  problems, and any easy one with a classic O(n²) trap. Pick a size where a quadratic loop needs well over
  10 seconds in the browser, which is also far past the step limit.
- `slow` (optional, needs `big`): a list of complete solutions that are **correct but too slow**, as YAML
  block strings like `wrong`. Each must pass every fixed test and then run out of steps on `big`; the checker
  reports `slow solution N passes big` if it does not, and `fails big with a wrong answer` if it is wrong
  instead of slow. The page never shows `slow`.
- `no_slow` (medium and hard only): **every medium and hard problem must have `big` and at least one `slow`**
  solution, or the checker fails with `medium problems need a big test and at least one slow solution, or
  no_slow: "<reason>"`. The one way out is `no_slow: "<reason>"`, a non-empty string saying why no input can
  make a correct solution too slow (for example, the input is capped at a few dozen items). The checker prints
  the reason in its report as `NNN-slug: no_slow: <reason>`, so it is reviewed. `no_slow` and `slow` together
  are an error. Easy problems may use `big` and `slow` but do not need them.
- `wrong`: A list of **at least 2 for easy, 3 for medium and hard**. Each entry is a complete,
  plausible wrong solution, as a YAML block string (`- |`), of the kind a learner really writes.
  Good examples: an off-by-one, ignoring the empty or one-item input, mishandling duplicates or
  negatives, returning the first match instead of the right one, or checking only part of the
  condition. Never write a syntax error or `pass`; the starter already covers that.
  **Every wrong solution must fail at least one test.** The checker reports
  `wrong solution N passes every test; add a test that catches it` otherwise.
  The page never shows `wrong`; only the checker reads it.

## Time limit on `big` in the checker

The step limit counts only Python lines, so a slow method built on builtins (`sum(nums[i:i+k])` for every
window) passes it. `big` is therefore also timed in the checker, and the time is scaled to an idle machine: a
fixed benchmark runs before and after, and `REF_BENCH_MS` in `check-interview.ts` is its time on an idle
machine. The app stops a run at 10 seconds, so:

- `solution` must run `big` in at most 2 seconds (a fifth of 10), or the checker fails with
  `the solution takes N s on big; it must stay under 2 s`. The report shows `NNN-slug: big ran in X s of 2 s allowed`.
- A `slow` solution must run out of steps on `big` or take more than 10 seconds there. Otherwise the checker
  fails with `slow solution N passes big in X s; make big larger or the slow solution slower`.

Make `big` large enough that the C-level slow version takes over 10 seconds: for a window sum with `k` about
half of `n`, that is `n` of about 60000.

## Time limit in the app

The page stops any run after 10 seconds. A check case that is stopped shows "Too slow: your program ran for
more than 10 seconds and was stopped", with the input it was on. For the fixed tests and `big` that is the
`check` line (when it is a single short line). For the 200 random inputs it is the last generated call, such as
`is_perfect_square(1024)`: the random check posts each call to the page as it starts, because a stopped
run loses its output.

## Linked lists and trees (`prelude: nodes`)

A problem that takes list nodes or tree nodes sets `prelude: nodes` as a key of the `::exercise` block.
The checker and the app then run one shared prelude before the learner's code, `solution`, `brute`, every
`wrong` entry and every mutant. It is defined once, in `app/utils/nodePrelude.ts`, and gives:

- `ListNode(val, next)` and `TreeNode(val, left, right)`;
- `to_nodes(list)` and `from_nodes(head)`; `to_nodes([])` is `None`;
- `to_cycle(values, pos)`: builds the list and links the tail to the node at index `pos`; `pos` of -1 means no
  cycle. `to_shared(a, b, common)` returns `(head_a, head_b)`: two lists whose tails are the same node objects
  built from `common`, or two separate lists when `common` is `[]`;
- `Node(val, next, random)`, `to_random_list(pairs)` and `from_random_list(head)`, for a list with random
  pointers. `pairs` is `[[val, random_index_or_None], ...]`, and `from_random_list` returns the same form. It
  raises `the copy reuses a node of the original list; every node must be new` if any node of the result is a
  node `to_random_list` made, so a shallow copy fails. This works because `to_random_list` keeps its nodes in
  a `WeakSet`: the set drops freed nodes, so a new node never matches a stale id. Call `from_random_list` on
  the learner's result, never on the input itself;
- `to_tree(list)` and `from_tree(root)`: LeetCode level order, `None` for a missing child, trailing `None`s
  left out; `to_tree([])` is `None`. `from_tree(to_tree([3, 9, 20, None, None, 15, 7]))` gives the same list.

In `random.wrap`, the argument kinds are `nodes`, `tree`, `cycle` (the argument is `[values, pos]`), `random`
(the argument is `pairs`) and `shared` (the argument is `[a, b, common]` and becomes two arguments), and the
result kinds are `nodes`, `tree`, `random` and `index`. With `index` the function returns a node or `None`, and
the check compares that node's position in the first argument's list (`None` when it returns `None`; a node that is not in that list gives the text `a node not in the first list`), so a
node with the right value but from another list fails. The random check deep-copies the plain arguments from `gen`
before it builds nodes from them, so cycles and shared tails are built fresh for every call and the copy never
touches them.

Tests compare plain lists, for example `assert from_nodes(reverse_list(to_nodes([1, 2, 3]))) == [3, 2, 1]`.
The starter shows the node class as a comment. The prelude runs as its own file, so line numbers in error
messages and in `mutant survives (line N: ...)` refer to the learner's code or to `solution`. Mutants never
change the prelude. Problems without `prelude` run exactly as before. Copy `082-reverse-linked-list.md`
(lists) or `083-maximum-depth-of-binary-tree.md` (trees).

## Mutation testing

The checker makes one-site mutants of `solution` and requires each to fail a fixed test or the random
check. The sites are: `<` and `<=`, `>` and `>=`, `==` and `!=`, `is` and `is not` (swapped); `and` and `or`; `+` and `-`;
an integer c changed to c+1 or c-1; `True` and `False`; a removed `not`; and `min` and `max`.

A mutant that survives fails the problem: `mutant survives (line N: ...)`. The checker lists **every**
survivor of the file in one run (one line each), then fails. Fix each by adding a test or by widening `gen`.
Only if the mutated line gives the same results as the solution, list it under `equivalent` with a `# why`
comment. The text is the **mutated** line, as the message prints it, and each entry is bound to one site by
the line number of `solution`:

```yaml
equivalent:
  - 7: lo = mid + 0   # why: mid + 0 is mid, so this line is unchanged
  - 9: lo = mid + 0   # why: same, on the second branch
```

`- 7: lo = mid + 0` is the YAML for the map `{7: "lo = mid + 0"}`; the checker reads it as "line 7, this
text". The line is the one in `survives (line N: ...)`. A bare entry without a line (`- lo = mid + 0`) still
works while it excuses survivors on one line, but fails with `equivalent "..." excuses survivors on lines 7,
9; list each as "<line>: ..."` as soon as it would excuse two lines. Changing `solution` so lines move means
renumbering the entries; an entry that no longer matches excuses nothing, and the survivor shows up again.

A mutant that runs more than 2,000,000 Python lines counts as killed, since the app would stop it at 10 seconds.

The checker prints the number of mutants each problem kills, for example `057-two-sum: 2 mutants killed`.

## What the tests must cover

Check each item before you write the tests. The tests are what stop a half-right answer from passing.

- The normal case, with a clear answer.
- The smallest input the problem allows (an empty or one-item input, where valid).
- Duplicates, where the values can repeat.
- Negatives or zero, where valid.
- The boundary of every condition: a value exactly equal to the target, a bracket exactly
  at the end, and so on.
- One case where the answer is at the very start or the very end of the input.
- LeetCode's own example cases, copied from the LeetCode problem. Those answers are known to be right,
  so they are the one check that does not depend on `solution` or `brute`.

## Example: 057 (copy this shape)

````markdown
---
title: Two Sum
tier: easy
order: 57
leetcode: 1
url: https://leetcode.com/problems/two-sum/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list of whole numbers and one target number. Find two different positions in the list whose values add up to the target. Return any such pair of positions as a list, with the smaller position first.

An input may have more than one such pair, so any valid pair is correct. You may not use the same position twice. A plain pair of loops works, but it checks every pair. A dictionary that remembers the positions you have already seen finds the partner in one step.

::exercise
---
id: iv-easy-057
prompt: Write a function two_sum(nums, target) that returns the positions of two values that add up to the target, as a list. Return any such pair.
starter: |
  # write your code below
  def two_sum(nums, target):
      pass
hints:
  - For each number, the partner you need is target minus that number.
  - Store each number and its position in a dictionary as you go, so you can look up a partner quickly.
tests:
  - check: assert two_sum([2, 7, 11, 15], 9) == [0, 1]
  - check: assert two_sum([3, 2, 4], 6) == [1, 2]
  - check: assert two_sum([3, 3], 6) == [0, 1]
  - check: assert two_sum([1, 5, 8], 13) == [1, 2]
  - check: assert two_sum([4, 9, 2, 3], 7) == [0, 3]
  - check: assert two_sum([-3, 4, 3, 90], 0) == [0, 2]
  - check: assert two_sum([1, 2, 3, 9], 12) == [2, 3]
solution: |
  def two_sum(nums, target):
      seen = {}
      for i, n in enumerate(nums):
          if target - n in seen:
              return [seen[target - n], i]
          seen[n] = i
brute: |
  def two_sum(nums, target):
      for i in range(len(nums)):
          for j in range(i + 1, len(nums)):
              if nums[i] + nums[j] == target:
                  return [i, j]
random:
  call: two_sum
  gen: |
    def gen(rng, size):
        nums = [rng.randint(-10, 10) for _ in range(max(size, 2))]
        i, j = sorted(rng.sample(range(len(nums)), 2))
        return (nums, nums[i] + nums[j])
  same: |
    def same(args, got, want):
        nums, target = args
        return (
            isinstance(got, list) and len(got) == 2 and 0 <= got[0] < got[1] < len(nums)
            and nums[got[0]] + nums[got[1]] == target
        )
wrong:
  - |
    def two_sum(nums, target):
        for i in range(len(nums)):
            for j in range(len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
  - |
    def two_sum(nums, target):
        for i in range(len(nums) - 1):
            if nums[i] + nums[i + 1] == target:
                return [i, i + 1]
---
::
````

## Checking a new problem

Run `node scripts/check-interview.ts` from `cs50p-tutor/`. Name files to check only those:
`node scripts/check-interview.ts content/interview/medium/001-reverse-integer.md`. The checker runs a pool of
worker threads (the smaller of the file count and CPU count minus 2), each with its own Pyodide, over the files and their mutants. Results
print in file order, and the first failure is the same one a sequential run would report. Each worker takes
about 3 seconds to start, so a single small file gains nothing; a long run gains the most. It prints `interview ok: N problems`
when every rule above holds. Otherwise it exits with an error that names the file.

Environment overrides: `CHECK_JOBS` sets the worker count (default above), `CHECK_MUTANT_S` the seconds before a hung mutant counts as killed (default 20), and `CHECK_FILE_S` the seconds before a hung file fails with `no answer after N s` (default 120). `CHECK_WRONG_S` (default 10) and `CHECK_SLOW_S` (default 15) cap each `wrong` and each `slow` run on `big`; a solution killed at its cap counts as failing `big`, and a wrong needs at least one that fails by output. `CHECK_TIMING=1` prints each phase's seconds to stderr.
