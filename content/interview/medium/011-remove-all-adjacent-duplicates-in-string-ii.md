---
title: Remove All Adjacent Duplicates in String II
tier: medium
order: 11
leetcode: 1209
url: https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/
companies: [Meta, Amazon, Bloomberg]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a string `s` of 1 to 2000 lowercase English letters and a whole number `k`, where 2 <= k <= 10. A duplicate removal takes k equal letters that stand next to each other and deletes them. Keep doing removals while any group of k or more equal letters stands together. The order you remove them in does not change the final string.

For example, with k = 3, `"abbbaa"` loses `bbb` and becomes `"aaa"`, and then all three `a` letters go, so the answer is `""`. With k = 2, `"abbaca"` loses `bb`, which makes `"aaca"`, then `aa`, which leaves `"ca"`.

::exercise
---
id: iv-medium-011
prompt: Write a function remove_duplicates(s, k) that returns the string left after removing groups of k equal adjacent letters until none remain.
starter: |
  # write your code below
  def remove_duplicates(s, k):
      pass
hints:
  - Keep a stack of pairs, each holding a letter and how many times it has appeared in a row.
  - When a letter's count reaches k, pop that pair. A letter that differs from the top pair starts a new pair.
tests:
  - check: assert remove_duplicates("abcd", 2) == "abcd"
  - check: assert remove_duplicates("deeedbbcccbdaa", 3) == "aa"
  - check: assert remove_duplicates("pbbcggttciiippooaais", 2) == "ps"
  - check: assert remove_duplicates("aaa", 3) == ""
  - check: assert remove_duplicates("abbbaa", 3) == ""
  - check: assert remove_duplicates("aabbaa", 2) == ""
  - check: assert remove_duplicates("abbaca", 2) == "ca"
  - check: assert remove_duplicates("a", 2) == "a"
  - check: assert remove_duplicates("aaaaaaaaaa", 3) == "a"
no_slow: "The string is at most 2000 letters, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def remove_duplicates(s, k):
      stack = []
      for ch in s:
          if stack and stack[-1][0] == ch:
              stack[-1][1] += 1
              if stack[-1][1] == k:
                  stack.pop()
          else:
              stack.append([ch, 1])
      return "".join(ch * count for ch, count in stack)
brute: |
  def remove_duplicates(s, k):
      s = list(s)
      changed = True
      while changed:
          changed = False
          i = 0
          while i < len(s):
              j = i
              while j < len(s) and s[j] == s[i]:
                  j += 1
              if j - i >= k:
                  del s[i:i + k]
                  changed = True
                  break
              i = j
      return "".join(s)
random:
  call: remove_duplicates
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("abc") for _ in range(rng.randint(1, 12)))
        return (s, rng.randint(2, 4))
wrong:
  - |
    def remove_duplicates(s, k):
        runs = []
        for ch in s:
            if runs and runs[-1][0] == ch:
                runs[-1][1] += 1
            else:
                runs.append([ch, 1])
        return "".join(ch * (count % k) for ch, count in runs)
  - |
    def remove_duplicates(s, k):
        s = list(s)
        i = 0
        while i < len(s):
            j = i
            while j < len(s) and s[j] == s[i]:
                j += 1
            if j - i >= k:
                del s[i:i + k]
                break
            i = j
        return "".join(s)
  - |
    def remove_duplicates(s, k):
        stack = []
        for ch in s:
            if stack and stack[-1][0] == ch:
                stack[-1][1] += 1
                if stack[-1][1] > k:
                    stack.pop()
            else:
                stack.append([ch, 1])
        return "".join(ch * count for ch, count in stack)
---
::
