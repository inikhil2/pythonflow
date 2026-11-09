---
title: LFU Cache
tier: hard
order: 17
leetcode: 460
url: https://leetcode.com/problems/lfu-cache/
companies: [Amazon, Microsoft, Google]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes]
---

Write a class LFUCache that holds a fixed number of key-value pairs. LFUCache(capacity) makes an empty cache that can hold at most capacity keys.

The method get(key) returns the value stored for key, or -1 if key is not stored. The method put(key, value) stores value for key. If key is already stored, put replaces its value.

Every get that finds a key, and every put on a key, counts as a use of that key. A key's use count starts at 1 when it is first stored and goes up by 1 for each later use.

When put adds a new key to a full cache, first remove one stored key. Remove the key with the fewest uses. If several keys tie for the fewest, remove the one whose last use is oldest. Then store the new key.

Each capacity is a whole number from 1 to 10^4. Keys and values are whole numbers from 0 to 10^5. There are at most 2·10^5 calls to get and put together.

Scanning every stored key on each eviction is too slow for the largest inputs. Keep keys grouped by their use count, and within each group keep them ordered by last use, so the next key to remove is always easy to reach.

::exercise
---
id: iv-hard-017
prompt: Write a class LFUCache with get(key) and put(key, value) for a fixed-capacity cache that evicts the least frequently used key, breaking ties by least recent use.
starter: |
  # write your code below
  class LFUCache:
      def __init__(self, capacity):
          pass

      def get(self, key):
          pass

      def put(self, key, value):
          pass
hints:
  - Keep the stored values in one dictionary and each key's use count in another. For each use count, keep an ordered group of the keys that have that count, oldest use first.
  - Remember the smallest use count that has keys. Evict the first key in that group. When a key is used, move it to the group one count higher, and update the smallest count if its old group became empty.
tests:
  - check: c = LFUCache(2); c.put(1, 1); c.put(2, 2); r = [c.get(1)]; c.put(3, 3); r += [c.get(2), c.get(3)]; assert r == [1, -1, 3]
  - check: c = LFUCache(2); [c.put(1, 1), c.put(2, 2), c.put(3, 3)]; r = [c.get(1), c.get(2), c.get(3)]; assert r == [-1, 2, 3]
  - check: c = LFUCache(2); c.put(1, 1); c.put(2, 2); c.get(1); c.get(2); c.put(3, 3); r = [c.get(1), c.get(2), c.get(3)]; assert r == [-1, 2, 3]
  - check: c = LFUCache(2); c.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3); r = [c.get(1), c.get(2), c.get(3)]; assert r == [10, -1, 3]
  - check: c = LFUCache(1); c.put(2, 1); r = [c.get(2)]; c.put(3, 2); r += [c.get(2), c.get(3)]; assert r == [1, -1, 2]
  - check: c = LFUCache(3); [c.put(1, 1), c.put(2, 2), c.put(3, 3)]; c.get(1); c.get(1); c.get(2); c.put(4, 4); r = [c.get(3), c.get(4), c.get(1)]; assert r == [-1, 4, 1]
  - check: c = LFUCache(2); c.put(1, 1); c.put(2, 2); c.put(1, 5); r = [c.get(1), c.get(2)]; assert r == [5, 2]
  - check: c = LFUCache(2); c.put(1, 1); c.put(2, 2); c.get(2); c.get(2); c.put(3, 3); r = [c.get(1), c.get(2), c.get(3)]; assert r == [-1, 2, 3]
  - check: c = LFUCache(2); assert c.get(9) == -1
solution: |
  from collections import OrderedDict, defaultdict

  class LFUCache:
      def __init__(self, capacity):
          self.capacity = capacity
          self.vals = {}
          self.freq = {}
          self.groups = defaultdict(OrderedDict)
          self.min_freq = 0

      def _touch(self, key):
          f = self.freq[key]
          del self.groups[f][key]
          if not self.groups[f]:
              del self.groups[f]
              if self.min_freq == f:
                  self.min_freq = f + 1
          self.freq[key] = f + 1
          self.groups[f + 1][key] = None

      def get(self, key):
          if key not in self.vals:
              return -1
          self._touch(key)
          return self.vals[key]

      def put(self, key, value):
          if key in self.vals:
              self.vals[key] = value
              self._touch(key)
              return
          if len(self.vals) == self.capacity:
              old, _ = self.groups[self.min_freq].popitem(last=False)
              if not self.groups[self.min_freq]:
                  del self.groups[self.min_freq]
              del self.vals[old]
              del self.freq[old]
          self.vals[key] = value
          self.freq[key] = 1
          self.groups[1][key] = None
          self.min_freq = 1
brute: |
  class LFUCache:
      def __init__(self, capacity):
          self.capacity = capacity
          self.clock = 0
          self.items = {}

      def _use(self, key):
          self.clock += 1
          self.items[key][1] += 1
          self.items[key][2] = self.clock

      def get(self, key):
          if key not in self.items:
              return -1
          self._use(key)
          return self.items[key][0]

      def put(self, key, value):
          if key in self.items:
              self.items[key][0] = value
              self._use(key)
              return
          if len(self.items) == self.capacity:
              victim = None
              for k in self.items:
                  if victim is None or (self.items[k][1], self.items[k][2]) < (self.items[victim][1], self.items[victim][2]):
                      victim = k
              del self.items[victim]
          self.clock += 1
          self.items[key] = [value, 1, self.clock]
