---
title: Candy
tier: hard
order: 3
leetcode: 135
url: https://leetcode.com/problems/candy/
companies: [Amazon, Meta, Google]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/04-sorting-and-heaps]
---

You get a list of children's ratings, in a line. Give every child a whole number of candies, at least one each. A child with a higher rating than a neighbor must get more candies than that neighbor. Children with equal ratings need no particular order between them. Return the smallest total number of candies that makes this true.

There are between 1 and 20000 children, and each rating is a whole number from 0 to 10000. Each child is compared only with the child right before and right after them. A simple rule that fixes the left neighbors and then the right neighbors gives the answer in two passes.

::exercise
---
id: iv-hard-003
prompt: Write a function candy(ratings) that returns the smallest total number of candies that satisfies the rules.
starter: |
  # write your code below
  def candy(ratings):
      pass
hints:
  - Walk left to right and give each child one more candy than the left neighbor when the rating is higher.
  - Walk right to left and raise a child's candy count to one more than the right neighbor when the rating is higher and the count is not already large enough, then add up the counts.
tests:
  - check: assert candy([1, 0, 2]) == 5
  - check: assert candy([1, 2, 2]) == 4
  - check: assert candy([1]) == 1
  - check: assert candy([1, 2, 3]) == 6
  - check: assert candy([3, 2, 1]) == 6
  - check: assert candy([1, 3, 2, 2, 1]) == 7
  - check: assert candy([0, 0, 0, 0]) == 4
  - check: assert candy([5, 4, 3, 2, 1, 0]) == 21
  - check: assert candy([2, 2, 1, 2, 2]) == 7
solution: |
  def candy(ratings):
      n = len(ratings)
      left = [1] * n
      for i in range(1, n):
          if ratings[i] > ratings[i - 1]:
              left[i] = left[i - 1] + 1
      right = [1] * n
      for i in range(n - 2, -1, -1):
          if ratings[i] > ratings[i + 1]:
              right[i] = right[i + 1] + 1
      return sum(max(a, b) for a, b in zip(left, right))
brute: |
  def candy(ratings):
      n = len(ratings)
      counts = [1] * n
      changed = True
      while changed:
          changed = False
          for i in range(n):
              for j in (i - 1, i + 1):
                  if 0 <= j < n and ratings[i] > ratings[j] and counts[i] <= counts[j]:
                      counts[i] = counts[j] + 1
                      changed = True
      return sum(counts)
random:
  call: candy
  gen: |
    def gen(rng, size):
        return ([rng.randint(0, 4) for _ in range(rng.randint(1, size + 3))],)
big: assert candy([((i // 1400) * 7919 % 5) * 2000 + (1400 - i % 1400) for i in range(20000)]) == 60570000
slow:
  - |
    def candy(ratings):
        n = len(ratings)
        counts = [1] * n
        changed = True
        while changed:
            changed = False
            for i in range(n):
                for j in (i - 1, i + 1):
                    if 0 <= j < n and ratings[i] > ratings[j] and counts[i] <= counts[j]:
                        counts[i] = counts[j] + 1
                        changed = True
        return sum(counts)
wrong:
  - |
    def candy(ratings):
        n = len(ratings)
        left = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                left[i] = left[i - 1] + 1
        return sum(left)
  - |
    def candy(ratings):
        n = len(ratings)
        left = [1] * n
        for i in range(1, n):
            if ratings[i] >= ratings[i - 1]:
                left[i] = left[i - 1] + 1
        right = [1] * n
        for i in range(n - 2, -1, -1):
            if ratings[i] >= ratings[i + 1]:
                right[i] = right[i + 1] + 1
        return sum(max(a, b) for a, b in zip(left, right))
  - |
    def candy(ratings):
        n = len(ratings)
        left = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                left[i] = left[i - 1] + 1
        right = [1] * n
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                right[i] = right[i + 1] + 1
        return sum(left) + sum(right) - n
---
::
