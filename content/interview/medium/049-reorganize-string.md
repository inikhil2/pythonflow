---
title: Reorganize String
tier: medium
order: 49
leetcode: 767
url: https://leetcode.com/problems/reorganize-string/
companies: [Amazon, Google, Meta]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get a string `s` of 1 to 500 lowercase letters. Rearrange its letters so that no two neighbouring letters are the same. The rearranged string must use every letter of `s` the same number of times as `s` does.

Return one such rearrangement. If there is more than one, any of them is fine. If no rearrangement can avoid two equal neighbours, return an empty string "".

For example, "aab" can only become "aba", and "aa" cannot be rearranged at all, so it gives "".

::exercise
---
id: iv-medium-049
prompt: Write a function reorganize_string(s) that returns a rearrangement of s with no two equal letters next to each other, or "" if there is none.
starter: |
  # write your code below
  def reorganize_string(s):
      pass
hints:
  - A rearrangement is impossible when one letter fills more than half of the spaces, rounded up. Check that first.
  - Otherwise, fill the even positions 0, 2, 4 and so on with the most common letters first, then fill the odd positions the same way.
tests:
  - check: 'assert reorganize_string("a") == "a"'
  - check: 'assert reorganize_string("aa") == ""'
  - check: 'assert reorganize_string("aaab") == ""'
  - check: 'assert reorganize_string("aab") == "aba"'
  - check: 'assert reorganize_string("abab") in ("abab", "baba")'
  - check: 'assert reorganize_string("aaabb") == "ababa"'
  - check: 'assert reorganize_string("bbbac") in ("babcb", "bcbab")'
  - check: 'assert len(reorganize_string("aabbcc")) == 6 and all(x != y for x, y in zip(reorganize_string("aabbcc"), reorganize_string("aabbcc")[1:]))'
big: 'assert (lambda s, r, t: sorted(r) == sorted(s) and all(x != y for x, y in zip(r, r[1:])) and t == "")("a" * 20 + "b" * 40 + "c" * 60 + "d" * 80 + "e" * 49 + "f" * 250, reorganize_string("a" * 20 + "b" * 40 + "c" * 60 + "d" * 80 + "e" * 49 + "f" * 250), reorganize_string("a" * 251 + "b" * 249))'
solution: |
  def reorganize_string(s):
      from collections import Counter
      counts = Counter(s)
      if max(counts.values()) > (len(s) + 1) // 2:
          return ""
      order = sorted(counts, key=lambda ch: -counts[ch])
      slots = [""] * len(s)
      i = 0
      for ch in order:
          for _ in range(counts[ch]):
              slots[i] = ch
              i += 2
              if i >= len(s):
                  i = 1
      return "".join(slots)
brute: |
  def reorganize_string(s):
      from collections import Counter
      counts = Counter(s)
      n = len(s)

      def go(prev, built):
          if len(built) == n:
              return built
          for ch in sorted(counts):
              if counts[ch] > 0 and ch != prev:
                  counts[ch] -= 1
                  res = go(ch, built + ch)
                  counts[ch] += 1
                  if res is not None:
                      return res
          return None

      res = go("", "")
      return "" if res is None else res
random:
  call: reorganize_string
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("abc") for _ in range(rng.randint(1, min(3 + size, 9)))),)
  same: |
    def same(args, got, want):
        s = args[0]
        if want == "":
            return got == ""
        return sorted(got) == sorted(s) and all(x != y for x, y in zip(got, got[1:]))
slow:
  - |
    def reorganize_string(s):
        from itertools import permutations
        for p in permutations(s):
            if all(x != y for x, y in zip(p, p[1:])):
                return "".join(p)
        return ""
  - |
    def reorganize_string(s):
        from collections import Counter
        counts = Counter(s)
        n = len(s)

        def go(prev, built):
            if len(built) == n:
                return built
            for ch in sorted(counts):
                if counts[ch] > 0 and ch != prev:
                    counts[ch] -= 1
                    res = go(ch, built + ch)
                    counts[ch] += 1
                    if res is not None:
                        return res
            return None

        res = go("", "")
        return "" if res is None else res
wrong:
  - |
    def reorganize_string(s):
        return s
  - |
    def reorganize_string(s):
        from collections import Counter
        counts = Counter(s)
        if max(counts.values()) > (len(s) + 1) // 2:
            return ""
        order = sorted(counts)
        slots = [""] * len(s)
        i = 0
        for ch in order:
            for _ in range(counts[ch]):
                slots[i] = ch
                i += 2
                if i >= len(s):
                    i = 1
        return "".join(slots)
  - |
    def reorganize_string(s):
        from collections import Counter
        counts = Counter(s)
        order = sorted(counts, key=lambda ch: -counts[ch])
        slots = [""] * len(s)
        i = 0
        for ch in order:
            for _ in range(counts[ch]):
                slots[i] = ch
                i += 2
                if i >= len(s):
                    i = 1
        return "".join(slots)
---
::
