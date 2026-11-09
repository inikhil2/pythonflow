---
title: Range Module
tier: hard
order: 16
leetcode: 715
url: https://leetcode.com/problems/range-module/
companies: [Google, Amazon]
topic: Design
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries]
---

Write a class RangeModule that keeps track of a set of whole numbers. The set is stored as ranges, and every range runs from a start up to but not including an end.

The method add_range(left, right) starts tracking every whole number from left up to but not including right. The method query_range(left, right) returns True when every whole number in that range is tracked right now, and False otherwise. A range with no tracked numbers at all gives False. The method remove_range(left, right) stops tracking every whole number in that range. Tracked numbers outside the range stay tracked. add_range and remove_range return None.

Each call has 1 ≤ left < right ≤ 10^9. There are at most 10^4 calls in total.

Checking each number in the range one by one is too slow for the largest inputs, because a single range can cover a billion numbers. Keep the tracked numbers as a sorted list of disjoint ranges, and merge ranges that touch when you add. Split a range when you remove part of it.

::exercise
---
id: iv-hard-016
prompt: Write a class RangeModule with add_range(left, right), query_range(left, right), and remove_range(left, right) that tracks a set of whole numbers stored as half-open ranges.
starter: |
  # write your code below
  class RangeModule:
      def __init__(self):
          pass

      def add_range(self, left, right):
          pass

      def query_range(self, left, right):
          pass

      def remove_range(self, left, right):
          pass
hints:
  - Keep two parallel lists, the starts and the ends of the tracked ranges, sorted and with no overlaps. bisect finds the ranges a new call touches.
  - Ranges that only touch, such as [1, 3) and [3, 5), should merge when you add. A query is True only if one tracked range covers the whole query.
tests:
  - check: m = RangeModule(); r = [m.add_range(1, 5), m.query_range(1, 5), m.query_range(1, 6), m.query_range(5, 6)]; assert r == [None, True, False, False]
  - check: m = RangeModule(); m.add_range(1, 10); m.remove_range(3, 5); r = [m.query_range(1, 3), m.query_range(3, 5), m.query_range(5, 10), m.query_range(4, 6)]; assert r == [True, False, True, False]
  - check: m = RangeModule(); m.add_range(1, 3); m.add_range(3, 5); assert m.query_range(1, 5) and m.query_range(2, 4) and not m.query_range(1, 6)
  - check: m = RangeModule(); m.add_range(1, 10); m.remove_range(4, 6); r = [m.query_range(1, 4), m.query_range(4, 6), m.query_range(6, 10), m.query_range(3, 7)]; assert r == [True, False, True, False]
  - check: m = RangeModule(); m.add_range(2, 4); assert m.query_range(2, 5) is False and m.query_range(2, 4) is True
  - check: m = RangeModule(); [m.add_range(1, 3), m.add_range(5, 7), m.add_range(9, 11)]; m.remove_range(2, 10); r = [m.query_range(1, 2), m.query_range(2, 3), m.query_range(10, 11), m.query_range(9, 10)]; assert r == [True, False, True, False]
  - check: m = RangeModule(); m.add_range(1, 5); m.add_range(3, 9); m.add_range(20, 22); r = [m.query_range(1, 9), m.query_range(9, 20), m.query_range(20, 22)]; assert r == [True, False, True]
  - check: m = RangeModule(); m.remove_range(1, 5); m.add_range(10, 12); m.remove_range(1, 11); r = [m.query_range(11, 12), m.query_range(10, 11)]; assert r == [True, False]
  - check: m = RangeModule(); assert m.query_range(1, 2) is False
  - check: m = RangeModule(); m.add_range(1, 5); m.remove_range(1, 3); r = [m.query_range(1, 3), m.query_range(3, 5), m.query_range(1, 2)]; assert r == [False, True, False]
  - check: m = RangeModule(); m.add_range(1, 5); m.remove_range(3, 5); r = [m.query_range(1, 3), m.query_range(3, 5), m.query_range(4, 5)]; assert r == [True, False, False]
  - check: m = RangeModule(); m.add_range(1, 3); m.add_range(5, 7); m.remove_range(3, 5); r = [m.query_range(1, 3), m.query_range(5, 7), m.query_range(3, 5), m.query_range(1, 7)]; assert r == [True, True, False, False]
  - check: m = RangeModule(); m.add_range(1, 5); m.remove_range(1, 5); r = [m.query_range(1, 2), m.query_range(4, 5)]; m.add_range(1, 5); assert r == [False, False] and m.query_range(1, 5)
  - check: m = RangeModule(); m.add_range(1, 5); m.remove_range(1, 3); m.add_range(1, 3); assert m.query_range(1, 5) and m.query_range(3, 5) and not m.query_range(0, 2)
  - check: m = RangeModule(); m.add_range(1, 5); m.remove_range(3, 5); m.add_range(3, 5); assert m.query_range(1, 5) and m.query_range(2, 4) and not m.query_range(4, 6)
