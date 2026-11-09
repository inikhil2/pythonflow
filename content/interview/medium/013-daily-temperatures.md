---
title: Daily Temperatures
tier: medium
order: 13
leetcode: 739
url: https://leetcode.com/problems/daily-temperatures/
companies: [Amazon, Google, Meta]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a list `temps` of n daily temperatures, where 1 <= n <= 100000 and each temperature is a whole number from 30 to 100. For each day, count how many days you must wait until a warmer day comes. Return a list of the same length where entry i is that number of days, or 0 if no later day is warmer. A day that is equally warm does not count as warmer.

Checking each later day for every day works, but it is slow on a long list. A stack of days that are still waiting for a warmer day handles the list in a single pass: when a day is warmer than the day on top of the stack, the top day gets its answer.

::exercise
---
id: iv-medium-013
prompt: Write a function daily_temperatures(temps) that returns, for each day, the number of days until a strictly warmer day, or 0 if there is none.
starter: |
  # write your code below
  def daily_temperatures(temps):
      pass
hints:
  - Keep a stack of day numbers that are still waiting for a warmer day.
  - When the current temperature is warmer than the temperature at the top of the stack, pop that day and record the gap between the two day numbers.
tests:
  - check: assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
  - check: assert daily_temperatures([30]) == [0]
  - check: assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]
  - check: assert daily_temperatures([60, 50, 40, 30]) == [0, 0, 0, 0]
  - check: assert daily_temperatures([30, 30, 40]) == [2, 1, 0]
  - check: assert daily_temperatures([89, 62, 70, 58, 47, 47, 46, 76, 100, 70]) == [8, 1, 5, 4, 3, 2, 1, 1, 0, 0]
  - check: assert daily_temperatures([35, 35, 35]) == [0, 0, 0]
big: 'assert (lambda r: sum(r) == 88491550 and sum(i * x for i, x in enumerate(r)) == 4312458706150)(daily_temperatures([50 - (i // 100) % 20 for i in range(100000)]))'
slow:
  - |
    def daily_temperatures(temps):
        n = len(temps)
        result = [0] * n
        for i in range(n):
            for j in range(i + 1, n):
                if temps[j] > temps[i]:
                    result[i] = j - i
                    break
        return result
solution: |
  def daily_temperatures(temps):
      n = len(temps)
      result = [0] * n
      waiting = []
      for day in range(n):
          while waiting and temps[waiting[-1]] < temps[day]:
              earlier = waiting.pop()
              result[earlier] = day - earlier
          waiting.append(day)
      return result
brute: |
  def daily_temperatures(temps):
      result = []
      for i in range(len(temps)):
          answer = 0
          for j in range(i + 1, len(temps)):
              if temps[j] > temps[i]:
                  answer = j - i
                  break
          result.append(answer)
      return result
random:
  call: daily_temperatures
  gen: |
    def gen(rng, size):
        return ([rng.randint(30, 36) for _ in range(rng.randint(1, 10))],)
wrong:
  - |
    def daily_temperatures(temps):
        result = []
        for i in range(len(temps)):
            answer = 0
            for j in range(i + 1, len(temps)):
                if temps[j] > temps[i]:
                    answer = j - i + 1
                    break
            result.append(answer)
        return result
  - |
    def daily_temperatures(temps):
        n = len(temps)
        result = [0] * n
        for i in range(n - 1):
            if temps[i + 1] > temps[i]:
                result[i] = 1
        return result
  - |
    def daily_temperatures(temps):
        n = len(temps)
        result = [0] * n
        waiting = []
        for day in range(n):
            if waiting and temps[waiting[-1]] < temps[day]:
                earlier = waiting.pop()
                result[earlier] = day - earlier
            waiting.append(day)
        return result
---
::
