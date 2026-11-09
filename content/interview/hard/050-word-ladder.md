---
title: Word Ladder
tier: hard
order: 50
leetcode: 127
url: https://leetcode.com/problems/word-ladder/
companies: [Amazon, Apple, Meta]
topic: Graph Search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You are given a starting word, a target word, and a list of words. All of them have the same length, from 1 to 8 lowercase letters, and the list holds at most 5000 words. A move changes exactly one letter of the current word to get a new word. The intermediate words must all come from the list, and the target must come from the list too. The starting word need not be in the list.

Return the number of words in the shortest sequence that goes from the starting word to the target, counting both ends. If the two words are the same, the answer is 1. If the target cannot be reached, return 0.

::exercise
---
id: iv-hard-050
prompt: Write a function ladder_length(begin, end, words) that returns the number of words in the shortest one-letter-change path from begin to end, counting both ends, using only words from the list for the steps after begin, or 0 if there is no such path.
starter: |
  # write your code below
  def ladder_length(begin, end, words):
      pass
hints:
  - Search level by level, so the first time you pop the target you have the shortest path. Use a queue of (word, steps) pairs.
  - To find neighbours, change each position to each letter and check whether the result is in a set of the list. Remove a word from the set when you first add it, so you never visit it twice.
tests:
  - check: assert ladder_length("a", "a", ["b"]) == 1
  - check: assert ladder_length("a", "c", ["b", "c"]) == 2
  - check: assert ladder_length("a", "c", ["b"]) == 0
  - check: assert ladder_length("cat", "dog", ["cot", "cog", "dot", "dog", "bat"]) == 4
  - check: assert ladder_length("cat", "dog", ["dog"]) == 0
  - check: assert ladder_length("cat", "cog", ["cot", "cog"]) == 3
  - check: assert ladder_length("ab", "ba", ["aa", "ba"]) == 3
  - check: assert ladder_length("ab", "ba", ["aa"]) == 0
  - check: assert ladder_length("xy", "xz", ["xa", "xz"]) == 2
  - check: assert ladder_length("aaa", "ccc", ["aab", "abb", "bbb", "ccb", "cbb", "ccc", "bcc", "aac"]) == 6
  - check: assert ladder_length("abc", "abc", []) == 1
  - check: assert ladder_length("ca", "bb", ["aa", "ac", "ba", "bb", "bc", "ca", "cb", "cc"]) == 3
solution: |
  from collections import deque

  def ladder_length(begin, end, words):
      pool = set(words)
      queue = deque([(begin, 1)])
      while queue:
          word, steps = queue.popleft()
          if word == end:
              return steps
          for i in range(len(word)):
              for c in "abcdefghijklmnopqrstuvwxyz":
                  nxt = word[:i] + c + word[i + 1:]
                  if nxt in pool:
                      pool.remove(nxt)
                      queue.append((nxt, steps + 1))
      return 0
slow:
  - |
    def ladder_length(begin, end, words):
        seen = {begin}
        frontier = [begin]
        steps = 1
        while frontier:
            if end in frontier:
                return steps
            following = []
            for w in words:
                if w not in seen and any(sum(a != b for a, b in zip(w, f)) == 1 for f in frontier):
                    seen.add(w)
                    following.append(w)
            frontier = following
            steps += 1
        return 0
brute: |
  def ladder_length(begin, end, words):
      seen = {begin}
      frontier = [begin]
      steps = 1
      while frontier:
          if end in frontier:
              return steps
          following = []
          for w in words:
              if w not in seen and any(sum(a != b for a, b in zip(w, f)) == 1 for f in frontier):
                  seen.add(w)
                  following.append(w)
          frontier = following
          steps += 1
      return 0
big: 'assert ladder_length("aaaa", "zzzz", [a + b + c + d for a in "abcdefgh" for b in "abcdefgh" for c in "abcdefgh" for d in "abcdefgh"]) == 0'
random:
  call: ladder_length
  gen: |
    def gen(rng, size):
        pool = [a + b for a in "abc" for b in "abc"]
        words = rng.sample(pool, rng.randint(1, 7))
        begin = rng.choice(pool)
        end = rng.choice(words + [begin])
        return (begin, end, words)
wrong:
  - |
    from collections import deque

    def ladder_length(begin, end, words):
        pool = set(words)
        queue = deque([(begin, 1)])
        while queue:
            word, steps = queue.popleft()
            if word == end:
                return steps - 1
            for i in range(len(word)):
                for c in "abcdefghijklmnopqrstuvwxyz":
                    nxt = word[:i] + c + word[i + 1:]
                    if nxt in pool:
                        pool.remove(nxt)
                        queue.append((nxt, steps + 1))
        return 0
  - |
    def ladder_length(begin, end, words):
        pool = set(words)
        stack = [(begin, 1)]
        while stack:
            word, steps = stack.pop()
            if word == end:
                return steps
            for i in range(len(word)):
                for c in "abcdefghijklmnopqrstuvwxyz":
                    nxt = word[:i] + c + word[i + 1:]
                    if nxt in pool:
                        pool.remove(nxt)
                        stack.append((nxt, steps + 1))
        return 0
  - |
    from collections import deque

    def ladder_length(begin, end, words):
        pool = set(words)
        queue = deque([(begin, 1)])
        while queue:
            word, steps = queue.popleft()
            if word == end:
                return steps
            for i in range(len(word)):
                for c in "abcdefghijklmnopqrstuvwxyz":
                    nxt = word[:i] + c + word[i + 1:]
                    if nxt in pool:
                        pool.remove(nxt)
                        queue.append((nxt, steps + 1))
        return -1
---
::
