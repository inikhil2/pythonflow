---
title: Count Binary Substrings
tier: easy
order: 55
leetcode: 696
url: https://leetcode.com/problems/count-binary-substrings/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 1 to 100000 characters, each 0 or 1. Count the substrings that have equal numbers of 0s and 1s, where all the 0s come together and all the 1s come together. Each occurrence counts, even when two occurrences have the same text. Return the count.

::exercise
---
id: iv-easy-055
prompt: Write a function count_binary_substrings(s) that returns how many substrings have equal counts of 0 and 1, with each kind grouped together.
starter: |
  # write your code below
  def count_binary_substrings(s):
      pass
hints:
  - Break s into runs of the same character, such as 00, then 1, then 0.
  - Each pair of neighbouring runs gives the smaller of their two lengths in matching substrings.
tests:
  - check: assert count_binary_substrings("00110011") == 6
  - check: assert count_binary_substrings("10101") == 4
  - check: assert count_binary_substrings("00110") == 3
  - check: assert count_binary_substrings("0") == 0
  - check: assert count_binary_substrings("01") == 1
  - check: assert count_binary_substrings("0011") == 2
  - check: assert count_binary_substrings("00100") == 2
big: assert count_binary_substrings("".join(("0" if i % 2 == 0 else "1") * ((i * 7919) % 19 + 1) for i in range(20000))[:100000]) == 68409
solution: |
  def count_binary_substrings(s):
      runs = []
      count = 1
      for i in range(1, len(s)):
          if s[i] == s[i - 1]:
              count += 1
          else:
              runs.append(count)
              count = 1
      runs.append(count)
      return sum(min(a, b) for a, b in zip(runs, runs[1:]))
brute: |
  def count_binary_substrings(s):
      n = len(s)
      total = 0
      for i in range(n):
          for j in range(i + 2, n + 1, 2):
              t = s[i:j]
              k = len(t) // 2
              if t == "0" * k + "1" * k or t == "1" * k + "0" * k:
                  total += 1
      return total
random:
  call: count_binary_substrings
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("01") for _ in range(rng.randint(1, size + 5))),)
slow:
  - |
    def count_binary_substrings(s):
        total = 0
        for i in range(len(s)):
            zeros = 0
            ones = 0
            changes = 0
            for j in range(i, len(s)):
                if s[j] == "0":
                    zeros += 1
                else:
                    ones += 1
                if j > i and s[j] != s[j - 1]:
                    changes += 1
                if changes == 1 and zeros == ones:
                    total += 1
        return total
wrong:
  - |
    def count_binary_substrings(s):
        return sum(1 for i in range(len(s) - 1) if s[i] != s[i + 1])
  - |
    def count_binary_substrings(s):
        runs = []
        count = 1
        for i in range(1, len(s)):
            if s[i] == s[i - 1]:
                count += 1
            else:
                runs.append(count)
                count = 1
        runs.append(count)
        return sum(max(a, b) for a, b in zip(runs, runs[1:]))
---
::
