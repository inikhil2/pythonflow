---
title: Remove K Digits
tier: medium
order: 21
leetcode: 402
url: https://leetcode.com/problems/remove-k-digits/
companies: [Amazon, Google, Microsoft]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a string `num` of 1 to 100000 digits, where each character is a digit from 0 to 9, and a whole number `k`, where 0 <= k <= len(num). Remove exactly k digits from `num`, keeping the others in their original order, so that the number left is as small as possible. Leading zeros in the result are dropped, and if nothing is left, the answer is `"0"`.

For example, `"1432219"` with k = 3 gives `"1219"`, and `"10200"` with k = 1 gives `"200"`. Think about the digits from left to right: a digit that is bigger than the digit after it is a good one to remove, because the smaller digit moves into its place.

::exercise
---
id: iv-medium-021
prompt: Write a function remove_k_digits(num, k) that returns the smallest number, as a string, left after removing exactly k digits from num.
starter: |
  # write your code below
  def remove_k_digits(num, k):
      pass
hints:
  - Keep a stack of digits. While the top digit is bigger than the new digit and you still have removals left, pop it.
  - If removals are still left after the scan, remove digits from the end, then drop leading zeros.
tests:
  - check: assert remove_k_digits("1432219", 3) == "1219"
  - check: assert remove_k_digits("10200", 1) == "200"
  - check: assert remove_k_digits("10", 2) == "0"
  - check: assert remove_k_digits("10", 1) == "0"
  - check: assert remove_k_digits("112", 1) == "11"
  - check: assert remove_k_digits("1234567", 3) == "1234"
  - check: assert remove_k_digits("4321", 2) == "21"
  - check: assert remove_k_digits("123", 0) == "123"
  - check: assert remove_k_digits("9", 1) == "0"
big: 'assert (lambda r: __import__("hashlib").sha256(remove_k_digits("".join(r.choice("0123456789") for _ in range(100000)), 50000).encode()).hexdigest())(__import__("random").Random(21)) == "5741a8c44f1685ed156fcb4387ed2b75c949c863f16538a87d4bfd4a7cce27c2"'
slow:
  - |
    def remove_k_digits(num, k):
        s = num
        for _ in range(k):
            i = 0
            while i + 1 < len(s) and s[i] <= s[i + 1]:
                i += 1
            s = s[:i] + s[i + 1:]
        return s.lstrip("0") or "0"
solution: |
  def remove_k_digits(num, k):
      stack = []
      for d in num:
          while k and stack and stack[-1] > d:
              stack.pop()
              k -= 1
          stack.append(d)
      while k:
          stack.pop()
          k -= 1
      return "".join(stack).lstrip("0") or "0"
brute: |
  def remove_k_digits(num, k):
      from itertools import combinations
      best = None
      for keep in combinations(range(len(num)), len(num) - k):
          t = "".join(num[i] for i in keep).lstrip("0") or "0"
          if best is None or (len(t), t) < (len(best), best):
              best = t
      return best
random:
  call: remove_k_digits
  gen: |
    def gen(rng, size):
        num = "".join(rng.choice("0123") for _ in range(rng.randint(1, 8)))
        return (num, rng.randint(0, len(num)))
wrong:
  - |
    def remove_k_digits(num, k):
        return num[:len(num) - k].lstrip("0") or "0"
  - |
    def remove_k_digits(num, k):
        stack = []
        for d in num:
            while k and stack and stack[-1] >= d:
                stack.pop()
                k -= 1
            stack.append(d)
        while k:
            stack.pop()
            k -= 1
        return "".join(stack).lstrip("0") or "0"
  - |
    def remove_k_digits(num, k):
        stack = []
        for d in num:
            while k and stack and stack[-1] > d:
                stack.pop()
                k -= 1
            stack.append(d)
        while k:
            stack.pop()
            k -= 1
        return "".join(stack) or "0"
---
::
