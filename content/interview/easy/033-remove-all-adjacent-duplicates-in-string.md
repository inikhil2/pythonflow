---
title: Remove All Adjacent Duplicates In String
tier: easy
order: 33
leetcode: 1047
url: https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/
companies: [Meta, Google, Apple]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of lowercase letters, which has between 1 and 100000 letters. Whenever two equal letters sit next to each other, remove both of them. Keep doing that until no two equal letters sit side by side. Return what is left, which may be empty. For example, in xyyxzz, removing yy leaves xxzz, then removing xx leaves zz, and removing zz leaves nothing.

::exercise
---
id: iv-easy-033
prompt: Write a function remove_adjacent_duplicates(s) that repeatedly removes pairs of equal letters that sit side by side and returns what is left.
starter: |
  # write your code below
  def remove_adjacent_duplicates(s):
      pass
hints:
  - A list used as a stack lets you see the last letter you kept.
  - When the new letter matches the last letter kept, drop that letter instead of adding the new one.
tests:
  - check: assert remove_adjacent_duplicates("abbaca") == "ca"
  - check: assert remove_adjacent_duplicates("azxxzy") == "ay"
  - check: assert remove_adjacent_duplicates("a") == "a"
  - check: assert remove_adjacent_duplicates("aa") == ""
  - check: assert remove_adjacent_duplicates("abba") == ""
  - check: assert remove_adjacent_duplicates("abccba") == ""
  - check: assert remove_adjacent_duplicates("abc") == "abc"
big: assert remove_adjacent_duplicates("ab" * 25000 + "ba" * 25000) == ""
solution: |
  def remove_adjacent_duplicates(s):
      stack = []
      for ch in s:
          if stack and stack[-1] == ch:
              stack.pop()
          else:
              stack.append(ch)
      return "".join(stack)
brute: |
  def remove_adjacent_duplicates(s):
      changed = True
      while changed:
          changed = False
          for i in range(len(s) - 1):
              if s[i] == s[i + 1]:
                  s = s[:i] + s[i + 2:]
                  changed = True
                  break
      return s
random:
  call: remove_adjacent_duplicates
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("abc") for _ in range(rng.randint(1, size + 3))),)
slow:
  - |
    def remove_adjacent_duplicates(s):
        changed = True
        while changed:
            changed = False
            out = []
            i = 0
            while i < len(s):
                if i + 1 < len(s) and s[i] == s[i + 1]:
                    i += 2
                    changed = True
                else:
                    out.append(s[i])
                    i += 1
            s = "".join(out)
        return s
  - |
    def remove_adjacent_duplicates(s):
        while True:
            before = s
            for c in set(s):
                s = s.replace(c + c, "")
            if s == before:
                return s
wrong:
  - |
    def remove_adjacent_duplicates(s):
        return s.replace("aa", "")
  - |
    def remove_adjacent_duplicates(s):
        out = ""
        i = 0
        while i < len(s):
            if i + 1 < len(s) and s[i] == s[i + 1]:
                i += 2
            else:
                out += s[i]
                i += 1
        return out
---
::
