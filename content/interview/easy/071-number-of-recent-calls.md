---
title: Number of Recent Calls
tier: easy
order: 71
leetcode: 933
url: https://leetcode.com/problems/number-of-recent-calls/
companies: [Google, Meta, Amazon]
topic: Design
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

You get a list `times` of request times in milliseconds, with between 1 and 10000 entries. The times are whole numbers from 1 to 1000000, and they are strictly increasing, so each request arrives after the one before it.

For each request, count how many requests arrived in the 3000 milliseconds up to and including its own time. A request at time `t` counts the requests whose times are from `t - 3000` to `t`, and both ends are included, and its own request is included too. Return one count for each request, in the same order.

::exercise
---
id: iv-easy-071
prompt: Write a function recent_counts(times) that returns, for each request time, how many request times fall in the window from 3000 milliseconds earlier up to that time.
starter: |
  # write your code below
  def recent_counts(times):
      pass
hints:
  - Keep a position in the list that marks the oldest request still inside the window, and move it forward when a request falls out.
  - The count for a request is its position minus the oldest position, plus one.
tests:
  - check: assert recent_counts([1, 100, 3001, 3002]) == [1, 2, 3, 3]
  - check: assert recent_counts([1]) == [1]
  - check: assert recent_counts([1, 3001]) == [1, 2]
  - check: assert recent_counts([1, 3002]) == [1, 1]
  - check: assert recent_counts([10, 20, 30]) == [1, 2, 3]
  - check: assert recent_counts([1, 2, 5000, 5001]) == [1, 2, 1, 2]
  - check: assert recent_counts([100, 200, 3100, 3200, 6300]) == [1, 2, 3, 3, 1]
big: assert recent_counts(list(range(1, 10001)))[-1] == 3001
solution: |
  def recent_counts(times):
      answer = []
      start = 0
      for i in range(len(times)):
          while times[start] < times[i] - 3000:
              start += 1
          answer.append(i - start + 1)
      return answer
brute: |
  def recent_counts(times):
      answer = []
      for i in range(len(times)):
          count = 0
          for j in range(i + 1):
              if times[j] >= times[i] - 3000:
                  count += 1
          answer.append(count)
      return answer
random:
  call: recent_counts
  gen: |
    def gen(rng, size):
        times = sorted(rng.sample(range(1, 6001), max(size, 1)))
        return (times,)
slow:
  - |
    def recent_counts(times):
        answer = []
        for i in range(len(times)):
            count = 0
            for j in range(i + 1):
                if times[j] >= times[i] - 3000:
                    count += 1
            answer.append(count)
        return answer
wrong:
  - |
    def recent_counts(times):
        answer = []
        for i in range(len(times)):
            answer.append(min(i + 1, 3000))
        return answer
  - |
    def recent_counts(times):
        answer = []
        start = 0
        for i in range(len(times)):
            while times[start] <= times[i] - 3000:
                start += 1
            answer.append(i - start + 1)
        return answer
  - |
    def recent_counts(times):
        answer = []
        start = 0
        for i in range(len(times)):
            while times[start] < times[i] - 3000:
                start += 1
            answer.append(i - start)
        return answer
---
::
