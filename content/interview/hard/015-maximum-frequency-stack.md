---
title: Maximum Frequency Stack
tier: hard
order: 15
leetcode: 895
url: https://leetcode.com/problems/maximum-frequency-stack/
companies: [Amazon, Google, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

Write a class FreqStack that holds whole numbers. Its method push(val) adds val to the stack. Its method pop() removes one value from the stack and returns it. The value it removes is one that appears the most times in the stack right now. If several values tie for the most times, pop removes the one whose latest copy was pushed last. Each pop removes exactly one copy, so the counts go down by one.

Each value is a whole number from 0 to 100000. There are at most 20000 calls to push and pop together. pop is only called when the stack holds at least one value.

Scanning the whole stack for every pop is too slow for the largest inputs. Keep the values in groups by how many times they have been pushed so far, so the most frequent group is always at hand.

::exercise
---
id: iv-hard-015
prompt: Write a class FreqStack with push(val), which adds a value, and pop(), which removes and returns the most frequent value, breaking ties by the most recent push.
starter: |
  # write your code below
  class FreqStack:
      def __init__(self):
          pass

      def push(self, val):
          pass

      def pop(self):
          pass
hints:
  - Keep a count for each value, and for each count keep a stack of the values that reached that count, in push order.
  - The most frequent values are all in the highest non-empty group. Its last element is the most recently pushed of them. After you pop it, lower the value's count and drop the group if it is now empty.
tests:
  - check: m = FreqStack(); [m.push(v) for v in [5, 7, 5, 7, 4, 5]]; assert [m.pop() for _ in range(5)] == [5, 7, 5, 4, 7]
  - check: m = FreqStack(); m.push(9); assert m.pop() == 9
  - check: m = FreqStack(); [m.push(v) for v in [1, 2, 3]]; assert [m.pop() for _ in range(3)] == [3, 2, 1]
  - check: m = FreqStack(); [m.push(v) for v in [1, 1, 2, 2, 1]]; assert [m.pop() for _ in range(5)] == [1, 2, 1, 2, 1]
  - check: m = FreqStack(); m.push(4); m.push(4); a = m.pop(); m.push(5); m.push(5); m.push(4); r = [a, m.pop(), m.pop(), m.pop(), m.pop()]; assert r == [4, 4, 5, 5, 4]
  - check: m = FreqStack(); [m.push(v) for v in [100000, 0, 100000]]; assert [m.pop() for _ in range(3)] == [100000, 0, 100000]
  - check: m = FreqStack(); [m.push(v) for v in [7, 8, 7]]; assert [m.pop() for _ in range(3)] == [7, 8, 7]
  - check: m = FreqStack(); [m.push(v) for v in [2, 9, 9, 2, 2]]; assert [m.pop() for _ in range(5)] == [2, 2, 9, 9, 2]
  - check: m = FreqStack(); m.push(3); assert m.pop() == 3; m.push(3); m.push(2); assert [m.pop(), m.pop()] == [2, 3]
solution: |
  class FreqStack:
      def __init__(self):
          self.freq = {}
          self.groups = {}
          self.top = 0

      def push(self, val):
          f = self.freq.get(val, 0) + 1
          self.freq[val] = f
          if f > self.top:
              self.top = f
          self.groups.setdefault(f, []).append(val)

      def pop(self):
          val = self.groups[self.top].pop()
          self.freq[val] -= 1
          if not self.groups[self.top]:
              self.top -= 1
          return val
brute: |
  class FreqStack:
      def __init__(self):
          self.items = []

      def push(self, val):
          self.items.append(val)

      def pop(self):
          best = None
          for i, v in enumerate(self.items):
              key = (self.items.count(v), i)
              if best is None or key > best:
                  best = key
          return self.items.pop(best[1])
valid: |
  def valid(ops, args):
      if len(ops) != len(args) or len(ops) > 20000:
          return False
      depth = 0
      for op, a in zip(ops, args):
          if op == "push":
              if len(a) != 1 or not 0 <= a[0] <= 100000:
                  return False
              depth += 1
          elif op != "pop" or a or depth == 0:
              return False
          else:
              depth -= 1
      return True
random:
  call: _fs_drive
  driver: |
    def _fs_drive(ops, args):
        m = FreqStack()
        return [getattr(m, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        ops, args = [], []
        depth = 0
        for _ in range(rng.randint(1, size * 2 + 3)):
            if depth == 0 or rng.random() < 0.6:
                ops.append("push")
                args.append([rng.randint(0, 4)])
                depth += 1
            else:
                ops.append("pop")
                args.append([])
                depth -= 1
        return (ops, args)
big: m = FreqStack(); r = [m.pop() if i % 5 == 4 else (m.push((i * 7919 + i // 3) % 97), None)[1] for i in range(20000)]; r = [x for x in r if x is not None]; assert [len(r), sum(r), r[0], r[999], r[-1]] == [4000, 192055, 90, 82, 2]
slow:
  - |
    class FreqStack:
        def __init__(self):
            self.items = []

        def push(self, val):
            self.items.append(val)

        def pop(self):
            best = None
            for i, v in enumerate(self.items):
                key = (self.items.count(v), i)
                if best is None or key > best:
                    best = key
            return self.items.pop(best[1])
wrong:
  - |
    class FreqStack:
        def __init__(self):
            self.freq = {}
            self.groups = {}
            self.top = 0

        def push(self, val):
            f = self.freq.get(val, 0) + 1
            self.freq[val] = f
            if f > self.top:
                self.top = f
            self.groups.setdefault(f, []).append(val)

        def pop(self):
            val = self.groups[self.top].pop(0)
            self.freq[val] -= 1
            if not self.groups[self.top]:
                self.top -= 1
            return val
  - |
    class FreqStack:
        def __init__(self):
            self.freq = {}
            self.groups = {}
            self.top = 0

        def push(self, val):
            f = self.freq.get(val, 0) + 1
            self.freq[val] = f
            if f > self.top:
                self.top = f
            self.groups.setdefault(f, []).append(val)

        def pop(self):
            val = self.groups[self.top].pop()
            if not self.groups[self.top]:
                self.top -= 1
            return val
  - |
    class FreqStack:
        def __init__(self):
            self.freq = {}
            self.groups = {}
            self.top = 0

        def push(self, val):
            f = self.freq.get(val, 0) + 1
            self.freq[val] = f
            if f > self.top:
                self.top = f
            self.groups.setdefault(f, []).append(val)

        def pop(self):
            val = max(self.groups[self.top])
            self.groups[self.top].remove(val)
            self.freq[val] -= 1
            if not self.groups[self.top]:
                self.top -= 1
            return val
equivalent:
  - "6: self.top = 1"  # why: top is read only in pop, which runs only on a non-empty stack, and with f > top the first push at f = 1 leaves top at 1, which is correct
  - "6: self.top = -1"  # why: top is read only in pop, which runs only on a non-empty stack, and the first push then raises top to 1 through f > top, which is correct
  - "9: f = self.freq.get(val, 1) + 1"  # why: every stored count, and every group index, is shifted by the same +1, including counts that have dropped back to zero; a group is empty only when the stack is empty, so pop never reads a wrong level
  - "9: f = self.freq.get(val, -1) + 1"  # why: every stored count, and every group index, is shifted by the same -1, including counts that have dropped back to zero; a group is empty only when the stack is empty, so pop never reads a wrong level
  - "11: if f >= self.top:"  # why: setting top to f when f equals top changes nothing
---
::
