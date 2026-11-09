---
title: Remove Outermost Parentheses
tier: easy
order: 51
leetcode: 1021
url: https://leetcode.com/problems/remove-outermost-parentheses/
companies: [Google, Meta, Amazon]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 2 to 10000 brackets, each ( or ). The string is valid: every ( has a matching ), and the pairs nest properly. Read s from the start and keep a count of open brackets. Each time the count returns to 0, a piece ends there. From each piece, remove its first and last bracket, and join the middle parts in order. Return the joined result.

::exercise
---
id: iv-easy-051
prompt: Write a function remove_outermost(s) that removes the outer pair of brackets from each piece of the valid string s and returns the joined result.
starter: |
  # write your code below
  def remove_outermost(s):
      pass
hints:
  - Keep a count of open brackets, and skip the bracket that opens or closes a piece.
  - An opening bracket is outer when the count is 0 just before it, and a closing bracket is outer when the count is 0 just after it.
tests:
  - check: assert remove_outermost("(()())(())") == "()()()"
  - check: assert remove_outermost("()") == ""
  - check: assert remove_outermost("()()") == ""
  - check: assert remove_outermost("((()))") == "(())"
  - check: assert remove_outermost("(())()") == "()"
  - check: assert remove_outermost("(()(()))") == "()(())"
  - check: assert remove_outermost("(()())(())(()())") == "()()()()()"
solution: |
  def remove_outermost(s):
      out = []
      depth = 0
      for ch in s:
          if ch == "(":
              if depth > 0:
                  out.append(ch)
              depth += 1
          else:
              depth -= 1
              if depth > 0:
                  out.append(ch)
      return "".join(out)
brute: |
  def remove_outermost(s):
      pieces = []
      balance = 0
      start = 0
      for i, ch in enumerate(s):
          balance += 1 if ch == "(" else -1
          if balance == 0:
              pieces.append(s[start + 1:i])
              start = i + 1
      return "".join(pieces)
random:
  call: remove_outermost
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
    def remove_outermost(s):
        return s[1:-1]
  - |
    def remove_outermost(s):
        return s.replace("()", "")
---
::
