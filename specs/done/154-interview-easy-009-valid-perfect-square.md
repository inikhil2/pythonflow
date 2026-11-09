# 154: Interview problem easy 009 Valid Perfect Square
Files: content/interview/easy/009-valid-perfect-square.md
Severity: medium

## Problem
Easy order 9 (Valid Perfect Square, LeetCode 367) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/009-valid-perfect-square.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
---
title: Valid Perfect Square
tier: easy
order: 9
leetcode: 367
url: https://leetcode.com/problems/valid-perfect-square/
companies: [Google, Meta, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number num ≥ 1. Return True if num is a perfect square, meaning some whole number times itself equals num, and False otherwise. You may not use **, pow or math.

::exercise
---
id: iv-easy-009
prompt: Write a function is_perfect_square(num) that returns True when num is a whole number times itself, and False otherwise.
starter: |
  # write your code below
  def is_perfect_square(num):
      pass
hints:
  - Count i up from 1 while i * i is still smaller than num.
  - When the loop stops, num is a perfect square only if i * i equals it. Binary search is faster for huge numbers.
tests:
  - check: assert is_perfect_square(16) == True
  - check: assert is_perfect_square(14) == False
  - check: assert is_perfect_square(1) == True
  - check: assert is_perfect_square(2) == False
  - check: assert is_perfect_square(808201) == True
  - check: assert is_perfect_square(2147395600) == True
  - check: assert is_perfect_square(2147483647) == False
solution: |
  def is_perfect_square(num):
      i = 1
      while i * i < num:
          i += 1
      return i * i == num
random:
  call: is_perfect_square
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            i = rng.randint(1, 10 ** (size // 4 + 1))
            num = i * i + rng.choice([0, 0, -1, 1])
        else:
            num = rng.randint(1, 10 ** (size // 2 + 1))
        return (max(num, 1),)
wrong:
  - |
    def is_perfect_square(num):
        i = 1
        while i * i <= num:
            i += 1
        return i * i == num
  - |
    def is_perfect_square(num):
        i = 1
        while i * i < num:
            i += 2
        return i * i == num
  - |
    def is_perfect_square(num):
        for i in range(1, num // 2):
            if i * i == num:
                return True
        return False
equivalent:
  - i = 0  # why: 0 * 0 is below every num, so the loop steps i to 1 and goes on as before
---
::
````

## Acceptance gates
1. `grep -cF "id: iv-easy-009" content/interview/easy/009-valid-perfect-square.md` prints `1`
2. `grep -cF "same:" content/interview/easy/009-valid-perfect-square.md` prints `0`
3. `grep -cF "    while i * i < num:" content/interview/easy/009-valid-perfect-square.md` prints `2`
4. `grep -cF "        i += 2" content/interview/easy/009-valid-perfect-square.md` prints `1`
5. `grep -cF "  - i = 0  # why:" content/interview/easy/009-valid-perfect-square.md` prints `1`
6. `wc -l content/interview/easy/009-valid-perfect-square.md` prints `71 content/interview/easy/009-valid-perfect-square.md`
7. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 009-valid-perfect-square and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 009 Valid Perfect Square".
