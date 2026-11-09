---
title: Fruit Into Baskets
tier: medium
order: 27
leetcode: 904
url: https://leetcode.com/problems/fruit-into-baskets/
companies: [Amazon, Google, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You walk along a row of fruit trees. The row is a list `fruits` of 1 to 100000 whole numbers, where each number is the kind of fruit on that tree, from 0 to 100000. You have two baskets, and each basket can hold only one kind of fruit. You must start at any tree you like, and then walk right one tree at a time. At each tree you must pick its fruit into a basket, and you stop when the next tree has a third kind of fruit that you cannot fit. Return the most fruit you can pick.

For example, with fruits = [1, 2, 1], you can pick all three, because only two kinds appear. With fruits = [1, 2, 3, 2, 2], the best is the last four trees, which hold 2 and 3, so the answer is 4.

::exercise
---
id: iv-medium-027
prompt: Write a function total_fruit(fruits) that returns the length of the longest run of neighboring trees that holds at most two kinds of fruit.
starter: |
  # write your code below
  def total_fruit(fruits):
      pass
hints:
  - Keep a window of trees and a count of each fruit kind inside it. Move the right end one step at a time.
  - When the window has three kinds, move the left end right until only two kinds are left. Remove a kind from the count once its count reaches zero.
tests:
  - check: assert total_fruit([1, 2, 1]) == 3
  - check: assert total_fruit([0, 1, 2, 2]) == 3
  - check: assert total_fruit([1, 2, 3, 2, 2]) == 4
  - check: assert total_fruit([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]) == 5
  - check: assert total_fruit([1, 0, 1, 4, 1, 4, 1, 2, 3]) == 5
  - check: assert total_fruit([1]) == 1
  - check: assert total_fruit([1, 2, 3, 4, 5]) == 2
  - check: assert total_fruit([0, 0]) == 2
big: 'assert total_fruit([(i // 300) % 3 for i in range(100000)]) == 600'
slow:
  - |
    def total_fruit(fruits):
        best = 0
        n = len(fruits)
        for i in range(n):
            kinds = set()
            for j in range(i, n):
                kinds.add(fruits[j])
                if len(kinds) > 2:
                    break
                best = max(best, j - i + 1)
        return best
solution: |
  def total_fruit(fruits):
      counts = {}
      left = 0
      best = 0
      for right, f in enumerate(fruits):
          counts[f] = counts.get(f, 0) + 1
          while len(counts) > 2:
              g = fruits[left]
              counts[g] -= 1
              if counts[g] == 0:
                  del counts[g]
              left += 1
          best = max(best, right - left + 1)
      return best
brute: |
  def total_fruit(fruits):
      best = 0
      for i in range(len(fruits)):
          for j in range(i, len(fruits)):
              if len(set(fruits[i:j + 1])) <= 2:
                  best = max(best, j - i + 1)
      return best
random:
  call: total_fruit
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 3) for _ in range(rng.randint(1, size + 4))],)
wrong:
  - |
    def total_fruit(fruits):
        counts = {}
        left = 0
        best = 0
        for right, f in enumerate(fruits):
            counts[f] = counts.get(f, 0) + 1
            while len(counts) > 2:
                g = fruits[left]
                counts[g] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
  - |
    def total_fruit(fruits):
        counts = {}
        left = 0
        best = 0
        for right, f in enumerate(fruits):
            counts[f] = counts.get(f, 0) + 1
            best = max(best, right - left + 1)
            while len(counts) > 2:
                g = fruits[left]
                counts[g] -= 1
                if counts[g] == 0:
                    del counts[g]
                left += 1
        return best
  - |
    def total_fruit(fruits):
        counts = {}
        left = 0
        best = 0
        for right, f in enumerate(fruits):
            counts[f] = counts.get(f, 0) + 1
            while len(counts) > 3:
                g = fruits[left]
                counts[g] -= 1
                if counts[g] == 0:
                    del counts[g]
                left += 1
            best = max(best, right - left + 1)
        return best
equivalent:
  - "best = 1"  # why: the row always has at least one tree, and the first step sets best to at least 1 anyway, so the starting value never shows
  - "best = -1"  # why: the row always has at least one tree, and the first step sets best to at least 1 anyway, so the starting value never shows
---
::
