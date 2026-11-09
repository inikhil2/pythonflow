---
title: Can Place Flowers
tier: easy
order: 31
leetcode: 605
url: https://leetcode.com/problems/can-place-flowers/
companies: [Google, Amazon, Microsoft]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

You get a list flowerbed of 0s and 1s. A 1 means a flower is already planted there, and a 0 means the spot is empty. The list has at least one spot and at most 20000 spots, and no two planted flowers sit next to each other. You also get a whole number n from 0 to the length of the list. Return True if you can plant n new flowers in empty spots without two flowers ever sitting next to each other, and False otherwise.

::exercise
---
id: iv-easy-031
prompt: Write a function can_place_flowers(flowerbed, n) that returns True if n new flowers can be planted without two flowers touching, and False otherwise.
starter: |
  # write your code below
  def can_place_flowers(flowerbed, n):
      pass
hints:
  - A spot can take a flower only if it and both of its neighbours are empty.
  - Pad the bed with an empty spot at each end, so every real spot has two neighbours, and plant as you go.
tests:
  - check: assert can_place_flowers([1, 0, 0, 0, 1], 1) == True
  - check: assert can_place_flowers([1, 0, 0, 0, 1], 2) == False
  - check: assert can_place_flowers([0], 1) == True
  - check: assert can_place_flowers([0], 0) == True
  - check: assert can_place_flowers([0, 1], 1) == False
  - check: assert can_place_flowers([0, 0, 0, 0, 0], 3) == True
  - check: assert can_place_flowers([0, 0, 0, 0, 0], 4) == False
solution: |
  def can_place_flowers(flowerbed, n):
      total = 0
      run = 1
      for spot in flowerbed:
          if spot == 0:
              run += 1
          else:
              total += (run - 1) // 2
              run = 0
      total += run // 2
      return total >= n
brute: |
  def can_place_flowers(flowerbed, n):
      from itertools import combinations
      spots = [i for i in range(len(flowerbed))
               if flowerbed[i] == 0
               and (i == 0 or flowerbed[i - 1] == 0)
               and (i == len(flowerbed) - 1 or flowerbed[i + 1] == 0)]
      for chosen in combinations(spots, n):
          if all(b - a >= 2 for a, b in zip(chosen, chosen[1:])):
              return True
      return False
random:
  call: can_place_flowers
  gen: |
    def gen(rng, size):
        bed = []
        for _ in range(rng.randint(1, size + 3)):
            free = not bed or bed[-1] == 0
            bed.append(1 if free and rng.random() < 0.3 else 0)
        return (bed, rng.randint(0, len(bed)))
wrong:
  - |
    def can_place_flowers(flowerbed, n):
        return flowerbed.count(0) >= n
  - |
    def can_place_flowers(flowerbed, n):
        bed = [0] + list(flowerbed) + [0]
        count = 0
        for i in range(1, len(bed) - 1):
            if bed[i - 1] == 0 and bed[i] == 0:
                bed[i] = 1
                count += 1
        return count >= n
---
::
