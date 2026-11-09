---
title: Longest Repeating Character Replacement
tier: medium
order: 28
leetcode: 424
url: https://leetcode.com/problems/longest-repeating-character-replacement/
companies: [Google, Amazon, Microsoft]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get a string `s` of 1 to 100000 capital letters from A to Z, and a whole number `k`, where 0 <= k <= 100000. In one change you may replace any letter in `s` with any other capital letter. You may make at most `k` changes. After the changes, find the longest run of letters that stand next to each other in `s` and are all the same letter.

For example, with s = "ABAB" and k = 2, change both B letters to A and you get "AAAA", so the answer is 4. With s = "ABCDE" and k = 1, the best run is two letters long, because any run of three different letters needs two changes.

::exercise
---
id: iv-medium-028
prompt: Write a function character_replacement(s, k) that returns the length of the longest run of one repeated letter that can be made with at most k changes.
starter: |
  # write your code below
  def character_replacement(s, k):
      pass
hints:
  - In a window, the changes needed are the window length minus the count of its most common letter. The window is valid when that number is at most k.
  - When the window is not valid, move the left end right until it is valid again.
tests:
  - check: assert character_replacement("ABAB", 2) == 4
  - check: assert character_replacement("AABABBA", 1) == 4
  - check: assert character_replacement("A", 0) == 1
  - check: assert character_replacement("ABCD", 0) == 1
  - check: assert character_replacement("AAAA", 0) == 4
  - check: assert character_replacement("ABBB", 2) == 4
  - check: assert character_replacement("BAAAB", 2) == 5
  - check: assert character_replacement("ABCDE", 1) == 2
big: 'assert character_replacement("AB" * 50000, 1000) == 2001'
slow:
  - |
    def character_replacement(s, k):
        best = 0
        n = len(s)
        for i in range(n):
            counts = {}
            top = 0
            for j in range(i, n):
                c = s[j]
                counts[c] = counts.get(c, 0) + 1
                top = max(top, counts[c])
                if (j - i + 1) - top > k:
                    break
                best = max(best, j - i + 1)
        return best
solution: |
  def character_replacement(s, k):
      counts = {}
      left = 0
      best = 0
      for right, ch in enumerate(s):
          counts[ch] = counts.get(ch, 0) + 1
          while (right - left + 1) - max(counts.values()) > k:
              counts[s[left]] -= 1
              left += 1
          best = max(best, right - left + 1)
      return best
brute: |
  def character_replacement(s, k):
      best = 0
      for i in range(len(s)):
          for j in range(i, len(s)):
              window = s[i:j + 1]
              need = len(window) - max(window.count(c) for c in set(window))
              if need <= k:
                  best = max(best, len(window))
      return best
random:
  call: character_replacement
  gen: |
    def gen(rng, size):
        s = "".join(rng.choice("ABC") for _ in range(rng.randint(1, size + 4)))
        return (s, rng.randint(0, 3))
wrong:
  - |
    def character_replacement(s, k):
        counts = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            counts[ch] = counts.get(ch, 0) + 1
            while (right - left + 1) - max(counts.values()) > k - 1 and left < right:
                counts[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
  - |
    def character_replacement(s, k):
        counts = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            counts[ch] = counts.get(ch, 0) + 1
            best = max(best, right - left + 1)
            while (right - left + 1) - max(counts.values()) > k:
                counts[s[left]] -= 1
                left += 1
        return best
  - |
    def character_replacement(s, k):
        counts = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            counts[ch] = counts.get(ch, 0) + 1
            while (right - left + 1) - counts[ch] > k:
                counts[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
equivalent:
  - "best = 1"  # why: s always has at least one letter, and the first step sets best to at least 1 anyway, so the starting value never shows
  - "best = -1"  # why: s always has at least one letter, and the first step sets best to at least 1 anyway, so the starting value never shows
---
::
