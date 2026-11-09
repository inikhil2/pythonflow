---
title: Word Ladder II
tier: hard
order: 57
leetcode: 126
url: https://leetcode.com/problems/word-ladder-ii/
companies: [Amazon, Apple, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes, /learn/week10-algorithms/09-graphs]
---

You get a starting word, a target word and a list of distinct words. Every word has the same length, from 1 to 5 lowercase letters, and the list holds between 1 and 256 words. One step changes exactly one letter of the current word, and the new word must be in the list. The starting word does not have to be in the list, and it is never the target word. The target word may or may not be in the list.

Return every shortest sequence of words that goes from the starting word to the target word, and each sequence includes both ends. Return the sequences in any order. If the target word is not in the list, or no sequence exists, return an empty list.

Find the shortest number of steps for each word first, layer by layer, then trace back from the target to collect every sequence. Walking every possible sequence without that first pass does far too much work on a long list.

::exercise
---
id: iv-hard-057
prompt: Write a function find_ladders(begin_word, end_word, word_list) that returns every shortest sequence of one-letter changes from begin_word to end_word, each sequence a list of words, in any order.
starter: |
  # write your code below
  def find_ladders(begin_word, end_word, word_list):
      pass
hints:
  - Build the layers with a breadth-first search, and for each new word remember every word of the layer before that reached it.
  - Once the target is reached, walk back through the remembered words to build each sequence, then stop.
tests:
  - check: assert sorted(find_ladders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])) == [["hit", "hot", "dot", "dog", "cog"], ["hit", "hot", "lot", "log", "cog"]]
  - check: assert find_ladders("hit", "cog", ["hot", "dot", "dog", "lot", "log"]) == []
  - check: assert find_ladders("a", "c", ["a", "b", "c"]) == [["a", "c"]]
  - check: assert find_ladders("ab", "ba", ["ab", "ba"]) == []
  - check: assert sorted(find_ladders("cat", "dog", ["cot", "dot", "dog", "cog"])) == [["cat", "cot", "cog", "dog"], ["cat", "cot", "dot", "dog"]]
  - check: assert find_ladders("aa", "cc", ["ab", "bb", "bc", "cc", "ac"]) == [["aa", "ac", "cc"]]
  - check: assert find_ladders("aa", "bb", ["ab", "bc"]) == []
  - check: assert find_ladders("x", "y", ["x", "y", "z"]) == [["x", "y"]]
  - check: assert find_ladders("hot", "dog", ["hot", "dot", "dog"]) == [["hot", "dot", "dog"]]
# why: each shortest ladder from aaaaa to ccccc changes each of the five letters once, straight from a to c, so it is one of the 5! = 120 orders of the positions, and each has 6 words; the big compares the whole sorted list of paths
big: assert sorted(find_ladders("aaaaa", "ccccc", [a + b + c + d + e for a in "abc" for b in "abc" for c in "abc" for d in "abc" for e in "abc"])) == sorted([["aaaaa"] + ["".join("c" if j in p[:k + 1] else "a" for j in range(5)) for k in range(5)] for p in __import__("itertools").permutations(range(5))])
solution: |
  def find_ladders(begin_word, end_word, word_list):
      words = set(word_list)
      if end_word not in words:
          return []
      parents = {}
      seen = {begin_word}
      level = [begin_word]
      while level and end_word not in parents:
          nxt = {}
          for word in level:
              for i in range(len(word)):
                  for c in "abcdefghijklmnopqrstuvwxyz":
                      cand = word[:i] + c + word[i + 1:]
                      if cand in words and cand not in seen:
                          nxt.setdefault(cand, []).append(word)
          for w in nxt:
              seen.add(w)
              parents[w] = nxt[w]
          level = list(nxt)
      if end_word not in parents:
          return []
      paths = []
      def build(word, suffix):
          if word == begin_word:
              paths.append([word] + suffix)
              return
          for p in parents[word]:
              build(p, [word] + suffix)
      build(end_word, [])
      return paths
