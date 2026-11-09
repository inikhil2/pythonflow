---
title: Reverse Pairs
tier: hard
order: 44
leetcode: 493
url: https://leetcode.com/problems/reverse-pairs/
companies: [Google, Amazon, Meta]
topic: Binary search
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/05-binary-search, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You are given a list of whole numbers. Count the pairs of positions `i` and `j` where `i` comes before `j`, and the number at `i` is more than twice the number at `j`. The list has between 1 and 10000 numbers, each from -10^9 to 10^9. Pairs with equal values or with the same position do not count.

A check of every pair takes time that grows with the square of the list length, which is too slow for long lists. Find a method that counts the pairs without looking at each pair on its own.

::exercise
---
id: iv-hard-044
prompt: Write a function reverse_pairs(nums) that returns how many pairs of positions i < j satisfy nums[i] > 2 * nums[j].
starter: |
  # write your code below
  def reverse_pairs(nums):
      pass
hints:
  - Split the list in half, count the pairs inside each half recursively, then count the pairs with one number in each half.
  - When both halves are sorted, a pointer over the right half only moves forward as the left values grow.
tests:
  - check: assert reverse_pairs([1, 3, 2, 3, 1]) == 2
  - check: assert reverse_pairs([2, 4, 3, 5, 1]) == 3
  - check: assert reverse_pairs([1]) == 0
  - check: assert reverse_pairs([1, 2, 3]) == 0
  - check: assert reverse_pairs([4, 1]) == 1
  - check: assert reverse_pairs([1, 4]) == 0
  - check: assert reverse_pairs([2, 1]) == 0
  - check: assert reverse_pairs([-1, -3]) == 1
  - check: assert reverse_pairs([0, 0]) == 0
  - check: assert reverse_pairs([10, 2, 1, 0]) == 5
solution: |
  def reverse_pairs(nums):
      def sort_count(a):
          if len(a) <= 1:
              return a, 0
          mid = len(a) // 2
          left, c1 = sort_count(a[:mid])
          right, c2 = sort_count(a[mid:])
          count = c1 + c2
          j = 0
          for x in left:
              while j < len(right) and x > 2 * right[j]:
                  j += 1
              count += j
          return sorted(left + right), count

      return sort_count(nums)[1]
# why: the bisect and insort version (count from the right, binary search each number against the seen ones) runs in well under a second at 10000 numbers, so it is not a trap and is left out.
slow:
  - |
    def reverse_pairs(nums):
        count = 0
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] > 2 * nums[j]:
                    count += 1
        return count
brute: |
  from itertools import combinations

  def reverse_pairs(nums):
      return sum(1 for i, j in combinations(range(len(nums)), 2) if nums[i] > 2 * nums[j])
big: 'assert reverse_pairs([(i * 7919) % 2000001 - 1000000 for i in range(10000)]) == 24973260'
random:
  call: reverse_pairs
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 3, 8))
        return ([rng.randint(-5, 5) for _ in range(n)],)
wrong:
  - |
    def reverse_pairs(nums):
        count = 0
        for i in range(len(nums)):
            for j in range(len(nums)):
                if i != j and nums[i] > 2 * nums[j]:
                    count += 1
        return count
  - |
    def reverse_pairs(nums):
        count = 0
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] >= 2 * nums[j]:
                    count += 1
        return count
  - |
    def reverse_pairs(nums):
        count = 0
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] > nums[j]:
                    count += 1
        return count
---
::
