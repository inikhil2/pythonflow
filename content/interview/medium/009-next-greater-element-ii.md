---
title: Next Greater Element II
tier: medium
order: 9
leetcode: 503
url: https://leetcode.com/problems/next-greater-element-ii/
companies: [Meta, Amazon, Google]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a list `nums` of n whole numbers, where 1 <= n <= 10000 and each value is from -1000000000 to 1000000000. The list is circular: after the last value comes the first one again. For each position, look forward around the circle and find the first value that is strictly bigger than the value there. Return a list of the same length, where entry i is that bigger value, or -1 if no value in the whole circle is bigger. A value equal to yours does not count as bigger.

A plain search from each position works. It takes a long time on a long list where the bigger values are far away. A stack of positions that are still waiting for a bigger value handles the whole list in a single pass, and going around the list twice lets the wrap-around positions find theirs.

::exercise
---
id: iv-medium-009
prompt: Write a function next_greater_elements(nums) that returns, for each position, the first strictly bigger value going forward around the circle, or -1 if there is none.
starter: |
  # write your code below
  def next_greater_elements(nums):
      pass
hints:
  - Walk through the list twice, using position k % n, so the positions near the end can wrap around to the start.
  - Keep a stack of positions that have no answer yet. When a new value is bigger than the value at the top, it is the answer for that position.
tests:
  - check: assert next_greater_elements([1, 2, 1]) == [2, -1, 2]
  - check: assert next_greater_elements([1, 2, 3, 4, 3]) == [2, 3, 4, -1, 4]
  - check: assert next_greater_elements([5]) == [-1]
  - check: assert next_greater_elements([3, 3]) == [-1, -1]
  - check: assert next_greater_elements([2, 1]) == [-1, 2]
  - check: assert next_greater_elements([1, 1, 2]) == [2, 2, -1]
  - check: assert next_greater_elements([-1, -5, -3]) == [-1, -3, -1]
big: 'assert (lambda v: __import__("hashlib").sha256(str(next_greater_elements(v)).encode()).hexdigest())([1000000000 - 7 * i for i in range(9000)] + [(i * 7919) % 201 - 100 for i in range(1000)]) == "36aebeba712ba379ce3ff7cc996058050b5dc6ef97e3e67e1f2469cfd14792eb"'
solution: |
  def next_greater_elements(nums):
      n = len(nums)
      result = [-1] * n
      waiting = []
      for k in range(2 * n):
          i = k % n
          while waiting and nums[waiting[-1]] < nums[i]:
              result[waiting.pop()] = nums[i]
          if k < n:
              waiting.append(i)
      return result
slow:
  - |
    def next_greater_elements(nums):
        n = len(nums)
        result = []
        for i in range(n):
            answer = -1
            for step in range(1, n):
                if nums[(i + step) % n] > nums[i]:
                    answer = nums[(i + step) % n]
                    break
            result.append(answer)
        return result
brute: |
  def next_greater_elements(nums):
      n = len(nums)
      result = []
      for i in range(n):
          answer = -1
          for step in range(1, n):
              if nums[(i + step) % n] > nums[i]:
                  answer = nums[(i + step) % n]
                  break
          result.append(answer)
      return result
random:
  call: next_greater_elements
  gen: |
    def gen(rng, size):
        return ([rng.randint(-5, 5) for _ in range(max(size, 1) + 1)],)
wrong:
  - |
    def next_greater_elements(nums):
        n = len(nums)
        result = [-1] * n
        waiting = []
        for i in range(n):
            while waiting and nums[waiting[-1]] < nums[i]:
                result[waiting.pop()] = nums[i]
            waiting.append(i)
        return result
  - |
    def next_greater_elements(nums):
        n = len(nums)
        return [nums[(i + 1) % n] if nums[(i + 1) % n] > nums[i] else -1 for i in range(n)]
  - |
    def next_greater_elements(nums):
        n = len(nums)
        result = [-1] * n
        waiting = []
        for k in range(2 * n):
            i = k % n
            while waiting and nums[waiting[-1]] <= nums[i]:
                result[waiting.pop()] = nums[i]
            if k < n:
                waiting.append(i)
        return result
equivalent:
  - "for k in range(3 * n):"  # why: after two passes every waiting value is the largest in the list, so a third pass pops nothing
  - "if k <= n:"  # why: the extra push at k = n repeats index 0, and popping that copy assigns the same values the first copy already did
---
::
