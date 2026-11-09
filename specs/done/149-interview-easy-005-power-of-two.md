# 149: Interview problem easy 005 Power of Two
Files: content/interview/easy/005-power-of-two.md
Severity: medium

## Problem
Easy order 5 (Power of Two, LeetCode 231) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/005-power-of-two.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
---
title: Power of Two
tier: easy
order: 5
leetcode: 231
url: https://leetcode.com/problems/power-of-two/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n, which may be zero or negative. Return True if n is a power of two (1, 2, 4, 8 and so on), and False otherwise.

::exercise
---
id: iv-easy-005
prompt: Write a function is_power_of_two(n) that returns True when n is a power of two, and False otherwise.
starter: |
  # write your code below
  def is_power_of_two(n):
      pass
hints:
  - Zero and negative numbers are never powers of two.
  - Keep dividing by 2 while n is even. A power of two ends at 1.
tests:
  - check: assert is_power_of_two(1) == True
  - check: assert is_power_of_two(16) == True
  - check: assert is_power_of_two(3) == False
  - check: assert is_power_of_two(0) == False
  - check: assert is_power_of_two(-8) == False
  - check: assert is_power_of_two(6) == False
  - check: assert is_power_of_two(2 ** 40) == True
solution: |
  def is_power_of_two(n):
      if n < 1:
          return False
      while n % 2 == 0:
          n = n // 2
      return n == 1
random:
  call: is_power_of_two
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            n = 2 ** rng.randint(0, 3 * size + 2)
            n = n + rng.choice([0, 0, -1, 1])
        else:
            n = rng.randint(-10, 2 ** (size + 3))
        return (n,)
wrong:
  - |
    def is_power_of_two(n):
        return n % 2 == 0
  - |
    def is_power_of_two(n):
        if n < 1:
            return False
        return n % 2 == 0 or n == 1
  - |
    def is_power_of_two(n):
        if n < 1:
            return False
        while n % 2 == 0:
            n = n // 2
        return True
---
::
````

## Acceptance gates
1. `grep -cF "id: iv-easy-005" content/interview/easy/005-power-of-two.md` prints `1`
2. `grep -cF "same:" content/interview/easy/005-power-of-two.md` prints `0`
3. `grep -cF "    while n % 2 == 0:" content/interview/easy/005-power-of-two.md` prints `2`
4. `grep -cF "return n % 2 == 0 or n == 1" content/interview/easy/005-power-of-two.md` prints `1`
5. `wc -l content/interview/easy/005-power-of-two.md` prints `67 content/interview/easy/005-power-of-two.md`
6. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 005-power-of-two and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 005 Power of Two".
