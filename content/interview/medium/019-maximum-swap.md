---
title: Maximum Swap
tier: medium
order: 19
leetcode: 670
url: https://leetcode.com/problems/maximum-swap/
companies: [Meta, Google, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers, /learn/week0-functions/04-strings]
---

You get a whole number `num`, where 0 <= num <= 100000000. You may swap the positions of two of its digits, at most once, and you do not have to swap at all. Return the largest number you can make this way.

Look at the digits from left to right. The first digit that has a bigger digit somewhere after it is the one to change. Swap it with the bigger digit, and if that digit appears more than once after it, use the last copy, because moving the last copy changes the number the least. For example, 98368 becomes 98863, and 1993 becomes 9913.

::exercise
---
id: iv-medium-019
prompt: Write a function maximum_swap(num) that returns the largest number that can be made by swapping at most two digits of num.
starter: |
  # write your code below
  def maximum_swap(num):
      pass
hints:
  - Record where each digit last appears, then scan from the left for the first digit that has a bigger digit after it.
  - Swap that digit with the bigger digit's last position, and stop after the first swap.
tests:
  - check: assert maximum_swap(2736) == 7236
  - check: assert maximum_swap(9973) == 9973
  - check: assert maximum_swap(98368) == 98863
  - check: assert maximum_swap(1993) == 9913
  - check: assert maximum_swap(0) == 0
  - check: assert maximum_swap(9) == 9
  - check: assert maximum_swap(10) == 10
  - check: assert maximum_swap(1111) == 1111
  - check: assert maximum_swap(100000000) == 100000000
no_slow: "num has at most 9 digits, so trying every pair of digit positions is quick and gives the same answers; a slower method is never a wrong answer here."
solution: |
  def maximum_swap(num):
      digits = list(str(num))
      last = {int(d): i for i, d in enumerate(digits)}
      for i, d in enumerate(digits):
          for bigger in range(9, int(d), -1):
              if last.get(bigger, -1) > i:
                  j = last[bigger]
                  digits[i], digits[j] = digits[j], digits[i]
                  return int("".join(digits))
      return num
brute: |
  def maximum_swap(num):
      s = str(num)
      best = num
      for i in range(len(s)):
          for j in range(i + 1, len(s)):
              t = list(s)
              t[i], t[j] = t[j], t[i]
              best = max(best, int("".join(t)))
      return best
random:
  call: maximum_swap
  gen: |
    def gen(rng, size):
        return (rng.randint(0, 99999),)
wrong:
  - |
    def maximum_swap(num):
        digits = list(str(num))
        first = {}
        for i, d in enumerate(digits):
            first.setdefault(int(d), i)
        for i, d in enumerate(digits):
            for bigger in range(9, int(d), -1):
                if first.get(bigger, -1) > i:
                    j = first[bigger]
                    digits[i], digits[j] = digits[j], digits[i]
                    return int("".join(digits))
        return num
  - |
    def maximum_swap(num):
        digits = list(str(num))
        for i in range(len(digits) - 1):
            if digits[i + 1] > digits[i]:
                digits[i], digits[i + 1] = digits[i + 1], digits[i]
                break
        return int("".join(digits))
  - |
    def maximum_swap(num):
        digits = list(str(num))
        for i in range(len(digits)):
            rest = digits[i + 1:]
            if rest and max(rest) > digits[i]:
                j = digits.index(max(rest), i + 1)
                digits[i], digits[j] = digits[j], digits[i]
                break
        return int("".join(digits))
equivalent:
  - "if last.get(bigger, -1) >= i:"  # why: bigger is larger than the digit at position i, so the last position of bigger can never equal i
  - "if last.get(bigger, -0) > i:"  # why: a missing digit defaults to 0, and 0 is never above i, which is at least 0
  - "if last.get(bigger, -2) > i:"  # why: a missing digit defaults to -1 or -2, and both are below every index i, which is at least 0
  - "for bigger in range(10, int(d), -1):"  # why: no digit is 10, so last.get(10, -1) is always -1 and never passes the check
---
::
