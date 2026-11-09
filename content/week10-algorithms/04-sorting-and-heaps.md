---
title: Sorting and heaps
week: 10
order: 4
minutes: 14
concepts: [lists, for-loops, functions]
---

`sorted` takes any list and gives back a new sorted list. For plain numbers or strings you need nothing more:

```python
print(sorted([4, 1, 3]))
print(sorted(["pear", "apple"]))
```

Often you want to sort by something else, such as a score inside a pair. Pass a `key` function. It takes one item and returns the value to compare. Here the pairs are sorted by their second value:

```python
rows = [("ann", 5), ("bob", 9), ("cy", 2)]
print(sorted(rows, key=lambda row: row[1]))
```

To break ties, return a tuple. Python compares tuples one part at a time. The minus sign makes the score sort from high to low, and the name sorts A to Z when scores are equal:

```python
rows = [("zed", 1), ("amy", 1), ("bob", 9)]
print(sorted(rows, key=lambda row: (-row[1], row[0])))
```

This prints `bob` first, then `amy`, then `zed`.

## Heaps

Sorting everything costs more than you need when you only want the smallest value, or the few biggest. A **heap** is a structure that always gives back the smallest item quickly. Python's `heapq` module keeps a plain list as a heap:

```python
import heapq

heap = []
for x in [5, 1, 4]:
    heapq.heappush(heap, x)
print(heapq.heappop(heap))
print(heapq.heappop(heap))
```

`heappush` adds a value, and `heappop` removes and returns the smallest one. The output is `1` then `4`. Step through it:

::trace
---
code: |
  import heapq

  heap = []
  for x in [5, 1, 4]:
      heapq.heappush(heap, x)
  print(heapq.heappop(heap))
  print(heapq.heappop(heap))
---
::

For the largest values, use `heapq.nlargest(k, items)`. It returns the `k` biggest items, largest first, without sorting the whole list.

## Greedy choices

A **greedy** method sorts the choices and then takes the best one that still fits, one at a time, without going back. It works only when a local best choice never blocks a better overall answer.

Take scheduling jobs that must not overlap. Sort the jobs by the time they end. Always take the job that ends first and does not clash with the last one you took. Why does this beat the other orders? Any other first choice ends later, and so it leaves no more room for the jobs after it. Taking the earliest finisher always leaves at least as much room.

Greedy does not always work. With coins of 1, 3 and 4, making 6 by taking the biggest coin first gives `4 + 1 + 1`, three coins. The best answer is `3 + 3`, two coins. Check a greedy idea on a case like this before you trust it.

Your turn: sort with a key and break ties.

::exercise
---
id: w10-l4-ex1
prompt: Read a whole number n, then n lines, each with a name and a score separated by a space. Print the names, one per line, sorted by score from high to low. When two scores are equal, sort those names from A to Z.
starter: |
  n = int(input())
  rows = []
  for _ in range(n):
      name, score = input().split()
      rows.append((name, int(score)))
  for name, score in rows:
      print(name)
hints:
  - Sort rows with sorted(rows, key=...). Build the key as a tuple.
  - Use -score in the key to put high scores first.
  - Put the name second in the tuple, so it breaks ties.
tests:
  - stdin: |
      3
      ann 5
      bob 9
      cy 5
    stdout: "bob\nann\ncy"
  - stdin: |
      2
      zed 1
      amy 1
    stdout: "amy\nzed"
  - stdin: |
      1
      solo 4
    stdout: "solo"
  - stdin: |
      3
      x 2
      y 10
      z 7
    stdout: "y\nz\nx"
solution: |
  n = int(input())
  rows = []
  for _ in range(n):
      name, score = input().split()
      rows.append((name, int(score)))
  rows = sorted(rows, key=lambda row: (-row[1], row[0]))
  for name, score in rows:
      print(name)
---
::

Now use a heap to find the biggest values.

::exercise
---
id: w10-l4-ex2
prompt: Read a whole number k, then a line of whole numbers. Print the k biggest numbers, one per line, biggest first.
starter: |
  k = int(input())
  nums = [int(n) for n in input().split()]
  for x in sorted(nums)[:k]:
      print(x)
hints:
  - heapq.nlargest(k, nums) gives the k biggest numbers, largest first.
  - Print each number on its own line with a for loop.
  - The starter prints the smallest numbers, because sorted() puts the smallest first.
tests:
  - stdin: |
      2
      3 9 1 7
    stdout: "9\n7"
  - stdin: |
      3
      4 1 8
    stdout: "8\n4\n1"
  - stdin: |
      2
      -1 -5 -2
    stdout: "-1\n-2"
  - stdin: |
      1
      5 5 2
    stdout: "5"
solution: |
  import heapq

  k = int(input())
  nums = [int(n) for n in input().split()]
  for x in heapq.nlargest(k, nums):
      print(x)
---
::