valid: |
  def valid(ops, args):
      if len(ops) != len(args) or not 1 <= len(ops) <= 200000 or ops[0] != "init":
          return False
      for i, (op, a) in enumerate(zip(ops, args)):
          if op == "init":
              if i != 0 or len(a) != 1 or not 1 <= a[0] <= 10000:
                  return False
          elif op == "get":
              if len(a) != 1 or not 0 <= a[0] <= 100000:
                  return False
          elif op == "put":
              if len(a) != 2 or not (0 <= a[0] <= 100000 and 0 <= a[1] <= 100000):
                  return False
          else:
              return False
      return True
random:
  call: _lfu_drive
  driver: |
    def _lfu_drive(ops, args):
        out = []
        m = None
        for op, a in zip(ops, args):
            if op == "init":
                m = LFUCache(*a)
                out.append(None)
            else:
                out.append(getattr(m, op)(*a))
        return out
  gen: |
    def gen(rng, size):
        ops, args = ["init"], [[rng.randint(1, 3)]]
        for _ in range(rng.randint(1, size * 3 + 3)):
            k = rng.randint(0, 4)
            if rng.random() < 0.5:
                ops.append("get")
                args.append([k])
            else:
                ops.append("put")
                args.append([k, rng.randint(0, 9)])
        return (ops, args)
big: c = LFUCache(10000); out = [c.put((i * 7919) % 14999, i) if i % 3 == 0 else c.get((i * 7919) % 14999) for i in range(200000)]; g = [x for i, x in enumerate(out) if i % 3 != 0]; assert [len(g), sum(g), sum(j * x for j, x in enumerate(g)) % 1000003] == [133333, 6921399143, 464385]
slow:
  - |
    class LFUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.clock = 0
            self.items = {}

        def _use(self, key):
            self.clock += 1
            self.items[key][1] += 1
            self.items[key][2] = self.clock

        def get(self, key):
            if key not in self.items:
                return -1
            self._use(key)
            return self.items[key][0]

        def put(self, key, value):
            if key in self.items:
                self.items[key][0] = value
                self._use(key)
                return
            if len(self.items) == self.capacity:
                victim = None
                for k in self.items:
                    if victim is None or (self.items[k][1], self.items[k][2]) < (self.items[victim][1], self.items[victim][2]):
                        victim = k
                del self.items[victim]
            self.clock += 1
            self.items[key] = [value, 1, self.clock]
wrong:
  - |
    from collections import OrderedDict, defaultdict

    class LFUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.vals = {}
            self.freq = {}
            self.groups = defaultdict(OrderedDict)
            self.min_freq = 0

        def _touch(self, key):
            f = self.freq[key]
            del self.groups[f][key]
            if not self.groups[f]:
                del self.groups[f]
                if self.min_freq == f:
                    self.min_freq = f + 1
            self.freq[key] = f + 1
            self.groups[f + 1][key] = None

        def get(self, key):
            if key not in self.vals:
                return -1
            self._touch(key)
            return self.vals[key]

        def put(self, key, value):
            if key in self.vals:
                self.vals[key] = value
                self._touch(key)
                return
            if len(self.vals) == self.capacity:
                old, _ = self.groups[self.min_freq].popitem(last=True)
                if not self.groups[self.min_freq]:
                    del self.groups[self.min_freq]
                del self.vals[old]
                del self.freq[old]
            self.vals[key] = value
            self.freq[key] = 1
            self.groups[1][key] = None
            self.min_freq = 1
  - |
    from collections import OrderedDict, defaultdict

    class LFUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.vals = {}
            self.freq = {}
            self.groups = defaultdict(OrderedDict)
            self.min_freq = 0

        def _touch(self, key):
            f = self.freq[key]
            del self.groups[f][key]
            if not self.groups[f]:
                del self.groups[f]
                if self.min_freq == f:
                    self.min_freq = f + 1
            self.freq[key] = f + 1
            self.groups[f + 1][key] = None

        def get(self, key):
            if key not in self.vals:
                return -1
            return self.vals[key]

        def put(self, key, value):
            if key in self.vals:
                self.vals[key] = value
                self._touch(key)
                return
            if len(self.vals) == self.capacity:
                old, _ = self.groups[self.min_freq].popitem(last=False)
                if not self.groups[self.min_freq]:
                    del self.groups[self.min_freq]
                del self.vals[old]
                del self.freq[old]
            self.vals[key] = value
            self.freq[key] = 1
            self.groups[1][key] = None
            self.min_freq = 1
  - |
    from collections import OrderedDict, defaultdict

    class LFUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.vals = {}
            self.freq = {}
            self.groups = defaultdict(OrderedDict)
            self.min_freq = 0

        def _touch(self, key):
            f = self.freq[key]
            del self.groups[f][key]
            if not self.groups[f]:
                del self.groups[f]
                if self.min_freq == f:
                    self.min_freq = f + 1
            self.freq[key] = f + 1
            self.groups[f + 1][key] = None

        def get(self, key):
            if key not in self.vals:
                return -1
            self._touch(key)
            return self.vals[key]

        def put(self, key, value):
            if key in self.vals:
                self.vals[key] = value
                return
            if len(self.vals) == self.capacity:
                old, _ = self.groups[self.min_freq].popitem(last=False)
                if not self.groups[self.min_freq]:
                    del self.groups[self.min_freq]
                del self.vals[old]
                del self.freq[old]
            self.vals[key] = value
            self.freq[key] = 1
            self.groups[1][key] = None
            self.min_freq = 1
equivalent:
  - "10: self.min_freq = 1"  # why: min_freq is read only in _touch, which runs on a stored key, and in put's eviction, which runs only on a full cache; both happen only after the first insert sets min_freq to 1, so the starting value is never read
  - "10: self.min_freq = -1"  # why: same as above; the starting value is overwritten by the first insert before any read
---
::
