---
title: Min Stack
tier: medium
order: 29
leetcode: 155
url: https://leetcode.com/problems/min-stack/
companies: [Amazon, Google, Bloomberg]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/02-stacks-and-queues]
---

Write a class `MinStack`: a stack of whole numbers that can also say which value in it is the smallest. It has four methods:

- `push(x)` puts `x` on top of the stack.
- `pop()` removes the top value.
- `top()` returns the top value and leaves it in place.
- `get_min()` returns the smallest value now in the stack.

`pop`, `top` and `get_min` are only called when the stack is not empty. Values are whole numbers from -10000 to 10000, and there are at most 30000 calls in all. Every method has to take only a few steps however many values are stored, because the biggest tests call `get_min` thousands of times on a stack holding thousands of values.

::exercise
---
id: iv-medium-029
prompt: Write a class MinStack with push(x), pop(), top() and get_min() that all work quickly, even on a stack of thousands of values.
starter: |
  # write your code below
  class MinStack:
      pass
hints:
  - get_min must not look at every value. Remember the answer instead of recomputing it.
  - Keep a second list. When a value is pushed, add the smallest value so far to it. When a value is popped, drop the matching entry.
tests:
  - check: s = MinStack(); s.push(3); s.push(1); assert s.get_min() == 1; s.pop(); assert s.get_min() == 3
  - check: s = MinStack(); s.push(-2); s.push(0); s.push(-3); assert s.get_min() == -3; s.pop(); assert s.top() == 0; assert s.get_min() == -2
  - check: s = MinStack(); s.push(1); assert s.top() == 1
  - check: s = MinStack(); s.push(5); s.push(5); s.pop(); assert s.get_min() == 5
  - check: s = MinStack(); s.push(3); s.push(1); s.push(2); assert s.get_min() == 1; assert s.top() == 2
  - check: s = MinStack(); s.push(7); assert s.top() == 7 and s.get_min() == 7
  - check: s = MinStack(); s.push(2); s.push(4); s.push(6); s.pop(); s.pop(); assert s.get_min() == 2 and s.top() == 2
big: 's = MinStack(); [s.push((i * 7919) % 2001 - 1000 + 8000 - i // 4) for i in range(12000)]; a = sum([(s.pop(), s.get_min())[1] for _ in range(4000)]); b = sum([s.get_min() for _ in range(6000)]); c = sum([(s.pop(), s.top())[1] for _ in range(2000)]); assert (a, b, c) == (18108722, 30264000, 12502075)'
solution: |
  class MinStack:
      def __init__(self):
          self.values = []
          self.mins = []

      def push(self, x):
          self.values.append(x)
          self.mins.append(x if not self.mins else min(x, self.mins[-1]))

      def pop(self):
          self.values.pop()
          self.mins.pop()

      def top(self):
          return self.values[-1]

      def get_min(self):
          return self.mins[-1]
brute: |
  class MinStack:
      def __init__(self):
          self.values = []

      def push(self, x):
          self.values.append(x)

      def pop(self):
          self.values.pop()

      def top(self):
          return self.values[-1]

      def get_min(self):
          return sorted(self.values)[0]
valid: |
  def valid(ops, args):
      depth = 0
      for op, a in zip(ops, args):
          if op == "push":
              if len(a) != 1 or not -10000 <= a[0] <= 10000:
                  return False
              depth += 1
          elif op in ("pop", "top", "get_min") and a == [] and depth > 0:
              depth -= op == "pop"
          else:
              return False
      return len(ops) == len(args) and len(ops) <= 30000
random:
  call: _pf_drive
  driver: |
    def _pf_drive(ops, args):
        s = MinStack()
        return [getattr(s, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        ops, args, depth = [], [], 0
        for _ in range(rng.randint(1, size + 6)):
            roll = rng.random()
            if depth == 0 or roll < 0.4:
                ops.append("push"); args.append([rng.randint(-5, 5)]); depth += 1
            elif roll < 0.6:
                ops.append("pop"); args.append([]); depth -= 1
            elif roll < 0.8:
                ops.append("top"); args.append([])
            else:
                ops.append("get_min"); args.append([])
        return (ops, args)
wrong:
  - |
    class MinStack:
        def __init__(self):
            self.values = []
            self.best = None

        def push(self, x):
            self.values.append(x)
            self.best = x if self.best is None else min(self.best, x)

        def pop(self):
            self.values.pop()

        def top(self):
            return self.values[-1]

        def get_min(self):
            return self.best
  - |
    class MinStack:
        def __init__(self):
            self.values = []
            self.mins = []

        def push(self, x):
            self.values.append(x)
            self.mins.append(x if not self.mins else min(x, self.mins[-1]))

        def pop(self):
            self.values.pop()
            self.mins.pop()

        def top(self):
            return self.mins[-1]

        def get_min(self):
            return self.mins[-1]
  - |
    class MinStack:
        def __init__(self):
            self.values = []
            self.mins = []

        def push(self, x):
            self.values.append(x)
            if not self.mins or x < self.mins[0]:
                self.mins.append(x)

        def pop(self):
            self.values.pop()

        def top(self):
            return self.values[-1]

        def get_min(self):
            return self.mins[0]
  - |
    class MinStack:
        def __init__(self):
            self.values = []
            self.mins = []

        def push(self, x):
            self.values.append(x)
            if not self.mins or x < self.mins[-1]:
                self.mins.append(x)

        def pop(self):
            if self.values.pop() == self.mins[-1]:
                self.mins.pop()

        def top(self):
            return self.values[-1]

        def get_min(self):
            return self.mins[-1]
# why: a get_min that calls min(self.values) is accepted: the scan runs in C, so on this size it takes seconds, not minutes. The hint tells the learner to remember the answer instead.
slow:
  - |
    class MinStack:
        def __init__(self):
            self.values = []

        def push(self, x):
            self.values.append(x)

        def pop(self):
            self.values.pop()

        def top(self):
            return self.values[-1]

        def get_min(self):
            smallest = self.values[0]
            for v in self.values:
                if v < smallest:
                    smallest = v
            return smallest
---
::
