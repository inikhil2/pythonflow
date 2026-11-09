---
title: Jewels and Stones
tier: easy
order: 79
leetcode: 771
url: https://leetcode.com/problems/jewels-and-stones/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/04-strings, /learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get two strings of lowercase letters. `jewels` lists the letters that count as jewels, and every letter in it is different from the others. It has between 1 and 26 letters. `stones` is a pile of stones, each marked with one letter, and it has between 1 and 10000 letters.

Return how many stones in the pile are jewels. Each stone counts on its own, so if a jewel letter appears three times in `stones`, it adds three to the answer.

::exercise
---
id: iv-easy-079
prompt: Write a function num_jewels_in_stones(jewels, stones) that returns how many letters in stones also appear in jewels.
starter: |
  # write your code below
  def num_jewels_in_stones(jewels, stones):
      pass
hints:
  - Put the jewel letters in a dictionary, so checking a stone is one lookup.
  - Count every stone whose letter is in the dictionary, including repeats.
tests:
  - check: assert num_jewels_in_stones("ab", "abbcccc") == 3
  - check: assert num_jewels_in_stones("ab", "aabbcc") == 4
  - check: assert num_jewels_in_stones("z", "zzz") == 3
  - check: assert num_jewels_in_stones("abc", "d") == 0
  - check: assert num_jewels_in_stones("a", "a") == 1
  - check: assert num_jewels_in_stones("xy", "yxyx") == 4
  - check: assert num_jewels_in_stones("bc", "cccbbbaa") == 6
solution: |
  def num_jewels_in_stones(jewels, stones):
      is_jewel = {}
      for ch in jewels:
          is_jewel[ch] = True
      count = 0
      for ch in stones:
          if is_jewel.get(ch):
              count += 1
      return count
brute: |
  def num_jewels_in_stones(jewels, stones):
      count = 0
      for ch in stones:
          if ch in jewels:
              count += 1
      return count
random:
  call: num_jewels_in_stones
  gen: |
    def gen(rng, size):
        jewels = "".join(rng.sample("abcdefg", rng.randint(1, 7)))
        stones = "".join(rng.choice("abcdefgh") for _ in range(max(size, 1)))
        return (jewels, stones)
wrong:
  - |
    def num_jewels_in_stones(jewels, stones):
        return len(jewels)
  - |
    def num_jewels_in_stones(jewels, stones):
        count = 0
        for jewel in jewels:
            if jewel in stones:
                count += 1
        return count
  - |
    def num_jewels_in_stones(jewels, stones):
        count = 0
        for ch in stones:
            if ch == jewels[0]:
                count += 1
        return count
---
::
