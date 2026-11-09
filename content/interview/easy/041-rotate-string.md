---
title: Rotate String
tier: easy
order: 41
leetcode: 796
url: https://leetcode.com/problems/rotate-string/
companies: [Google, Amazon, Meta]
topic: String matching
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get two strings, s and goal. Each has between 1 and 100 lowercase letters. Return True if goal can be made by moving some letters from the front of s to the back, keeping their order, in one piece. Return False otherwise. Moving no letters at all counts too, so goal equal to s returns True. Strings of different lengths never match.

::exercise
---
id: iv-easy-041
prompt: Write a function rotate_string(s, goal) that returns True if goal is a rotation of s, and False otherwise.
starter: |
  # write your code below
  def rotate_string(s, goal):
      pass
hints:
  - Try every point where s could be cut, and check whether the two pieces swapped make goal.
  - Joining s with itself puts every rotation inside it, but lengths must still match.
tests:
  - check: assert rotate_string("abcde", "cdeab") == True
  - check: assert rotate_string("abcde", "abced") == False
  - check: assert rotate_string("a", "a") == True
  - check: assert rotate_string("abc", "abc") == True
  - check: assert rotate_string("a", "aa") == False
  - check: assert rotate_string("ab", "ba") == True
  - check: assert rotate_string("abc", "acb") == False
  - check: assert rotate_string("aaab", "abaa") == True
solution: |
  def rotate_string(s, goal):
      return len(s) == len(goal) and goal in s + s
brute: |
  def rotate_string(s, goal):
      for k in range(len(s)):
          if s[k:] + s[:k] == goal:
              return True
      return False
random:
  call: rotate_string
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ab") for _ in range(rng.randint(1, size + 3)))
        if rng.random() < 0.5:
            k = rng.randrange(len(s))
            goal = s[k:] + s[:k]
        else:
            goal = "".join(rng.choice("ab") for _ in range(rng.randint(1, size + 3)))
        return (s, goal)
wrong:
  - |
    def rotate_string(s, goal):
        return goal in s
  - |
    def rotate_string(s, goal):
        return sorted(s) == sorted(goal)
  - |
    def rotate_string(s, goal):
        return goal in s + s
---
::
