---
title: Maximum Score After Splitting a String
tier: easy
order: 54
leetcode: 1422
url: https://leetcode.com/problems/maximum-score-after-splitting-a-string/
companies: [Google, Meta]
topic: Prefix sum
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 2 to 500 characters, and each character is 0 or 1. Split s into a left part and a right part, both non-empty, with the left part first. The score of a split is the number of 0s in the left part plus the number of 1s in the right part. Return the highest score you can get from any split.

::exercise
---
id: iv-easy-054
prompt: Write a function max_score(s) that returns the highest score from splitting the string s of 0s and 1s into a left part and a right part.
starter: |
  # write your code below
  def max_score(s):
      pass
hints:
  - Count the zeros on the left and the ones on the right, and move the split one character at a time.
  - Start with the total number of ones, and take away each one you move over to the left side.
tests:
  - check: assert max_score("011101") == 5
  - check: assert max_score("00111") == 5
  - check: assert max_score("1111") == 3
  - check: assert max_score("00") == 1
  - check: assert max_score("10") == 0
  - check: assert max_score("0101") == 3
solution: |
  def max_score(s):
      ones_total = s.count("1")
      zeros = 0
      ones_left = 0
      scores = []
      for i in range(len(s) - 1):
          if s[i] == "0":
              zeros += 1
          else:
              ones_left += 1
          scores.append(zeros + ones_total - ones_left)
      return max(scores)
brute: |
  def max_score(s):
      return max(s[:i].count("0") + s[i:].count("1") for i in range(1, len(s)))
random:
  call: max_score
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("01") for _ in range(rng.randint(2, size + 4))),)
wrong:
  - |
    def max_score(s):
        return max(s[:i].count("0") for i in range(1, len(s)))
  - |
    def max_score(s):
        return max(s[:i].count("0") + s[i:].count("1") for i in range(len(s) + 1))
---
::
