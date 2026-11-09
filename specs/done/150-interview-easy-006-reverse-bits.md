# 150: Interview problem easy 006 Reverse Bits
Files: content/interview/easy/006-reverse-bits.md
Severity: medium

## Problem
Easy order 6 (Reverse Bits, LeetCode 190) has no problem file yet. The format is in docs/interview-format.md.
The text below is the finished file, already checked, so this spec is a copy, not a design task.

## Required change
Create content/interview/easy/006-reverse-bits.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are. Change no other file.

````markdown
---
title: Reverse Bits
tier: easy
order: 6
leetcode: 190
url: https://leetcode.com/problems/reverse-bits/
companies: [Meta, Apple, Google]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number n from 0 to 2 ** 32 - 1. Write it as exactly 32 bits, with zeros in front where needed. Return the number those 32 bits make when read in reverse order.

::exercise
---
id: iv-easy-006
prompt: Write a function reverse_bits(n) that returns n with its 32 bits in reverse order.
starter: |
  # write your code below
  def reverse_bits(n):
      pass
hints:
  - n % 2 is the last bit of n, and n // 2 drops that bit.
  - Build the answer with result * 2 + bit, exactly 32 times, so leading zeros count too.
tests:
  - check: assert reverse_bits(0) == 0
  - check: assert reverse_bits(1) == 2147483648
  - check: assert reverse_bits(2) == 1073741824
  - check: assert reverse_bits(43261596) == 964176192
  - check: assert reverse_bits(4294967293) == 3221225471
  - check: assert reverse_bits(4294967295) == 4294967295
solution: |
  def reverse_bits(n):
      result = 0
      for _ in range(32):
          result = result * 2 + n % 2
          n = n // 2
      return result
random:
  call: reverse_bits
  gen: |
    def gen(rng, size):
        return (rng.randint(0, 2 ** min(32, 3 * size + 2) - 1),)
wrong:
  - |
    def reverse_bits(n):
        result = 0
        while n > 0:
            result = result * 2 + n % 2
            n = n // 2
        return result
  - |
    def reverse_bits(n):
        result = 0
        for _ in range(31):
            result = result * 2 + n % 2
            n = n // 2
        return result
  - |
    def reverse_bits(n):
        return int(bin(n)[2:][::-1], 2)
---
::
````

## Acceptance gates
1. `grep -cF "id: iv-easy-006" content/interview/easy/006-reverse-bits.md` prints `1`
2. `grep -cF "same:" content/interview/easy/006-reverse-bits.md` prints `0`
3. `grep -cF "for _ in range(32):" content/interview/easy/006-reverse-bits.md` prints `1`
4. `grep -cF "for _ in range(31):" content/interview/easy/006-reverse-bits.md` prints `1`
5. `grep -cF "while n > 0:" content/interview/easy/006-reverse-bits.md` prints `1`
6. `wc -l content/interview/easy/006-reverse-bits.md` prints `63 content/interview/easy/006-reverse-bits.md`
7. Run by hand: `node scripts/check-interview.ts` prints a mutant line for 006-reverse-bits and ends with `interview ok`. If it names this file, send the PE the exact message. Do not patch it by hand. Then commit this file and this spec with the message "Interview: easy 006 Reverse Bits".
