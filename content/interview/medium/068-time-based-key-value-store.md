---
title: Time Based Key-Value Store
tier: medium
order: 68
leetcode: 981
url: https://leetcode.com/problems/time-based-key-value-store/
companies: [Apple, Meta, Amazon]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/05-binary-search]
---

Imagine a store that keeps several values for each key, and each value is saved at a timestamp. You get a list of operations to run in order. An operation is either ("set", key, value, timestamp), which saves a value, or ("get", key, timestamp), which asks for a value. Timestamps for all set operations are whole numbers from 1 to 10000000, and they strictly increase from one set to the next. Get timestamps are whole numbers from 0 to 10000000. The list has at most 100000 operations, sets and gets together. A get returns the value saved for that key at the latest timestamp that is at or before the one asked for, or an empty string if no such value exists. Return a list of the answers to the get operations, in order.

Each key keeps its saved values in timestamp order, because they are added in increasing order. A get can then find its answer with a binary search over that key's history.

::exercise
---
id: iv-medium-068
prompt: Write a function time_map(operations) that runs the set and get operations in order and returns the list of answers to the get operations.
starter: |
  # write your code below
  def time_map(operations):
      pass
hints:
  - Keep a list of (timestamp, value) pairs for each key. Appending keeps it sorted.
  - For a get, find the last pair whose timestamp is at or before the asked time. A binary search on the list works.
tests:
  - check: assert time_map([("set", "foo", "bar", 1), ("get", "foo", 1), ("get", "foo", 3)]) == ["bar", "bar"]
  - check: assert time_map([("set", "love", "high", 10), ("set", "love", "low", 20), ("get", "love", 5), ("get", "love", 10), ("get", "love", 15), ("get", "love", 20), ("get", "love", 25)]) == ["", "high", "high", "low", "low"]
  - check: assert time_map([("get", "x", 1)]) == [""]
  - check: assert time_map([("set", "a", "1", 5), ("get", "b", 5), ("get", "a", 4), ("get", "a", 5)]) == ["", "", "1"]
  - check: assert time_map([("set", "k", "x", 2), ("set", "k", "y", 4), ("set", "k", "z", 6), ("get", "k", 5)]) == ["y"]
  - check: assert time_map([("set", "p", "q", 1), ("set", "r", "s", 2), ("get", "p", 2), ("get", "r", 1)]) == ["q", ""]
  - check: assert time_map([("set", "a", "1", 1), ("get", "a", 1000000)]) == ["1"]
  - check: assert time_map([("set", "a", "1", 1), ("set", "a", "2", 2), ("set", "a", "3", 3), ("get", "a", 2), ("get", "a", 0)]) == ["2", ""]
big: assert time_map([("set", "k", str(t), t) for t in range(1, 25001)] + [("get", "k", (t * 7919) % 25000 + 1) for t in range(25000)]) == [str((t * 7919) % 25000 + 1) for t in range(25000)]
solution: |
  def time_map(operations):
      store = {}
      answers = []
      for op in operations:
          if op[0] == "set":
              _, key, value, stamp = op
              store.setdefault(key, []).append((stamp, value))
          else:
              _, key, stamp = op
              entries = store.get(key, [])
              lo, hi = 0, len(entries)
              while lo < hi:
                  mid = (lo + hi) // 2
                  if entries[mid][0] <= stamp:
                      lo = mid + 1
                  else:
                      hi = mid
              answers.append(entries[lo - 1][1] if lo > 0 else "")
      return answers
brute: |
  def time_map(operations):
      history = []
      answers = []
      for op in operations:
          if op[0] == "set":
              history.append((op[1], op[2], op[3]))
          else:
              _, key, stamp = op
              best = None
              for k, value, ts in history:
                  if k == key and ts <= stamp and (best is None or ts > best[0]):
                      best = (ts, value)
              answers.append(best[1] if best is not None else "")
      return answers
random:
  call: time_map
  gen: |
    def gen(rng, size):
        ops = []
        stamp = 0
        for _ in range(max(size, 1)):
            stamp += rng.randint(1, 3)
            key = rng.choice("ab")
            if rng.random() < 0.5:
                ops.append(("set", key, str(stamp), stamp))
            else:
                ops.append(("get", key, rng.randint(0, stamp + 1)))
        return (ops,)
slow:
  - |
    def time_map(operations):
        history = []
        answers = []
        for op in operations:
            if op[0] == "set":
                history.append((op[1], op[2], op[3]))
            else:
                _, key, stamp = op
                best = None
                for k, value, ts in history:
                    if k == key and ts <= stamp and (best is None or ts > best[0]):
                        best = (ts, value)
                answers.append(best[1] if best is not None else "")
        return answers
  - |
    def time_map(operations):
        history = []
        answers = []
        for op in operations:
            if op[0] == "set":
                history.append((op[1], op[2], op[3]))
            else:
                _, key, stamp = op
                found = [(ts, value) for k, value, ts in history if k == key and ts <= stamp]
                answers.append(max(found)[1] if found else "")
        return answers
wrong:
  - |
    def time_map(operations):
        store = {}
        answers = []
        for op in operations:
            if op[0] == "set":
                _, key, value, stamp = op
                store[key] = value
            else:
                _, key, stamp = op
                answers.append(store.get(key, ""))
        return answers
  - |
    def time_map(operations):
        store = {}
        answers = []
        for op in operations:
            if op[0] == "set":
                _, key, value, stamp = op
                if key not in store:
                    store[key] = (stamp, value)
            else:
                _, key, stamp = op
                if key in store and store[key][0] <= stamp:
                    answers.append(store[key][1])
                else:
                    answers.append("")
        return answers
  - |
    def time_map(operations):
        store = {}
        answers = []
        for op in operations:
            if op[0] == "set":
                _, key, value, stamp = op
                store.setdefault(key, []).append((stamp, value))
            else:
                _, key, stamp = op
                entries = store.get(key, [])
                lo, hi = 0, len(entries)
                while lo < hi:
                    mid = (lo + hi) // 2
                    if entries[mid][0] < stamp:
                        lo = mid + 1
                    else:
                        hi = mid
                answers.append(entries[lo - 1][1] if lo > 0 else "")
        return answers
---
::
