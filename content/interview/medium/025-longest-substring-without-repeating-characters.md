---
title: Longest Substring Without Repeating Characters
tier: medium
order: 25
leetcode: 3
url: https://leetcode.com/problems/longest-substring-without-repeating-characters/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get a string `s` of 0 to 50000 characters. Each character is a letter, a digit, a space, or a symbol. Find the length of the longest run of characters that stands next to each other in `s` and has no character repeated inside it. A run can be the whole string, a single character, or empty when `s` is empty.

For example, in `"abcabcbb"` the longest such run is `"abc"`, which has length 3. In `"bbbbb"` every run has a repeat except a single `b`, so the answer is 1.

::exercise
---
id: iv-medium-025
prompt: Write a function length_of_longest(s) that returns the length of the longest substring of s with no repeated character.
starter: |
  # write your code below
  def length_of_longest(s):
      pass
hints:
  - Keep a window with two ends, left and right. Move right one step at a time and remember where each character was last seen.
  - When a character repeats inside the window, move left just past its last position. Never move left backward.
tests:
  - check: assert length_of_longest("abcabcbb") == 3
  - check: assert length_of_longest("bbbbb") == 1
  - check: assert length_of_longest("pwwkew") == 3
  - check: assert length_of_longest("") == 0
  - check: assert length_of_longest("abba") == 2
  - check: assert length_of_longest("dvdf") == 3
  - check: assert length_of_longest("a b a") == 3
  - check: assert length_of_longest("tmmzuxt") == 5
big: assert length_of_longest("".join(chr(33 + (i * 89) % 90) for i in range(50000))) == 90
solution: |
  def length_of_longest(s):
      last = {}
      left = 0
      best = 0
      for right, ch in enumerate(s):
          if ch in last and last[ch] >= left:
              left = last[ch] + 1
          last[ch] = right
          best = max(best, right - left + 1)
      return best
brute: |
  def length_of_longest(s):
      best = 0
      for start in range(len(s)):
          seen = set()
          for end in range(start, len(s)):
              if s[end] in seen:
                  break
              seen.add(s[end])
              best = max(best, end - start + 1)
      return best
random:
  call: length_of_longest
  gen: |
    def gen(rng, size):
        return ("".join(rng.choice("abc d") for _ in range(rng.randint(0, size + 3))),)
wrong:
  - |
    def length_of_longest(s):
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last:
                left = 0
            last[ch] = right
            best = max(best, right - left + 1)
        return best
  - |
    def length_of_longest(s):
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best
  - |
    def length_of_longest(s):
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last.setdefault(ch, right)
            best = max(best, right - left + 1)
        return best
  - |
    def length_of_longest(s):
        last = {}
        left = 0
        best = 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left)
        return best
slow:
  - |
    def length_of_longest(s):
        best = 0
        for start in range(len(s)):
            seen = set()
            for end in range(start, len(s)):
                if s[end] in seen:
                    break
                seen.add(s[end])
                best = max(best, end - start + 1)
        return best
---
::
