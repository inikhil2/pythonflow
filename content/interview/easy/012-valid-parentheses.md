---
title: Valid Parentheses
tier: easy
order: 12
leetcode: 20
url: https://leetcode.com/problems/valid-parentheses/
companies: [Google, Meta, Amazon]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string made only of round, square and curly brackets. The string is balanced when every opening bracket is closed by the same kind of bracket, the pairs are in the right order, and no closing bracket appears before its opening partner. An empty string counts as balanced.

Read the string from left to right. Each opening bracket waits in a list until its closing partner arrives. The most recent waiting bracket is the one that must close next, and a list is a last-in, first-out stack when you add and remove from its end.

::exercise
---
id: iv-easy-012
prompt: Write a function is_valid(s) that returns True when the brackets in s are balanced and False otherwise.
starter: |
  # write your code below
  def is_valid(s):
      pass
hints:
  - Keep a list of the opening brackets you have not closed yet.
  - When you meet a closing bracket, the last item in your list must be its matching opening bracket.
tests:
  - check: assert is_valid("()[]{}") == True
  - check: assert is_valid("(]") == False
  - check: assert is_valid("([)]") == False
  - check: assert is_valid("{[]}") == True
  - check: assert is_valid("((") == False
  - check: assert is_valid(")(") == False
  - check: assert is_valid("") == True
  - check: assert is_valid("()") == True
solution: |
  def is_valid(s):
      pairs = {")": "(", "]": "[", "}": "{"}
      stack = []
      for ch in s:
          if ch in pairs:
              if not stack or stack.pop() != pairs[ch]:
                  return False
          else:
              stack.append(ch)
      return not stack
brute: |
  def is_valid(s):
      while True:
          shorter = s.replace("()", "").replace("[]", "").replace("{}", "")
          if shorter == s:
              return s == ""
          s = shorter
random:
  call: is_valid
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            stack, s = [], ""
            for _ in range(size):
                if stack and rng.random() < 0.5:
                    s += stack.pop()
                else:
                    opener = rng.choice("([{")
                    stack.append(")]}"["([{".index(opener)])
                    s += opener
            return (s + "".join(reversed(stack)),)
        return ("".join(rng.choice("()[]{}") for _ in range(size)),)
wrong:
  - |
    def is_valid(s):
        return s.count("(") == s.count(")") and s.count("[") == s.count("]") and s.count("{") == s.count("}")
  - |
    def is_valid(s):
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)
        return True
---
::
