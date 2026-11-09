# 153: Interview problem easy 008 Power of Three
Files: content/interview/easy/008-power-of-three.md
Severity: medium

## Problem
Easy order 8 (Power of Three, LeetCode 326) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/008-power-of-three.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
---
title: Power of Three
tier: easy
order: 8
leetcode: 326
url: https://leetcode.com/problems/power-of-three/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n, which may be zero or negative. Return True if n is a power of three (1, 3, 9, 27 and so on), and False otherwise.

::exercise
---
id: iv-easy-008
prompt: Write a function is_power_of_three(n) that returns True when n is a power of three, and False otherwise.
starter: |
  # write your code below
  def is_power_of_three(n):
      pass
hints:
  - Zero and negative numbers are never powers of three.
  - Keep dividing by 3 while n divides evenly. A power of three ends at 1.
tests:
  - check: assert is_power_of_three(1) == True
  - check: assert is_power_of_three(27) == True
  - check: assert is_power_of_three(9) == True
  - check: assert is_power_of_three(0) == False
  - check: assert is_power_of_three(-27) == False
  - check: assert is_power_of_three(45) == False
  - check: assert is_power_of_three(2) == False
  - check: assert is_power_of_three(3 ** 30) == True
solution: |
  def is_power_of_three(n):
      if n < 1:
          return False
      while n % 3 == 0:
          n = n // 3
      return n == 1
random:
  call: is_power_of_three
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            n = 3 ** rng.randint(0, 2 * size + 2)
            n = n + rng.choice([0, 0, -1, 1, 3])
        else:
            n = rng.randint(-10, 3 ** (size // 2 + 3))
        return (n,)
wrong:
  - |
    def is_power_of_three(n):
        return n % 3 == 0
  - |
    def is_power_of_three(n):
        if n < 1:
            return False
        return n % 3 == 0 or n == 1
  - |
    def is_power_of_three(n):
        return n > 0 and 3 ** 20 % n == 0
---
::
````

## Acceptance gates
1. `grep -cF "id: iv-easy-008" content/interview/easy/008-power-of-three.md` prints `1`
2. `grep -cF "same:" content/interview/easy/008-power-of-three.md` prints `0`
3. `grep -cF "    while n % 3 == 0:" content/interview/easy/008-power-of-three.md` prints `1`
4. `grep -cF "3 ** 20 % n == 0" content/interview/easy/008-power-of-three.md` prints `1`
5. `wc -l content/interview/easy/008-power-of-three.md` prints `64 content/interview/easy/008-power-of-three.md`
6. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 008-power-of-three and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 008 Power of Three".
