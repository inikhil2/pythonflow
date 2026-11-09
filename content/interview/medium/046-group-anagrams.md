---
title: Group Anagrams
tier: medium
order: 46
leetcode: 49
url: https://leetcode.com/problems/group-anagrams/
companies: [Amazon, Meta, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week2-loops/04-dictionaries]
---

You get a list `words` of 1 to 5000 words. Each word has 0 to 100 lowercase letters, and an empty word is allowed. Two words are anagrams when they use the same letters the same number of times, so "tea" and "eat" are anagrams. A word is an anagram of itself.

Group the words so that each group holds words that are anagrams of each other. Keep the words in each group in the order they appear in `words`. The groups can come back in any order.

For example, ["eat", "tea", "tan", "ate", "nat", "bat"] gives the groups ["eat", "tea", "ate"], ["tan", "nat"] and ["bat"].

::exercise
---
id: iv-medium-046
prompt: Write a function group_anagrams(words) that returns the anagram groups of words, each group keeping the original order of its words.
starter: |
  # write your code below
  def group_anagrams(words):
      pass
hints:
  - Two anagrams become the same word once their letters are sorted. Use that sorted form as a key in a dictionary.
  - Add each word to the list stored under its key, in the order you meet the words.
tests:
  - check: 'assert sorted(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])) == sorted([["eat", "tea", "ate"], ["tan", "nat"], ["bat"]])'
  - check: 'assert group_anagrams([""]) == [[""]]'
  - check: 'assert group_anagrams(["a"]) == [["a"]]'
  - check: 'assert sorted(group_anagrams(["ab", "cd"])) == sorted([["ab"], ["cd"]])'
  - check: 'assert sorted(group_anagrams(["aab", "ab"])) == sorted([["aab"], ["ab"]])'
  - check: 'assert group_anagrams(["ab", "ba", "ab"]) == [["ab", "ba", "ab"]]'
  - check: 'assert sorted(group_anagrams(["abc", "bca", "cab", "abd", ""])) == sorted([["abc", "bca", "cab"], ["abd"], [""]])'
  - check: 'assert len(group_anagrams(["a", "b", "c", "d", "e", "f"])) == 6'
big: 'assert (lambda r: len(r) == 1385 and sum(len(g) ** 2 for g in r) == 22064 and max(map(len, r)) == 12 and sorted(r)[0] == ["aaaxyz", "axyzaa"])(group_anagrams(["".join((lambda L, s: L[s:] + L[:s])([chr(97 + i % 3000 % 26), chr(97 + i % 3000 // 26 % 26), chr(97 + i % 3000 // 676), "x", "y", "z"], i // 3000 * 2 + i % 2)) for i in range(5000)]))'
solution: |
  def group_anagrams(words):
      groups = {}
      for word in words:
          groups.setdefault("".join(sorted(word)), []).append(word)
      return list(groups.values())
brute: |
  def group_anagrams(words):
      from collections import Counter
      used = [False] * len(words)
      out = []
      for i, word in enumerate(words):
          if used[i]:
              continue
          group = []
          for j in range(i, len(words)):
              if not used[j] and Counter(words[j]) == Counter(word):
                  used[j] = True
                  group.append(words[j])
          out.append(group)
      return out
random:
  call: group_anagrams
  gen: |
    def gen(rng, size):
        return ([
            "".join(rng.choice("abc") for _ in range(rng.randint(0, 4)))
            for _ in range(rng.randint(1, 3 + size))
        ],)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
slow:
  - |
    def group_anagrams(words):
        groups = []
        for word in words:
            for group in groups:
                if sorted(group[0]) == sorted(word):
                    group.append(word)
                    break
            else:
                groups.append([word])
        return groups
wrong:
  - |
    def group_anagrams(words):
        groups = {}
        for word in words:
            groups.setdefault(word, []).append(word)
        return list(groups.values())
  - |
    def group_anagrams(words):
        groups = {}
        for word in words:
            groups.setdefault(len(word), []).append(word)
        return list(groups.values())
  - |
    def group_anagrams(words):
        groups = {}
        for word in words:
            groups.setdefault("".join(sorted(set(word))), []).append(word)
        return list(groups.values())
---
::