brute: |
  def find_ladders(begin_word, end_word, word_list):
      words = set(word_list)
      if end_word not in words:
          return []
      found = []
      def walk(path):
          word = path[-1]
          if word == end_word:
              found.append(list(path))
              return
          # cap: random words are 3 letters, so a shortest ladder has at most 4 words; 6 never cuts one off
          if len(path) > 6:
              return
          for cand in words:
              if sum(a != b for a, b in zip(cand, word)) == 1 and cand not in path:
                  walk(path + [cand])
      walk([begin_word])
      if not found:
          return []
      shortest = min(len(p) for p in found)
      return [p for p in found if len(p) == shortest]
random:
  call: find_ladders
  gen: |
    def gen(rng, size):
        pool = [a + b + c for a in "ab" for b in "ab" for c in "ab"]
        begin = rng.choice(pool)
        end = rng.choice([w for w in pool if w != begin])
        words = rng.sample(pool, rng.randint(1, 8))
        return (begin, end, words)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
wrong:
  - |
    def find_ladders(begin_word, end_word, word_list):
        words = set(word_list)
        if end_word not in words:
            return []
        parents = {}
        seen = {begin_word}
        level = [begin_word]
        while level and end_word not in parents:
            nxt = {}
            for word in level:
                for i in range(len(word)):
                    for c in "abcdefghijklmnopqrstuvwxyz":
                        cand = word[:i] + c + word[i + 1:]
                        if cand in words and cand not in seen:
                            nxt.setdefault(cand, []).append(word)
            for w in nxt:
                seen.add(w)
                parents[w] = nxt[w]
            level = list(nxt)
        if end_word not in parents:
            return []
        paths = []
        def build(word, suffix):
            if word == begin_word:
                paths.append([word] + suffix)
                return
            build(parents[word][0], [word] + suffix)
        build(end_word, [])
        return paths
  - |
    def find_ladders(begin_word, end_word, word_list):
        words = set(word_list)
        if end_word not in words:
            return []
        parents = {}
        seen = {begin_word}
        level = [begin_word]
        while level and end_word not in parents:
            nxt = {}
            for word in level:
                for i in range(len(word)):
                    for c in "abcdefghijklmnopqrstuvwxyz":
                        cand = word[:i] + c + word[i + 1:]
                        if cand in words and cand not in seen:
                            nxt.setdefault(cand, []).append(word)
                if end_word in nxt:
                    break
            for w in nxt:
                seen.add(w)
                parents[w] = nxt[w]
            level = list(nxt)
        if end_word not in parents:
            return []
        paths = []
        def build(word, suffix):
            if word == begin_word:
                paths.append([word] + suffix)
                return
            for p in parents[word] + [w for w in words if sum(a != b for a, b in zip(w, word)) == 2 and w in parents]:
                build(p, [word] + suffix)
        build(end_word, [])
        return paths
  - |
    def find_ladders(begin_word, end_word, word_list):
        words = set(word_list) | {end_word}
        parents = {}
        seen = {begin_word}
        level = [begin_word]
        while level and end_word not in parents:
            nxt = {}
            for word in level:
                for i in range(len(word)):
                    for c in "abcdefghijklmnopqrstuvwxyz":
                        cand = word[:i] + c + word[i + 1:]
                        if cand in words and cand not in seen:
                            nxt.setdefault(cand, []).append(word)
            for w in nxt:
                seen.add(w)
                parents[w] = nxt[w]
            level = list(nxt)
        if end_word not in parents:
            return []
        paths = []
        def build(word, suffix):
            if word == begin_word:
                paths.append([word] + suffix)
                return
            for p in parents[word]:
                build(p, [word] + suffix)
        build(end_word, [])
        return paths
slow:
  - |
    def find_ladders(begin_word, end_word, word_list):
        words = set(word_list)
        if end_word not in words:
            return []
        found = []
        def walk(path):
            word = path[-1]
            if word == end_word:
                found.append(list(path))
                return
            for cand in words:
                if sum(a != b for a, b in zip(cand, word)) == 1 and cand not in path:
                    walk(path + [cand])
        walk([begin_word])
        if not found:
            return []
        shortest = min(len(p) for p in found)
        return [p for p in found if len(p) == shortest]
---
::
