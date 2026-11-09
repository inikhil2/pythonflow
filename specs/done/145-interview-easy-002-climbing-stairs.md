# 145: Rewrite interview problem easy 002 so check-interview passes
Files: content/interview/easy/002-climbing-stairs.md
Severity: high

## Problem
Spec 143 tried to fix three files in one pass and failed, so the fix is now one file per spec.
The solution's `if n == 2: return 2` branch is redundant, so the mutant `if n == 1: return 2`
would survive mutation testing. The `same` block is not needed: there is one right answer.

## Required change
Replace the whole of content/interview/easy/002-climbing-stairs.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are.

````markdown
---
title: Climbing Stairs
tier: easy
order: 2
leetcode: 70
url: https://leetcode.com/problems/climbing-stairs/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a number of steps n from 1 to 70. You can climb 1 or 2 steps at a time. Return the number of different ways to reach the top.

::exercise
---
id: iv-easy-002
prompt: Write a function climb_stairs(n) that returns the number of ways to climb n steps, taking 1 or 2 steps at a time.
starter: |
  # write your code below
  def climb_stairs(n):
      pass
hints:
  - Keep the last two counts in a loop.
  - climb_stairs(1) = 1, climb_stairs(2) = 2.
tests:
  - check: assert climb_stairs(1) == 1
  - check: assert climb_stairs(2) == 2
  - check: assert climb_stairs(3) == 3
  - check: assert climb_stairs(5) == 8
  - check: assert climb_stairs(10) == 89
  - check: assert climb_stairs(45) == 1836311903
solution: |
  def climb_stairs(n):
      prev2, prev1 = 1, 1
      for _ in range(n - 1):
          prev2, prev1 = prev1, prev1 + prev2
      return prev1
random:
  call: climb_stairs
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 5 * size + 10)
        return (n,)
wrong:
  - |
    def climb_stairs(n):
        return n
  - |
    def climb_stairs(n):
        if n == 1:
            return 1
        if n == 2:
            return 2
        prev2 = 1
        prev1 = 2
        for i in range(3, n + 2):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        return prev1
  - |
    def climb_stairs(n):
        if n == 1:
            return 1
        if n == 2:
            return 1
        prev2 = 1
        prev1 = 1
        for i in range(3, n + 1):
            current = prev1 + prev2
            prev2 = prev1
            prev1 = current
        return prev1
---
::
````

## Acceptance gates
1. `grep -cF "prev2, prev1 = prev1, prev1 + prev2" content/interview/easy/002-climbing-stairs.md` prints `1`
2. `grep -cF "same:" content/interview/easy/002-climbing-stairs.md` prints `0`
3. `grep -cF "id: iv-easy-002" content/interview/easy/002-climbing-stairs.md` prints `1`
4. `wc -l content/interview/easy/002-climbing-stairs.md` prints `75 content/interview/easy/002-climbing-stairs.md`
5. Run by hand: `node scripts/check-interview.ts`. It must not name this file. (It stops at the first failing file, so a message about a later file is expected until 146 is done.) If it names this file, send the PE the exact message. Do not patch it by hand.
