---
title: Minimum Window Substring
tier: hard
order: 11
leetcode: 76
url: https://leetcode.com/problems/minimum-window-substring/
companies: [Amazon, Google, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week0-functions/04-strings]
---

You get two strings: s, which has 0 to 100000 lowercase letters, and t, which has 1 to 10 lowercase letters. Return the shortest substring of s that contains every letter of t, counting repeats. For example, t = "aab" needs two a's and one b. If no substring works, return an empty string. If several substrings tie for shortest, return the one that starts first in s.

::exercise
---
id: iv-hard-011
prompt: Write a function min_window(s, t) that returns the shortest substring of s containing every letter of t (with repeats), the leftmost one on a tie, or an empty string if none exists.
starter: |
  # write your code below
  def min_window(s, t):
      pass
hints:
  - Keep a window on s, with a left and a right edge. Move the right edge forward until the window has enough of every letter, then move the left edge forward as far as it can go while the window still has enough.
  - Keep a count of how many letters you still need from t. Only letters that are still short need tracking; a letter you already have enough of does not count against you.
tests:
  - check: assert min_window("xaybzc", "abc") == "aybzc"
  - check: assert min_window("abc", "cba") == "abc"
  - check: assert min_window("aa", "aa") == "aa"
  - check: assert min_window("ab", "b") == "b"
  - check: assert min_window("abc", "d") == ""
  - check: assert min_window("", "a") == ""
  - check: assert min_window("aabbcc", "abc") == "abbc"
  - check: assert min_window("bbaac", "aba") == "baa"
  - check: assert min_window("cabxba", "ab") == "ab"
solution: |
  def min_window(s, t):
      need = {}
      for c in t:
          need[c] = need.get(c, 0) + 1
      missing = len(t)
      left = 0
      best = ""
      for right, c in enumerate(s):
          if need.get(c, 0) > 0:
              missing -= 1
          need[c] = need.get(c, 0) - 1
          if missing == 0:
              while need[s[left]] < 0:
                  need[s[left]] += 1
                  left += 1
              if best == "" or right - left + 1 < len(best):
                  best = s[left:right + 1]
              need[s[left]] += 1
              missing += 1
              left += 1
      return best
brute: |
  def min_window(s, t):
      for L in range(1, len(s) + 1):
          for i in range(len(s) - L + 1):
              sub = s[i:i + L]
              if all(sub.count(c) >= t.count(c) for c in set(t)):
                  return sub
      return ""
random:
  call: min_window
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("abc") for _ in range(rng.randint(0, size + 4)))
        t = "".join(rng.choice("abc") for _ in range(rng.randint(1, 3)))
        return (s, t)
big: assert min_window((rng := __import__("random").Random(11)) and (TAB := bytes(97 + (i % 4) for i in range(256))) and (S0 := rng.randbytes(100000).translate(TAB).decode()) and (S := "".join(S0[5000 * k:5000 * k + 2500] + "e" + S0[5000 * k + 2501:5000 * k + 5000] for k in range(20))), "eeeeeeabcd") == S[2500:27501]
slow:
  - |
    def min_window(s, t):
        for L in range(1, len(s) + 1):
            for i in range(len(s) - L + 1):
                sub = s[i:i + L]
                if all(sub.count(c) >= t.count(c) for c in set(t)):
                    return sub
        return ""
  - |
    from collections import Counter
    def min_window(s, t):
        need = Counter(t)
        best = ""
        for i in range(len(s)):
            have = Counter()
            for j in range(i, len(s)):
                have[s[j]] += 1
                if all(have[c] >= k for c, k in need.items()):
                    if best == "" or j - i + 1 < len(best):
                        best = s[i:j + 1]
                    break
        return best
equivalent:
  - "9: if need.get(c, -1) > 0:"  # why: letters outside t start at -1 instead of 0; they are never > 0 either way, and the shrink loop only tests need < 0 on letters in the window, which are negative in both versions
  - "11: need[c] = need.get(c, -1) - 1"  # why: same as line 9; the shift only moves counts of letters outside t by a constant, and the sign test that decides the output is unchanged
wrong:
  - |
    def min_window(s, t):
        need = set(t)
        left = 0
        for right in range(len(s)):
            if s[right] in need:
                need.discard(s[right])
            if not need:
                return s[left:right + 1]
        return ""
  - |
    def min_window(s, t):
        need = {}
        for c in t:
            need[c] = need.get(c, 0) + 1
        missing = len(t)
        left = 0
        for right, c in enumerate(s):
            if need.get(c, 0) > 0:
                missing -= 1
            need[c] = need.get(c, 0) - 1
            if missing == 0:
                return s[left:right + 1]
        return ""
  - |
    def min_window(s, t):
        need = {}
        for c in t:
            need[c] = need.get(c, 0) + 1
        missing = len(t)
        left = 0
        best = ""
        for right, c in enumerate(s):
            if need.get(c, 0) > 0:
                missing -= 1
            need[c] = need.get(c, 0) - 1
            if missing == 0:
                while need[s[left]] < 0:
                    need[s[left]] += 1
                    left += 1
                if best == "" or right - left + 1 <= len(best):
                    best = s[left:right + 1]
                need[s[left]] += 1
                missing += 1
                left += 1
        return best
---
::
