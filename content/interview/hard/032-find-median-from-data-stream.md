---
title: Find Median from Data Stream
tier: hard
order: 32
leetcode: 295
url: https://leetcode.com/problems/find-median-from-data-stream/
companies: [Amazon, Google, Apple]
topic: Two pointers
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries, /learn/week10-algorithms/01-two-pointers, /learn/week10-algorithms/04-sorting-and-heaps]
---

Write a class MedianFinder that receives whole numbers one at a time. Its method add_num(num) takes in one more number. Its method find_median() returns the median of all the numbers received so far: the middle number when the numbers are sorted if there is an odd count of them, and the average of the two middle numbers if the count is even. The method may return an int or a float.

Each number is between -100000 and 100000. There are at most 100000 calls to add_num and at most 100000 calls to find_median, and find_median is only called after at least one add_num. Re-sorting everything for every question is too slow for the largest streams.

::exercise
---
id: iv-hard-032
prompt: Write a class MedianFinder with add_num(num), which takes in a number, and find_median(), which returns the median of all numbers added so far.
starter: |
  # write your code below
  class MedianFinder:
      def __init__(self):
          pass

      def add_num(self, num):
          pass

      def find_median(self):
          pass
hints:
  - Keep the smaller half of the numbers in one heap and the larger half in another. The median is at the top of one or both.
  - After every add, make the two halves differ in size by at most one. Python's heapq only has a min-heap, so store negatives for the smaller half.
tests:
  - check: m = MedianFinder(); m.add_num(1); m.add_num(2); assert m.find_median() == 1.5; m.add_num(3); assert m.find_median() == 2
  - check: m = MedianFinder(); m.add_num(5); assert m.find_median() == 5
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [5, 4, 3, 2, 1]]; assert r == [5, 4.5, 4, 3.5, 3]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [1, 2, 3, 4, 5]]; assert r == [1, 1.5, 2, 2.5, 3]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [-1, -2, -3]]; assert r == [-1, -1.5, -2]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [2, 2, 2, 2]]; assert r == [2, 2, 2, 2]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [3, 1, 4, 1, 5, 9, 2, 6]]; assert r == [3, 2, 3, 2, 3, 3.5, 3, 3.5]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [100000, -100000, 0]]; assert r == [100000, 0, 0]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [10, 1, 10, 1]]; assert r == [10, 5.5, 10, 5.5]
  - check: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] for v in [7, -7, 7, -7, 7]]; assert r == [7, 0, 7, 0, 7]
solution: |
  import heapq

  class MedianFinder:
      def __init__(self):
          self.low = []
          self.high = []

      def add_num(self, num):
          heapq.heappush(self.low, -num)
          heapq.heappush(self.high, -heapq.heappop(self.low))
          if len(self.high) > len(self.low):
              heapq.heappush(self.low, -heapq.heappop(self.high))

      def find_median(self):
          if len(self.low) > len(self.high):
              return -self.low[0]
          return (-self.low[0] + self.high[0]) / 2
brute: |
  class MedianFinder:
      def __init__(self):
          self.values = []

      def add_num(self, num):
          self.values.append(num)

      def find_median(self):
          s = sorted(self.values)
          n = len(s)
          if n % 2 == 1:
              return s[n // 2]
          return (s[n // 2 - 1] + s[n // 2]) / 2
valid: |
  def valid(ops, args):
      if len(ops) != len(args) or ops.count("add_num") > 100000 or ops.count("find_median") > 100000:
          return False
      seen = 0
      for op, a in zip(ops, args):
          if op == "add_num":
              if len(a) != 1 or not -100000 <= a[0] <= 100000:
                  return False
              seen += 1
          elif op != "find_median" or a or seen == 0:
              return False
      return True
random:
  call: _pf_drive
  driver: |
    def _pf_drive(ops, args):
        m = MedianFinder()
        return [getattr(m, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        ops, args = ["add_num"], [[rng.randint(-8, 8)]]
        for _ in range(rng.randint(0, size * 2 + 2)):
            if rng.random() < 0.6:
                ops.append("add_num")
                args.append([rng.randint(-8, 8)])
            else:
                ops.append("find_median")
                args.append([])
        return (ops, args)
big: m = MedianFinder(); r = [(m.add_num(v), m.find_median())[1] if i % 8 == 7 else m.add_num(v) for i, v in enumerate([(i * 7919 + (i * i) % 1013) % 200001 - 100000 for i in range(100000)])]; r = [x for x in r if x is not None]; assert len(r) == 12500 and sum(r) == -277746.5 and r[0] == -72271 and r[1000] == -23.5 and r[-1] == 9.5
# why: a bisect.insort version is accepted, because it does its O(n) shifting in C and stays under the limit at LeetCode size; the reference teaches two heaps
slow:
  - |
    class MedianFinder:
        def __init__(self):
            self.values = []

        def add_num(self, num):
            self.values.append(num)

        def find_median(self):
            s = sorted(self.values)
            n = len(s)
            if n % 2 == 1:
                return s[n // 2]
            return (s[n // 2 - 1] + s[n // 2]) / 2
  - |
    class MedianFinder:
        def __init__(self):
            self.values = []

        def add_num(self, num):
            i = 0
            while i < len(self.values) and self.values[i] < num:
                i += 1
            self.values.insert(i, num)

        def find_median(self):
            n = len(self.values)
            if n % 2 == 1:
                return self.values[n // 2]
            return (self.values[n // 2 - 1] + self.values[n // 2]) / 2
wrong:
  - |
    import heapq

    class MedianFinder:
        def __init__(self):
            self.low = []
            self.high = []

        def add_num(self, num):
            heapq.heappush(self.low, -num)
            heapq.heappush(self.high, -heapq.heappop(self.low))
            if len(self.high) > len(self.low):
                heapq.heappush(self.low, -heapq.heappop(self.high))

        def find_median(self):
            if len(self.low) > len(self.high):
                return -self.low[0]
            return (-self.low[0] + self.high[0]) // 2
  - |
    import heapq

    class MedianFinder:
        def __init__(self):
            self.low = []
            self.high = []

        def add_num(self, num):
            if not self.low or num <= -self.low[0]:
                heapq.heappush(self.low, -num)
            else:
                heapq.heappush(self.high, num)

        def find_median(self):
            if len(self.low) > len(self.high):
                return -self.low[0]
            if len(self.high) > len(self.low):
                return self.high[0]
            return (-self.low[0] + self.high[0]) / 2
  - |
    import heapq

    class MedianFinder:
        def __init__(self):
            self.low = []
            self.high = []

        def add_num(self, num):
            heapq.heappush(self.low, num)
            heapq.heappush(self.high, -heapq.heappop(self.low))
            if len(self.high) > len(self.low):
                heapq.heappush(self.low, -heapq.heappop(self.high))

        def find_median(self):
            if len(self.low) > len(self.high):
                return self.low[0]
            return (self.low[0] + self.high[0]) / 2
  - |
    class MedianFinder:
        def __init__(self):
            self.values = []

        def add_num(self, num):
            self.values.append(num)

        def find_median(self):
            n = len(self.values)
            if n % 2 == 1:
                return self.values[n // 2]
            return (self.values[n // 2 - 1] + self.values[n // 2]) / 2
---
::
