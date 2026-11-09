---
title: Reverse String II
tier: easy
order: 45
leetcode: 541
url: https://leetcode.com/problems/reverse-string-ii/
companies: [Amazon, Google, Meta]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings]
---

You get a string s of 1 to 10000 lowercase letters and a whole number k from 1 to 10000. Cut s into consecutive groups of 2 times k letters, where only the last group may be shorter. In each group, turn around its first k letters and keep the other letters where they are. A last group with fewer than k letters is turned around in full. Return the new string.

::exercise
---
id: iv-easy-045
prompt: Write a function reverse_str(s, k) that reverses the first k letters of every group of 2 times k letters in s, following the rules.
starter: |
  # write your code below
  def reverse_str(s, k):
      pass
hints:
  - Step through the string in jumps of 2 times k, and reverse the slice that starts at each jump, cut to k letters.
  - A slice that runs past the end of the string is just shorter, so the last short block needs no special case.
tests:
  - check: assert reverse_str("abcdefg", 2) == "bacdfeg"
  - check: assert reverse_str("abcd", 2) == "bacd"
  - check: assert reverse_str("a", 1) == "a"
  - check: assert reverse_str("ab", 2) == "ba"
  - check: assert reverse_str("abcdefg", 3) == "cbadefg"
  - check: assert reverse_str("abcdefgh", 2) == "bacdfegh"
  - check: assert reverse_str("abcdefg", 1) == "abcdefg"
solution: |
  def reverse_str(s, k):
      chars = list(s)
      for start in range(0, len(chars), 2 * k):
          chars[start:start + k] = chars[start:start + k][::-1]
      return "".join(chars)
brute: |
  def reverse_str(s, k):
      out = []
      for i in range(len(s)):
          block = i // (2 * k) * (2 * k)
          if i < block + k:
              lo = block
              hi = min(block + k, len(s)) - 1
              out.append(s[lo + hi - i])
          else:
              out.append(s[i])
      return "".join(out)
random:
  call: reverse_str
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("abcd") for _ in range(rng.randint(1, size + 5)))
        return (s, rng.randint(1, size + 4))
wrong:
  - |
    def reverse_str(s, k):
        chars = list(s)
        for start in range(0, len(chars), k):
            chars[start:start + k] = chars[start:start + k][::-1]
        return "".join(chars)
  - |
    def reverse_str(s, k):
        return s[:k][::-1] + s[k:]
---
::
