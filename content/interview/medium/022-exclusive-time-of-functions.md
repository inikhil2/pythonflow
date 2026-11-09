---
title: Exclusive Time of Functions
tier: medium
order: 22
leetcode: 636
url: https://leetcode.com/problems/exclusive-time-of-functions/
companies: [Meta, Google, Amazon]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/02-stacks-and-queues]
---

There are n functions, numbered 0 to n - 1, where 1 <= n <= 100. A single computer runs them one call at a time, and a function can call another function, which pauses the caller until the callee finishes. You get a list `logs` of 1 to 200 strings in time order. Each log has the form `"id:start:time"` or `"id:end:time"`. A start log means function `id` begins running at `time`. An end log means function `id` finishes at `time`, and it is still running during that whole time unit. Each function starts once and ends once, and the calls are properly nested. Two logs share a timestamp only when they are the start and end of the same function, which then runs for that one time unit; every other timestamp is different. Timestamps are from 0 to 100000.

A function runs for every time unit from its start to its end, counting both ends, except for the time while it has paused for a function it called. So a function that starts at 0 and ends at 0 runs for 1 unit. Return a list of length n, where entry i is the total time function i was running on its own.

::exercise
---
id: iv-medium-022
prompt: Write a function exclusive_time(n, logs) that returns, for each function, the total time it ran without a function it called running.
starter: |
  # write your code below
  def exclusive_time(n, logs):
      pass
hints:
  - Keep a stack of the functions that are running. When a new function starts, the one on top of the stack pauses.
  - When a function ends, add its time from its start to its end, plus 1, then the function under it resumes the next time unit.
tests:
  - check: assert exclusive_time(2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]) == [3, 4]
  - check: assert exclusive_time(1, ["0:start:0", "0:end:0"]) == [1]
  - check: assert exclusive_time(1, ["0:start:0", "0:end:5"]) == [6]
  - check: assert exclusive_time(2, ["0:start:0", "0:end:0", "1:start:1", "1:end:3"]) == [1, 3]
  - check: assert exclusive_time(3, ["0:start:0", "1:start:1", "2:start:2", "2:end:3", "1:end:4", "0:end:5"]) == [2, 2, 2]
  - check: assert exclusive_time(2, ["0:start:0", "1:start:10", "1:end:10", "0:end:20"]) == [20, 1]
big: 'assert exclusive_time(100, ["0:start:0"] + [x for i in range(1, 100) for x in (f"{i}:start:{1000 * i}", f"{i}:end:{1000 * i + 499}")] + ["0:end:99999"]) == [50500] + [500] * 99'
solution: |
  def exclusive_time(n, logs):
      result = [0] * n
      stack = []
      for log in logs:
          fid, kind, t = log.split(":")
          fid, t = int(fid), int(t)
          if kind == "start":
              if stack:
                  result[stack[-1][0]] += t - stack[-1][1]
              stack.append([fid, t])
          else:
              top, start = stack.pop()
              result[top] += t - start + 1
              if stack:
                  stack[-1][1] = t + 1
      return result
brute: |
  def exclusive_time(n, logs):
      parsed = []
      for log in logs:
          fid, kind, t = log.split(":")
          parsed.append((int(fid), kind, int(t)))
      last = max(t for _, _, t in parsed)
      owner = [None] * (last + 1)
      stack = []
      for now in range(last + 1):
          for fid, kind, t in parsed:
              if t == now and kind == "start":
                  stack.append(fid)
          if stack:
              owner[now] = stack[-1]
          for fid, kind, t in parsed:
              if t == now and kind == "end":
                  stack.pop()
      result = [0] * n
      for who in owner:
          if who is not None:
              result[who] += 1
      return result
random:
  call: exclusive_time
  gen: |
    def gen(rng, size):
        n = rng.randint(1, 4)
        logs, stack, nxt, t = [], [], 0, 0
        while nxt < n or stack:
            if nxt < n and (not stack or rng.random() < 0.5):
                logs.append(f"{nxt}:start:{t}")
                if rng.random() < 0.3:
                    logs.append(f"{nxt}:end:{t}")
                    nxt += 1
                    t += 1
                    continue
                stack.append(nxt)
                nxt += 1
            else:
                logs.append(f"{stack.pop()}:end:{t}")
            t += rng.randint(1, 2)
        return (n, logs)
wrong:
  - |
    def exclusive_time(n, logs):
        result = [0] * n
        starts = {}
        for log in logs:
            fid, kind, t = log.split(":")
            fid, t = int(fid), int(t)
            if kind == "start":
                starts[fid] = t
            else:
                result[fid] += t - starts[fid] + 1
        return result
  - |
    def exclusive_time(n, logs):
        result = [0] * n
        stack = []
        for log in logs:
            fid, kind, t = log.split(":")
            fid, t = int(fid), int(t)
            if kind == "start":
                if stack:
                    result[stack[-1][0]] += t - stack[-1][1]
                stack.append([fid, t])
            else:
                top, start = stack.pop()
                result[top] += t - start + 1
                if stack:
                    stack[-1][1] = t
        return result
  - |
    def exclusive_time(n, logs):
        result = [0] * n
        stack = []
        for log in logs:
            fid, kind, t = log.split(":")
            fid, t = int(fid), int(t)
            if kind == "start":
                if stack:
                    result[stack[-1][0]] += t - stack[-1][1]
                stack.append([fid, t])
            else:
                top, start = stack.pop()
                result[top] += t - start
                if stack:
                    stack[-1][1] = t + 1
        return result
slow:
  - |
    def exclusive_time(n, logs):
        parsed = []
        for log in logs:
            fid, kind, t = log.split(":")
            parsed.append((int(fid), kind, int(t)))
        last = max(t for _, _, t in parsed)
        owner = [None] * (last + 1)
        stack = []
        for now in range(last + 1):
            for fid, kind, t in parsed:
                if t == now and kind == "start":
                    stack.append(fid)
            if stack:
                owner[now] = stack[-1]
            for fid, kind, t in parsed:
                if t == now and kind == "end":
                    stack.pop()
        result = [0] * n
        for who in owner:
            if who is not None:
                result[who] += 1
        return result
---
::
