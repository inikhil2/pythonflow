---
title: Next Greater Element I
tier: easy
order: 62
leetcode: 496
url: https://leetcode.com/problems/next-greater-element-i/
companies: [Google, Amazon, Meta]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get two lists, `nums1` and `nums2`. Both lists hold distinct whole numbers, and every value in `nums1` also appears in `nums2`. Each list has between 1 and 50000 items, and every value is a whole number from 0 to 50000.

For each value in `nums1`, find its place in `nums2`, then look to the right of that place for the first value that is larger than it. Return one answer per value of `nums1`, in the same order. Use the larger value you found, or -1 when no larger value comes after it in `nums2`.

::exercise
---
id: iv-easy-062
prompt: Write a function next_greater(nums1, nums2) that returns, for each value in nums1, the first larger value to its right in nums2, or -1.
starter: |
  # write your code below
  def next_greater(nums1, nums2):
      pass
hints:
  - Find the position of each value in nums2 first, then scan only the values after that position.
  - Walking nums2 from right to left with a stack of candidates answers every value in one pass.
tests:
  - check: assert next_greater([4, 1, 2], [1, 3, 4, 2]) == [-1, 3, -1]
  - check: assert next_greater([2, 4], [4, 1, 2, 3]) == [3, -1]
  - check: assert next_greater([1, 3], [3, 1, 2, 4]) == [2, 4]
  - check: assert next_greater([1], [1]) == [-1]
  - check: assert next_greater([2], [2, 3, 5]) == [3]
  - check: assert next_greater([2], [2, 0, 5]) == [5]
  - check: assert next_greater([5, 4], [5, 4, 3, 2, 1, 6]) == [6, 6]
solution: |
  def next_greater(nums1, nums2):
      greater = {}
      stack = []
      for value in nums2:
          while stack and stack[-1] < value:
              greater[stack.pop()] = value
          stack.append(value)
      answer = []
      for x in nums1:
          answer.append(greater.get(x, -1))
      return answer
brute: |
  def next_greater(nums1, nums2):
      answer = []
      for x in nums1:
          result = -1
          start = nums2.index(x) + 1
          for y in nums2[start:]:
              if y > x:
                  result = y
                  break
          answer.append(result)
      return answer
random:
  call: next_greater
  gen: |
    def gen(rng, size):
        nums2 = rng.sample(range(0, 61), min(61, size + 2))
        nums1 = rng.sample(nums2, rng.randint(1, len(nums2)))
        return (nums1, nums2)
big: assert (r := next_greater([(i * 7919) % 50001 for i in range(0, 50000, 2)], [(i * 7919) % 50001 for i in range(50000)])) and len(r) == 25000 and sum(r) == 801899126 and r[0] == 7919 and r[-1] == 34163 and r.count(-1) == 17
slow:
  - |
    def next_greater(nums1, nums2):
        result = []
        for v in nums1:
            i = nums2.index(v)
            result.append(next(filter(v.__lt__, nums2[i + 1:]), -1))
        return result
  - |
    def next_greater(nums1, nums2):
        answer = []
        for x in nums1:
            result = -1
            start = nums2.index(x) + 1
            for y in nums2[start:]:
                if y > x:
                    result = y
                    break
            answer.append(result)
        return answer
wrong:
  - |
    def next_greater(nums1, nums2):
        answer = []
        for x in nums1:
            result = -1
            for y in nums2:
                if y > x:
                    result = y
                    break
            answer.append(result)
        return answer
  - |
    def next_greater(nums1, nums2):
        answer = []
        for x in nums1:
            i = nums2.index(x)
            if i + 1 < len(nums2) and nums2[i + 1] > x:
                answer.append(nums2[i + 1])
            else:
                answer.append(-1)
        return answer
  # why: wrong #3 is caught by time on big (max over every right-hand slice) and by output on fixed tests: next_greater([1, 3], [3, 1, 2, 4]) == [2, 4] returns 4 for 1, where the answer is 2.
  - |
    def next_greater(nums1, nums2):
        answer = []
        for x in nums1:
            right = nums2[nums2.index(x) + 1:]
            if right and max(right) > x:
                answer.append(max(right))
            else:
                answer.append(-1)
        return answer
equivalent:
  - "while stack and stack[-1] <= value:"  # why: nums2 values are distinct, so stack[-1] never equals value
---
::
