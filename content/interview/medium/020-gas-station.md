---
title: Gas Station
tier: medium
order: 20
leetcode: 134
url: https://leetcode.com/problems/gas-station/
companies: [Amazon, Microsoft, Meta]
topic: Greedy
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists]
---

There are n gas stations on a circular road, where 1 <= n <= 10000. You get two lists of whole numbers: `gas[i]` is the fuel you can collect at station i, from 0 to 1000, and `cost[i]` is the fuel you need to drive from station i to the next station, from 0 to 1000. The next station after the last one is the first one. You start with an empty tank at one station, and you collect that station's fuel before you drive on. You may start at any station, and you can drive the whole circle only if your tank never goes below zero.

The inputs are chosen so that at most one starting station works. Return that station's index, counting from 0, or -1 if no station works.

Checking every start in turn works. A faster way is to track the tank as you go: when it drops below zero, no start before the current station can work, so the next station becomes the new start. Also, if the total fuel is less than the total cost, no start works at all.

::exercise
---
id: iv-medium-020
prompt: Write a function start_station(gas, cost) that returns the index of the one station you can start from to drive the whole circle, or -1 if there is none.
starter: |
  # write your code below
  def start_station(gas, cost):
      pass
hints:
  - Compare the total fuel with the total cost first.
  - Keep a running tank. When it goes below zero, start again from the next station and reset the tank.
tests:
  - check: assert start_station([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3
  - check: assert start_station([2, 3, 4], [3, 4, 3]) == -1
  - check: assert start_station([5], [4]) == 0
  - check: assert start_station([1], [1]) == 0
  - check: assert start_station([0], [0]) == 0
  - check: assert start_station([1, 1], [0, 2]) == 0
  - check: assert start_station([0, 0, 4], [1, 1, 1]) == 2
  - check: assert start_station([3, 1, 1], [1, 2, 2]) == 0
big: 'assert (lambda r: (lambda c: start_station([x + y for x, y in zip(c, [r.randint(-1000, 1000) for _ in range(10000)])], c))([r.randint(1000, 9000) for _ in range(10000)]))(__import__("random").Random(186)) == 4041'
slow:
  - |
    def start_station(gas, cost):
        n = len(gas)
        answer = -1
        for s in range(n):
            tank = 0
            ok = True
            for k in range(n):
                i = (s + k) % n
                tank += gas[i] - cost[i]
                if tank < 0:
                    ok = False
            if ok and answer == -1:
                answer = s
        return answer
solution: |
  def start_station(gas, cost):
      if sum(gas) < sum(cost):
          return -1
      start, tank = 0, 0
      for i in range(len(gas)):
          tank += gas[i] - cost[i]
          if tank < 0:
              start = i + 1
              tank = 0
      return start
brute: |
  def start_station(gas, cost):
      n = len(gas)
      for s in range(n):
          tank = 0
          ok = True
          for k in range(n):
              i = (s + k) % n
              tank += gas[i] - cost[i]
              if tank < 0:
                  ok = False
                  break
          if ok:
              return s
      return -1
random:
  call: start_station
  gen: |
    def works(gas, cost, s):
        tank = 0
        n = len(gas)
        for k in range(n):
            i = (s + k) % n
            tank += gas[i] - cost[i]
            if tank < 0:
                return False
        return True

    def gen(rng, size):
        while True:
            n = rng.randint(1, 6)
            gas = [rng.randint(0, 5) for _ in range(n)]
            cost = [rng.randint(0, 5) for _ in range(n)]
            if sum(works(gas, cost, s) for s in range(n)) <= 1:
                return (gas, cost)
wrong:
  - |
    def start_station(gas, cost):
        if sum(gas) < sum(cost):
            return -1
        return 0
  - |
    def start_station(gas, cost):
        if sum(gas) < sum(cost):
            return -1
        start, tank = 0, 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
        return start
  - |
    def start_station(gas, cost):
        if sum(gas) < sum(cost):
            return -1
        start, tank = 0, 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank <= 0:
                start = i + 1
                tank = 0
        return start
equivalent:
  - "tank = -1"  # why: if the running tank hits exactly 0 at a later station, the next station is a second valid start, which the one-start rule rules out
---
::
