---
title: Prefix sums and intervals
week: 10
order: 3
minutes: 14
concepts: [lists, for-loops, numbers]
---

Suppose a list is fixed, and you must answer many questions like "what is the sum from index 2 to index 5?" Adding up the values each time is slow when there are many questions. A **prefix sum** list does the adding once. Entry `i` holds the total of the first `i` values:

```python
nums = [3, 1, 4, 2]
prefix = [0]
for n in nums:
    prefix.append(prefix[-1] + n)
print(prefix)
```

This prints `[0, 3, 4, 8, 10]`. Now the sum of `nums[1]` up to `nums[2]`, which is `1 + 4`, is `prefix[3] - prefix[1]`, which is `8 - 3 = 5`. One subtraction answers each question. The `0` at the front means the sum of an empty run is `0`, so you never need a special case.

The general rule: the sum of `nums[a]` through `nums[b]` is `prefix[b + 1] - prefix[a]`.

## Sort, then merge

An **interval** is a start and an end, such as `1 6` for everything from 1 to 6. Given several intervals that may overlap, a common job is to merge them. Sort them by start first. Then any interval that starts before the last merged one ends must overlap it, so extend the end. Otherwise it begins a new group.

```python
intervals = [(8, 10), (1, 3), (2, 6)]
intervals.sort()
merged = []
for start, end in intervals:
    if merged and start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
print(merged)
```

Sorting puts `(1, 3)` and `(2, 6)` next to each other, so they merge into `[1, 6]`. Touching intervals count as overlapping here. `(1, 3)` and `(3, 5)` become `[1, 5]`.

## Bit tricks

Every whole number is stored as bits, which are 0s and 1s. Python has operators that work on those bits:

- `&` (and): a bit is 1 only if both bits are 1.
- `|` (or): a bit is 1 if either bit is 1.
- `^` (xor): a bit is 1 if the two bits differ.
- `<<` shifts bits left, which multiplies by 2 for each shift.
- `>>` shifts bits right, which divides by 2 for each shift, dropping the remainder.

Step through a few with `6` (binary `110`) and `3` (binary `011`):

::trace
---
code: |
  a = 6
  b = 3
  print(a & b)
  print(a | b)
  print(a ^ b)
  print(1 << 3)
  print(16 >> 2)
---
::

The output is `2`, `7`, `5`, `8` and `4`. A common trick is `n & (n - 1)`, which clears the lowest 1 bit of `n`. Applied to a power of two it gives `0`, which is how you can check for powers of two.

Your turn: sum a range without adding it up again.

::exercise
---
id: w10-l3-ex1
prompt: Read a line of whole numbers. Then read two indexes a and b on one line. Print the sum of the numbers from index a to index b, including both ends.
starter: |
  nums = [int(n) for n in input().split()]
  a, b = map(int, input().split())
  print(0)
hints:
  - Build a prefix list that starts with 0, and add each number to the last total.
  - The sum from a to b is prefix[b + 1] - prefix[a].
  - Check your answer with the first test. Indexes start at 0, so 1 3 gives the second, third and fourth numbers.
tests:
  - stdin: |
      1 2 3 4 5
      1 3
    stdout: "9"
  - stdin: |
      1 2 3 4 5
      0 4
    stdout: "15"
  - stdin: |
      10 -2 7
      2 2
    stdout: "7"
  - stdin: |
      4 4 4
      0 0
    stdout: "4"
solution: |
  nums = [int(n) for n in input().split()]
  a, b = map(int, input().split())
  prefix = [0]
  for n in nums:
      prefix.append(prefix[-1] + n)
  print(prefix[b + 1] - prefix[a])
---
::

Now merge the intervals.

::exercise
---
id: w10-l3-ex2
prompt: Read a whole number n, then n lines, each with a start and an end. Merge the intervals that overlap or touch, then print each merged interval as its start and end separated by a space, one per line, in order of start.
starter: |
  n = int(input())
  for _ in range(n):
      start, end = map(int, input().split())
      print(start, end)
hints:
  - Store each interval as a (start, end) pair in a list, then sort the list.
  - Walk through the sorted list. If a start is at or before the end of the last merged interval, extend that end with max().
  - Otherwise add a new interval to the merged list. After the loop, print each merged interval on its own line.
tests:
  - stdin: |
      3
      8 10
      1 3
      2 6
    stdout: "1 6\n8 10"
  - stdin: |
      2
      1 3
      3 5
    stdout: "1 5"
  - stdin: |
      2
      1 2
      4 5
    stdout: "1 2\n4 5"
  - stdin: |
      1
      7 7
    stdout: "7 7"
solution: |
  n = int(input())
  intervals = []
  for _ in range(n):
      start, end = map(int, input().split())
      intervals.append((start, end))
  intervals.sort()
  merged = []
  for start, end in intervals:
      if merged and start <= merged[-1][1]:
          merged[-1][1] = max(merged[-1][1], end)
      else:
          merged.append([start, end])
  for start, end in merged:
      print(start, end)
---
::