solution: |
  import bisect

  class RangeModule:
      def __init__(self):
          self.starts = []
          self.ends = []

      def add_range(self, left, right):
          i = bisect.bisect_left(self.ends, left)
          j = bisect.bisect_right(self.starts, right)
          if i < j:
              left = min(left, self.starts[i])
              right = max(right, self.ends[j - 1])
          self.starts[i:j] = [left]
          self.ends[i:j] = [right]

      def query_range(self, left, right):
          i = bisect.bisect_right(self.starts, left) - 1
          return i >= 0 and self.ends[i] >= right

      def remove_range(self, left, right):
          i = bisect.bisect_right(self.ends, left)
          j = bisect.bisect_left(self.starts, right)
          new_starts, new_ends = [], []
          if i < j:
              if self.starts[i] < left:
                  new_starts.append(self.starts[i])
                  new_ends.append(left)
              if self.ends[j - 1] > right:
                  new_starts.append(right)
                  new_ends.append(self.ends[j - 1])
          self.starts[i:j] = new_starts
          self.ends[i:j] = new_ends
brute: |
  class RangeModule:
      def __init__(self):
          self.points = set()

      def add_range(self, left, right):
          self.points.update(range(left, right))

      def query_range(self, left, right):
          return all(x in self.points for x in range(left, right))

      def remove_range(self, left, right):
          self.points.difference_update(range(left, right))
valid: |
  def valid(ops, args):
      if len(ops) != len(args) or len(ops) > 10000:
          return False
      for op, a in zip(ops, args):
          if op not in ("add_range", "query_range", "remove_range") or len(a) != 2:
              return False
          if not 1 <= a[0] < a[1] <= 10 ** 9:
              return False
      return True
