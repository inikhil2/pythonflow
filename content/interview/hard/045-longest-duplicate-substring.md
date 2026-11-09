---
title: Longest Duplicate Substring
tier: hard
order: 45
leetcode: 1044
url: https://leetcode.com/problems/longest-duplicate-substring/
companies: [Google, Amazon, Microsoft]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week9-etcetera/01-sets, /learn/week10-algorithms/05-binary-search]
---

You are given a string of lowercase letters, between 1 and 1000 letters long. Find the longest piece of it that appears at least twice. The two copies may overlap, so `aaa` in `aaaa` counts. If no piece appears twice, return the empty string. Several pieces can tie for the longest, and any one of them is a correct answer.

A piece that appears twice must have a shorter piece that also appears twice, since the shorter piece is a part of it. That means you can search for a length: try a length, check whether any piece of that length repeats, and move up or down. Checking one length takes one pass over the string with a set of the pieces seen so far.

::exercise
---
id: iv-hard-045
prompt: Write a function longest_dup(s) that returns a longest substring of s that occurs at least twice, where the two copies may overlap, or the empty string if there is none.
starter: |
  # write your code below
  def longest_dup(s):
      pass
hints:
  - If a piece of length L repeats, then every shorter piece inside it repeats too, so the repeating lengths form a range from 1 up to some maximum.
  - For a fixed length, walk the string once and keep the pieces you have seen in a set.
tests:
  - check: assert longest_dup('banana') == 'ana'
  - check: assert longest_dup('abcd') == ''
  - check: assert longest_dup('aaaa') == 'aaa'
  - check: assert longest_dup('abab') == 'ab'
  - check: assert longest_dup('a') == ''
  - check: assert longest_dup('aa') == 'a'
  - check: assert longest_dup('mississippi') == 'issi'
  - check: assert longest_dup('zzzzzz') == 'zzzzz'
  - check: assert longest_dup('abcabcabc') in ('abcabc', 'bcabca', 'cabcab')
solution: |
  def longest_dup(s):
      def find(length):
          seen = set()
          for i in range(len(s) - length + 1):
              piece = s[i:i + length]
              if piece in seen:
                  return piece
              seen.add(piece)
          return None

      best = ''
      lo, hi = 0, len(s) - 1
      while lo < hi:
          mid = (lo + hi + 1) // 2
          piece = find(mid)
          if piece is not None:
              best = piece
              lo = mid
          else:
              hi = mid - 1
      return best
slow:
  - |
    def longest_dup(s):
        best = ''
        n = len(s)
        for i in range(n):
            for j in range(i + 1, n):
                k = 0
                while j + k < n and s[i + k] == s[j + k]:
                    k += 1
                if k > len(best):
                    best = s[i:i + k]
        return best
brute: |
  from collections import Counter

  def longest_dup(s):
      for length in range(len(s) - 1, 0, -1):
          counts = Counter(s[i:i + length] for i in range(len(s) - length + 1))
          for piece, count in counts.items():
              if count >= 2:
                  return piece
      return ''
big: 'assert len(longest_dup((lambda r: "".join(r.choice("ab") for _ in range(1000)))(__import__("random").Random(45)))) == 17'
random:
  call: longest_dup
  same: |
    def same(args, got, want):
        s = args[0]
        if len(got) != len(want):
            return False
        return got == '' or sum(1 for i in range(len(s) - len(got) + 1) if s.startswith(got, i)) >= 2
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 4, 8))
        return (''.join(rng.choice('abc') for _ in range(n)),)
wrong:
  - |
    def longest_dup(s):
        for length in range(1, len(s)):
            for i in range(len(s) - length + 1):
                if s.count(s[i:i + length]) >= 2:
                    return s[i:i + length]
        return ''
  - |
    def longest_dup(s):
        best = ''
        for length in range(1, len(s)):
            piece = s[:length]
            if s.find(piece, 1) != -1:
                best = piece
        return best
  - |
    def longest_dup(s):
        best = ''
        for length in range(1, len(s)):
            for i in range(len(s) - length + 1):
                piece = s[i:i + length]
                if s.count(piece) > 1 and len(piece) > len(best):
                    best = piece
        return best
equivalent:
  - 12: "lo, hi = (0, len(s) + 1)"   # why: find() of a length past len(s) has no windows, so it returns None and that length is never picked
  - 5: "for i in range(len(s) - length + 2):"   # why: the extra window is one character shorter than length, so it never equals a length-length piece already in seen
  - 12: "lo, hi = (-1, len(s) - 1)"   # why: find(0) always returns the empty string, which is already the default best, so the first step changes nothing
  - 12: "lo, hi = (0, len(s) - 0)"   # why: find(len(s)) has one window and returns None, so the extra first step is rejected and the search ends at the same length
  - 14: "mid = (lo + hi + 2) // 2"   # why: any mid in (lo, hi] keeps the answer inside [lo, hi] and makes progress, so the search still ends at the longest length; a tie may give a different valid string, which same accepts
---
::
