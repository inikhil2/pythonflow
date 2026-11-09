# 144: Rewrite interview problem easy 001 so check-interview passes
Files: content/interview/easy/001-palindrome-number.md
Severity: high

## Problem
Spec 143 tried to fix three files in one pass and failed, so the fix is now one file per spec.
Its random-input `gen` calls `int("")` when size is 0, so the solution fails the random check
("test 7"). It never builds a palindrome. Wrong solutions 1 and 3 are correct, so they fail no test.
The solution's `x < 0` guard is redundant, so the mutant `if x < -1:` would survive.

## Required change
Replace the whole of content/interview/easy/001-palindrome-number.md with exactly the text below, from the first `---` to the last `::`.
Copy it character for character. Keep the 2-space and 4-space indents as they are.

````markdown
---
title: Palindrome Number
tier: easy
order: 1
leetcode: 9
url: https://leetcode.com/problems/palindrome-number/
companies: [Google, Amazon, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]
---

You get a whole number and must decide if its digits read the same both ways. Negative numbers are never palindromes.

::exercise
---
id: iv-easy-001
prompt: Write a function is_palindrome(x) that returns True when the digits of x read the same both ways, and False otherwise.
starter: |
  # write your code below
  def is_palindrome(x):
      pass
hints:
  - Reverse the digits with % 10 and // 10 in a loop, then compare.
  - Negative numbers are never palindromes.
tests:
  - check: assert is_palindrome(121) == True
  - check: assert is_palindrome(-121) == False
  - check: assert is_palindrome(10) == False
  - check: assert is_palindrome(0) == True
  - check: assert is_palindrome(1221) == True
  - check: assert is_palindrome(12341) == False
solution: |
  def is_palindrome(x):
      original = x
      reversed_num = 0
      while x > 0:
          reversed_num = reversed_num * 10 + x % 10
          x = x // 10
      return original == reversed_num
random:
  call: is_palindrome
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            s = "".join(str(rng.randint(0, 9)) for _ in range(size // 2 + 1))
            x = int(s + s[::-1][rng.randint(0, 1):])
        else:
            x = rng.randint(0, 10 ** (size // 2 + 1))
        return (-x if rng.random() < 0.25 else x,)
wrong:
  - |
    def is_palindrome(x):
        x = abs(x)
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
  - |
    def is_palindrome(x):
        s = str(x)
        return s[0] == s[-1]
  - |
    def is_palindrome(x):
        if x % 10 == 0:
            return False
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
---
::
````

## Acceptance gates
1. `grep -cF "if x < 0" content/interview/easy/001-palindrome-number.md` prints `0`
2. `grep -cF "x = int(s + s[::-1][rng.randint(0, 1):])" content/interview/easy/001-palindrome-number.md` prints `1`
3. `grep -cF "x = abs(x)" content/interview/easy/001-palindrome-number.md` prints `1`
4. `grep -cF "same:" content/interview/easy/001-palindrome-number.md` prints `0`
5. `grep -cF "id: iv-easy-001" content/interview/easy/001-palindrome-number.md` prints `1`
6. `wc -l content/interview/easy/001-palindrome-number.md` prints `75 content/interview/easy/001-palindrome-number.md`
7. Run by hand: `node scripts/check-interview.ts`. It must not name this file. (It stops at the first failing file, so a message about a later file is expected until 146 is done.) If it names this file, send the PE the exact message. Do not patch it by hand.