random:
  call: _rm_drive
  driver: |
    def _rm_drive(ops, args):
        m = RangeModule()
        return [getattr(m, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        ops, args = [], []
        for _ in range(rng.randint(1, size * 3 + 3)):
            l = rng.randint(1, 20)
            r = rng.randint(l + 1, 21)
            ops.append(rng.choice(["add_range", "query_range", "remove_range"]))
            args.append([l, r])
        return (ops, args)
big: m = RangeModule(); out = [m.add_range(2500000 * a, 2500000 * b) if i % 3 == 0 else m.remove_range(2500000 * a, 2500000 * b) if i % 3 == 1 else m.query_range(2500000 * a, 2500000 * b) for i in range(10000) for a in [(i * 7919) % 395 + 1] for b in [a + 1 + (i * 31) % 2]]; q = [x for x in out if x is not None]; assert [len(q), sum(q), sum(j * x for j, x in enumerate(q)) % 1000003] == [3333, 3149, 528245]
slow:
  - |
    class RangeModule:
        def __init__(self):
            self.spans = []

        def add_range(self, left, right):
            keep = []
            for s, e in self.spans:
                if e < left or s > right:
                    keep.append((s, e))
                else:
                    left = min(left, s)
                    right = max(right, e)
            keep.append((left, right))
            self.spans = keep

        def query_range(self, left, right):
            found = False
            for s, e in self.spans:
                if s <= left and right <= e:
                    found = True
            return found

        def remove_range(self, left, right):
            out = []
            for s, e in self.spans:
                if e <= left or s >= right:
                    out.append((s, e))
                    continue
                if s < left:
                    out.append((s, left))
                if e > right:
                    out.append((right, e))
            self.spans = out
wrong:
  - |
    import bisect

    class RangeModule:
        def __init__(self):
            self.starts = []
            self.ends = []

        def add_range(self, left, right):
            i = bisect.bisect_left(self.ends, left)
            j = bisect.bisect_right(self.starts, right)
            if i < j:
                left = min(left, self.starts[i])
                right = max(right, self.ends[j - 1])
            self.starts[i:j] = [left]
            self.ends[i:j] = [right]

        def query_range(self, left, right):
            i = bisect.bisect_right(self.starts, left) - 1
            return i >= 0 and self.ends[i] > left

        def remove_range(self, left, right):
            i = bisect.bisect_right(self.ends, left)
            j = bisect.bisect_left(self.starts, right)
            new_starts, new_ends = [], []
            if i < j:
                if self.starts[i] < left:
                    new_starts.append(self.starts[i])
                    new_ends.append(left)
                if self.ends[j - 1] > right:
                    new_starts.append(right)
                    new_ends.append(self.ends[j - 1])
            self.starts[i:j] = new_starts
            self.ends[i:j] = new_ends
  - |
    import bisect

    class RangeModule:
        def __init__(self):
            self.starts = []
            self.ends = []

        def add_range(self, left, right):
            i = bisect.bisect_left(self.ends, left)
            j = bisect.bisect_right(self.starts, right)
            if i < j:
                left = min(left, self.starts[i])
                right = max(right, self.ends[j - 1])
            self.starts[i:j] = [left]
            self.ends[i:j] = [right]

        def query_range(self, left, right):
            i = bisect.bisect_right(self.starts, left) - 1
            return i >= 0 and self.ends[i] >= right

        def remove_range(self, left, right):
            i = bisect.bisect_right(self.ends, left)
            j = bisect.bisect_left(self.starts, right)
            new_starts, new_ends = [], []
            if i < j:
                if self.starts[i] < left:
                    new_starts.append(self.starts[i])
                    new_ends.append(left)
            self.starts[i:j] = new_starts
            self.ends[i:j] = new_ends
  - |
    import bisect

    class RangeModule:
        def __init__(self):
            self.starts = []
            self.ends = []

        def add_range(self, left, right):
            i = bisect.bisect_right(self.ends, left)
            j = bisect.bisect_right(self.starts, right)
            if i < j:
                left = min(left, self.starts[i])
                right = max(right, self.ends[j - 1])
            self.starts[i:j] = [left]
            self.ends[i:j] = [right]

        def query_range(self, left, right):
            i = bisect.bisect_right(self.starts, left) - 1
            return i >= 0 and self.ends[i] >= right

        def remove_range(self, left, right):
            i = bisect.bisect_right(self.ends, left)
            j = bisect.bisect_left(self.starts, right)
            new_starts, new_ends = [], []
            if i < j:
                if self.starts[i] < left:
                    new_starts.append(self.starts[i])
                    new_ends.append(left)
                if self.ends[j - 1] > right:
                    new_starts.append(right)
                    new_ends.append(self.ends[j - 1])
            self.starts[i:j] = new_starts
            self.ends[i:j] = new_ends
equivalent:
  - "27: if self.starts[i] <= left:"  # why: when starts[i] equals left the mutant stores an empty range (left, left); every query answers False on it, as it does with no stored range there, removes leave it out of the result, and a later add touching or covering it merges the empty range away, since touching ranges merge, so it never splits or duplicates a real range
  - "30: if self.ends[j - 1] >= right:"  # why: when ends[j - 1] equals right the mutant stores an empty range (right, right); it answers False to every query, removes leave it out of the result, and a later add touching or covering it merges the empty range away, since touching ranges merge, so it never splits or duplicates a real range
---
::
