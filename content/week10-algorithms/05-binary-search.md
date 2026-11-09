---
title: Binary search
week: 10
order: 5
minutes: 14
concepts: [lists, while-loops, numbers]
---

Looking up a name in a phone book does not start at page 1. You open the middle, see whether your name comes before or after it, and throw away the half that cannot hold it. **Binary search** does the same with a sorted list. Each step halves the part still in play, so a list of a million values needs about 20 checks.

Keep two positions, `lo` and `hi`. The answer always lies between them. Here `hi` is one past the last index, so the part still in play is the half-open range `lo` up to `hi`. Look at the middle, then move either `lo` or `hi`:

```python
nums = [1, 3, 5, 7]
target = 5
lo, hi = 0, len(nums)
while lo < hi:
    mid = (lo + hi) // 2
    if nums[mid] < target:
        lo = mid + 1
    else:
        hi = mid
print(lo)
```

This finds the first index where `target` could go and keep the list sorted. Here it is `2`. Step through it:

::trace
---
code: |
  nums = [1, 3, 5, 7]
  target = 5
  lo, hi = 0, len(nums)
  while lo < hi:
      mid = (lo + hi) // 2
      if nums[mid] < target:
          lo = mid + 1
      else:
          hi = mid
  print(lo)
---
::

Check the two updates. If `nums[mid]` is smaller than `target`, the answer is after `mid`, so `lo = mid + 1`. Otherwise `mid` might be the answer, so `hi = mid` keeps it. The loop stops when `lo` and `hi` meet, and that spot is the answer. A common mistake is `hi = len(nums) - 1`, which can skip the last index when `target` is bigger than every value. The `bisect` module does this work for you: `bisect.bisect_left(nums, 5)` also gives `2`.

## Search on the answer

Binary search also works when the list is not in front of you, as long as the answers are in order. Suppose you want the smallest speed `s` that finishes a job in time. A speed that works makes every later speed work too. So you can search over the speeds, from 1 up to the biggest pile, using the same `lo` and `hi`. Each test asks: does speed `mid` work? If it does, the answer is `mid` or lower, so `hi = mid`. If not, `lo = mid + 1`.

Your turn: find where a value fits.

::exercise
---
id: w10-l5-ex1
prompt: Read a line of whole numbers sorted from low to high, then a target number on the next line. Print the index where the target goes so that the list stays sorted. If the target is already in the list, print the index of its first copy.
starter: |
  nums = [int(n) for n in input().split()]
  target = int(input())
  print(0)
hints:
  - Keep lo and hi with the answer always between them. Start with lo = 0 and hi = len(nums).
  - If nums[mid] is less than target, set lo = mid + 1. Otherwise set hi = mid.
  - Stop when lo equals hi, then print lo.
tests:
  - stdin: |
      1 3 5 7
      5
    stdout: "2"
  - stdin: |
      1 3 5 7
      4
    stdout: "2"
  - stdin: |
      1 3 5 7
      0
    stdout: "0"
  - stdin: |
      1 3 5 7
      9
    stdout: "4"
  - stdin: |
      2 2 2
      2
    stdout: "0"
solution: |
  nums = [int(n) for n in input().split()]
  target = int(input())
  lo, hi = 0, len(nums)
  while lo < hi:
      mid = (lo + hi) // 2
      if nums[mid] < target:
          lo = mid + 1
      else:
          hi = mid
  print(lo)
---
::

Now search on the answer instead of on a list.

::exercise
---
id: w10-l5-ex2
prompt: Read a line of pile sizes, then a whole number of hours on the next line. Each hour you can eat up to s items from one pile, and you move to the next pile only after finishing the first. A pile of p items takes ceil(p / s) hours. Print the smallest whole number s that lets you finish all piles within the hours given.
starter: |
  piles = [int(n) for n in input().split()]
  hours = int(input())
  print(max(piles))
hints:
  - The smallest speed is 1 and the largest useful speed is max(piles). Set lo = 1 and hi = max(piles).
  - For a speed mid, the hours needed are the sum of (p + mid - 1) // mid over all piles. That is ceil(p / mid) without floats.
  - If the hours needed are at most hours, speed mid works, so set hi = mid. Otherwise set lo = mid + 1.
tests:
  - stdin: |
      3 6 7 11
      8
    stdout: "4"
  - stdin: |
      30 11 23 4 20
      5
    stdout: "30"
  - stdin: |
      5 5
      2
    stdout: "5"
  - stdin: |
      10 10
      4
    stdout: "5"
  - stdin: |
      1 1 1
      3
    stdout: "1"
solution: |
  piles = [int(n) for n in input().split()]
  hours = int(input())
  lo, hi = 1, max(piles)
  while lo < hi:
      mid = (lo + hi) // 2
      needed = sum((p + mid - 1) // mid for p in piles)
      if needed <= hours:
          hi = mid
      else:
          lo = mid + 1
  print(lo)
---
::
