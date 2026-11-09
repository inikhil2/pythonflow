---
title: Combination Sum
tier: medium
order: 43
leetcode: 39
url: https://leetcode.com/problems/combination-sum/
companies: [Amazon, Google, Meta]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a list `candidates` of 1 to 30 different whole numbers, each from 2 to 40, and a whole number `target` from 1 to 40. The inputs are chosen so that there are fewer than 150 different combinations. Return every combination of candidates whose numbers add up to `target`. You may use the same candidate as many times as you like.

Each combination is a list with its numbers in order from smallest to largest. Two combinations are different if they use different numbers or different counts of a number. The combinations can come back in any order. If no combination works, return an empty list.

For example, candidates [2, 3, 6, 7] and target 7 give [2, 2, 3] and [7].

::exercise
---
id: iv-medium-043
prompt: Write a function combination_sum(candidates, target) that returns every combination of candidates that adds up to target, each combination sorted from smallest to largest.
starter: |
  # write your code below
  def combination_sum(candidates, target):
      pass
hints:
  - Sort the candidates first. Then build each combination by only trying candidates at or after the last one you used, so the same set is never built twice.
  - Stop a path as soon as its total goes above the target, or when the remaining amount is smaller than the candidate you are trying.
tests:
  - check: 'assert sorted(combination_sum([2, 3, 6, 7], 7)) == [[2, 2, 3], [7]]'
  - check: 'assert sorted(combination_sum([2, 3, 5], 8)) == [[2, 2, 2, 2], [2, 3, 3], [3, 5]]'
  - check: 'assert combination_sum([5], 3) == []'
  - check: 'assert combination_sum([2], 1) == []'
  - check: 'assert combination_sum([4], 8) == [[4, 4]]'
  - check: 'assert sorted(combination_sum([7, 3, 2], 7)) == [[2, 2, 3], [7]]'
  - check: 'assert sorted(combination_sum([10, 2], 12)) == [[2, 2, 2, 2, 2, 2], [2, 10]]'
  - check: 'assert len(combination_sum([2, 3, 4, 5], 15)) == 14'
big: 'assert (lambda r: len(r) == 90 and sum(len(c) for c in r) == 1098 and all(sum(c) == 40 and c == sorted(c) for c in r) and len({tuple(c) for c in r}) == 90)(combination_sum([7, 5, 3, 2], 40)); assert (lambda r: len(r) == 6 and sum(len(c) for c in r) == 55 and all(sum(c) == 40 and c == sorted(c) for c in r) and len({tuple(c) for c in r}) == 6)(combination_sum([27, 2, 31, 24, 33, 25, 23, 29, 26, 32, 28, 30], 40))'
solution: |
  def combination_sum(candidates, target):
      candidates = sorted(candidates)
      result = []

      def build(start, rest, path):
          if rest == 0:
              result.append(path[:])
              return
          for i in range(start, len(candidates)):
              c = candidates[i]
              if c <= rest:
                  path.append(c)
                  build(i, rest - c, path)
                  path.pop()

      build(0, target, [])
      return result
brute: |
  def combination_sum(candidates, target):
      from itertools import combinations_with_replacement
      found = []
      for size in range(1, target // min(candidates) + 1):
          for combo in combinations_with_replacement(sorted(candidates), size):
              if sum(combo) == target:
                  found.append(list(combo))
      return found
random:
  call: combination_sum
  gen: |
    def gen(rng, size):
        while True:
            candidates = rng.sample(range(2, 41), rng.randint(1, 5))
            target = rng.randint(1, 40)
            ways = [1] + [0] * target
            for c in candidates:
                for t in range(c, target + 1):
                    ways[t] += ways[t - c]
            if ways[target] < 150:
                return (candidates, target)
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
slow:
  - |
    def combination_sum(candidates, target):
        found = set()

        def build(rest, path):
            if rest == 0:
                found.add(tuple(sorted(path)))
                return
            for c in candidates:
                if c <= rest:
                    path.append(c)
                    build(rest - c, path)
                    path.pop()

        build(target, [])
        return [list(t) for t in found]
wrong:
  - |
    def combination_sum(candidates, target):
        candidates = sorted(candidates)
        result = []

        def build(start, rest, path):
            if rest == 0:
                result.append(path[:])
                return
            for i in range(start + 1, len(candidates)):
                c = candidates[i]
                if c <= rest:
                    path.append(c)
                    build(i, rest - c, path)
                    path.pop()

        build(0, target, [])
        return result
  - |
    def combination_sum(candidates, target):
        candidates = sorted(candidates)
        result = []

        def build(start, rest, path):
            if rest == 0:
                result.append(path[:])
                return
            for i in range(start, len(candidates)):
                c = candidates[i]
                if c < rest:
                    path.append(c)
                    build(i, rest - c, path)
                    path.pop()

        build(0, target, [])
        return result
  - |
    def combination_sum(candidates, target):
        result = []

        def build(start, rest, path):
            if rest == 0:
                result.append(path[:])
                return
            for i in range(start, len(candidates)):
                c = candidates[i]
                if c <= rest:
                    path.append(c)
                    build(i, rest - c, path)
                    path.pop()

        build(0, target, [])
        return result
---
::
