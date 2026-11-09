---
title: Maximum Nesting Depth of the Parentheses
tier: easy
order: 47
leetcode: 1614
url: https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/
companies: [Amazon, Google, Meta]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 2 to 100 characters, and each character is ( or ). The string is valid: every ( has a matching ), and the pairs nest properly. Return the largest number of ( that are open at the same moment as you read s from left to right.

::exercise
---
id: iv-easy-047
prompt: Write a function max_depth(s) that returns the largest nesting depth of the valid parentheses string s.
starter: |
  # write your code below
  def max_depth(s):
      pass
hints:
  - Add one each time you read an opening bracket, and take one away at each closing bracket.
  - Keep the largest count you reached.
tests:
  - check: assert max_depth("()") == 1
  - check: assert max_depth("(())") == 2
  - check: assert max_depth("(()())") == 2
  - check: assert max_depth("((()))") == 3
  - check: assert max_depth("()()()") == 1
  - check: assert max_depth("(((())))") == 4
  - check: assert max_depth("(()())()") == 2
solution: |
  def max_depth(s):
      depth = best = 0
      for ch in s:
          if ch == "(":
              depth += 1
              best = max(best, depth)
          else:
              depth -= 1
      return best
brute: |
  def max_depth(s):
      return max(s[:i].count("(") - s[:i].count(")") for i in range(len(s) + 1))
random:
  call: max_depth
  gen: |
    def gen(rng, size):
        pairs = rng.randint(1, min(size + 3, 40))
        chars = []
        opened = 0
        depth = 0
        while opened < pairs or depth > 0:
            if opened < pairs and (depth == 0 or rng.random() < 0.5):
                chars.append("(")
                opened += 1
                depth += 1
            else:
                chars.append(")")
                depth -= 1
        return ("".join(chars),)
wrong:
  - |
    def max_depth(s):
        return s.count("(")
  - |
    def max_depth(s):
        depth = 0
        for ch in s:
            depth += 1 if ch == "(" else -1
        return depth
---
::
