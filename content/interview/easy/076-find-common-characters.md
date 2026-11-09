---
title: Find Common Characters
tier: easy
order: 76
leetcode: 1002
url: https://leetcode.com/problems/find-common-characters/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `words` of between 1 and 100 words. Each word has between 1 and 100 lowercase letters. A letter is common when it appears in every word. If a letter appears in every word, count how many times it appears in each word, and keep the smallest of those counts.

Return a list of the common letters, with each letter repeated as many times as its smallest count. The letters may be in any order. If no letter is common to all the words, return an empty list.

::exercise
---
id: iv-easy-076
prompt: Write a function common_chars(words) that returns the letters found in every word, repeated by the fewest times they appear in any one word.
starter: |
  # write your code below
  def common_chars(words):
      pass
hints:
  - Count the letters of each word, then keep the smallest count for each letter across all the words.
  - Once you have the final counts, write each letter out as many times as its count.
tests:
  - check: assert sorted(common_chars(["bella", "label", "roller"])) == ["e", "l", "l"]
  - check: assert sorted(common_chars(["cool", "lock", "cook"])) == ["c", "o"]
  - check: assert common_chars(["a"]) == ["a"]
  - check: assert common_chars(["abc", "def"]) == []
  - check: assert sorted(common_chars(["aa", "aa", "a"])) == ["a"]
  - check: assert sorted(common_chars(["aab", "aba"])) == ["a", "a", "b"]
  - check: assert common_chars(["zz", "y"]) == []
solution: |
  def common_chars(words):
      counts = {}
      for ch in words[0]:
          counts[ch] = counts.get(ch, 0) + 1
      for word in words[1:]:
          here = {}
          for ch in word:
              here[ch] = here.get(ch, 0) + 1
          for ch in counts:
              counts[ch] = min(counts[ch], here.get(ch, 0))
      result = []
      for ch in counts:
          for _ in range(counts[ch]):
              result.append(ch)
      return result
brute: |
  def common_chars(words):
      result = []
      for c in "abcdefghijklmnopqrstuvwxyz":
          m = min(word.count(c) for word in words)
          for _ in range(m):
              result.append(c)
      return result
random:
  call: common_chars
  gen: |
    def gen(rng, size):
        words = []
        for _ in range(rng.randint(1, 4)):
            words.append("".join(rng.choice("abc") for _ in range(rng.randint(1, max(size, 1)))))
        return (words,)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
wrong:
  - |
    def common_chars(words):
        result = []
        for ch in "abcdefghijklmnopqrstuvwxyz":
            if all(ch in word for word in words):
                result.append(ch)
        return result
  - |
    def common_chars(words):
        counts = {}
        for ch in words[0]:
            counts[ch] = counts.get(ch, 0) + 1
        for word in words[1:]:
            here = {}
            for ch in word:
                here[ch] = here.get(ch, 0) + 1
            for ch in counts:
                counts[ch] = max(counts[ch], here.get(ch, 0))
        result = []
        for ch in counts:
            for _ in range(counts[ch]):
                result.append(ch)
        return result
  - |
    def common_chars(words):
        result = []
        for ch in words[0]:
            result.append(ch)
        return result
equivalent:
  - "for word in words[0:]:"  # why: the first word is compared with itself, and its own counts never lower the minimum
  - "counts[ch] = min(counts[ch], here.get(ch, -1))"  # why: a letter missing from a word gets a count of -1, which repeats zero times, the same as 0
---
::
