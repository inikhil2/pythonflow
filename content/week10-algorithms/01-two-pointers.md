---
title: Two pointers and the sliding window
week: 10
order: 1
minutes: 12
concepts: [lists, while-loops, for-loops]
---

Many list problems ask you to check pairs of values or runs of values. The obvious way is two nested loops, which checks every pair. That gets slow fast: a list of 10,000 numbers has about 50 million pairs.

A **two pointer** approach uses two index variables that move through the list and stop as soon as the answer is known. It needs the list to be sorted, or a rule that tells you which pointer to move.

Here is a small example. Given a sorted list, is there a pair that adds up to `target`? Start one pointer at the front, `left`, and one at the back, `right`:

```python
nums = [1, 3, 4, 6, 9]
target = 10
left = 0
right = len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total == target:
        print("found", nums[left], nums[right])
        break
    elif total < target:
        left += 1
    else:
        right -= 1
```

Step through it in your head first, then with the trace below. The total is too small, so the small end moves up. The total is too big, so the large end moves down. Each step throws away one value that cannot be part of the answer, so the loop takes at most `len(nums)` steps.

::trace
---
code: |
  nums = [1, 3, 4, 6, 9]
  target = 10
  left = 0
  right = len(nums) - 1
  while left < right:
      total = nums[left] + nums[right]
      if total == target:
          print("found", nums[left], nums[right])
          break
      elif total < target:
          left += 1
      else:
          right -= 1
---
::

Stop when `left` and `right` meet, because a pair needs two different positions. A list `[5, 5]` with target `10` still counts, since the two 5s sit at different positions.

A **sliding window** is the same idea for runs of values. Instead of two far-apart pointers, you keep a window of `k` values and slide it one step at a time. Rather than adding up all `k` values again, you take off the value that leaves the window and add the value that enters:

```python
nums = [1, 5, 2, 8, 1]
k = 2
window = sum(nums[:k])
best = window
for i in range(k, len(nums)):
    window += nums[i] - nums[i - k]
    best = max(best, window)
print(best)
```

The first window is `1 + 5 = 6`. Moving it right takes off `1` and adds `2`, giving `5 + 2 = 7`. The next window gives `2 + 8 = 10`, and the last gives `8 + 1 = 9`. The best is `10`, which the loop prints. Each step does two arithmetic operations, however big `k` is.

A common mistake is to restart the sum for every window, using `sum(nums[i:i + k])` in a loop. That still works, but it does `k` additions for each window, which is the slow version of the same idea.

Your turn: find the pair.

::exercise
---
id: w10-l1-ex1
prompt: Read a line of whole numbers in sorted order, then a target number on the next line. Print YES if two different positions in the list add up to the target, or NO if they do not.
starter: |
  nums = [int(n) for n in input().split()]
  target = int(input())
  print("NO")
hints:
  - Start left at the first index and right at the last index, as in the worked example.
  - If the total is too small, move left up by one. If it is too big, move right down by one.
  - Print YES as soon as the total equals the target. If the two pointers meet first, print NO.
tests:
  - stdin: |
      1 3 4 6 9
      10
    stdout: "YES"
  - stdin: |
      1 3 4 6 9
      8
    stdout: "NO"
  - stdin: |
      2 5
      7
    stdout: "YES"
  - stdin: |
      5 5
      10
    stdout: "YES"
  - stdin: |
      1 2 3
      6
    stdout: "NO"
solution: |
  nums = [int(n) for n in input().split()]
  target = int(input())
  left = 0
  right = len(nums) - 1
  found = False
  while left < right:
      total = nums[left] + nums[right]
      if total == target:
          found = True
          break
      elif total < target:
          left += 1
      else:
          right -= 1
  print("YES" if found else "NO")
---
::

Now slide a window.

::exercise
---
id: w10-l1-ex2
prompt: Read a whole number k, then a line of whole numbers. Print the largest sum of k numbers that sit next to each other in the list.
starter: |
  k = int(input())
  nums = [int(n) for n in input().split()]
  print(sum(nums[:k]))
hints:
  - Find the sum of the first k numbers, then slide the window one step at a time.
  - When the window moves right by one, take off the number that leaves it, nums[i - k], and add the number that enters it, nums[i].
  - Keep the largest window sum you have seen, and print it at the end.
tests:
  - stdin: |
      2
      1 5 2 8 1
    stdout: "10"
  - stdin: |
      3
      4 -1 2 1
    stdout: "5"
  - stdin: |
      1
      7 3 9
    stdout: "9"
  - stdin: |
      4
      1 2 3 4
    stdout: "10"
  - stdin: |
      3
      5 5 5
    stdout: "15"
solution: |
  k = int(input())
  nums = [int(n) for n in input().split()]
  window = sum(nums[:k])
  best = window
  for i in range(k, len(nums)):
      window += nums[i] - nums[i - k]
      best = max(best, window)
  print(best)
---
::
