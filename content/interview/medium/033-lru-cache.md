---
title: LRU Cache
tier: medium
order: 33
leetcode: 146
url: https://leetcode.com/problems/lru-cache/
companies: [Amazon, Google, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/04-dictionaries]
---

Write a class `LRUCache` that remembers up to `capacity` key and value pairs and forgets the one that was used longest ago. "Used" means read with `get` or written with `put`. It has three parts:

- `LRUCache(capacity)` starts an empty cache. `capacity` is from 1 to 20000.
- `get(key)` returns the value stored for `key`, or `-1` if the cache does not hold `key`. A successful `get` counts as a use of that key.
- `put(key, value)` stores `value` for `key`, replacing an old value if the key is already there, and counts as a use of that key. If that makes the cache hold more than `capacity` keys, it removes the key that was used longest ago.

Keys and values are whole numbers from 0 to 100000, so `-1` can never be a real value. There are at most 100000 calls in all, and the biggest tests make tens of thousands of `get` and `put` calls on a full cache, so each call has to take only a few steps.

::exercise
---
id: iv-medium-033
prompt: Write a class LRUCache(capacity) with get(key) and put(key, value) that drops the least recently used key when it is over capacity, and keeps every call fast.
starter: |
  # write your code below
  class LRUCache:
      pass
hints:
  - A dictionary finds a key at once, but it does not know which key was used longest ago. You need an order as well.
  - collections.OrderedDict keeps keys in order, can move a key to the end with move_to_end, and can drop the first key with popitem(last=False).
tests:
  - check: c = LRUCache(2); c.put(1, 1); c.put(2, 2); assert c.get(1) == 1; c.put(3, 3); assert c.get(2) == -1; assert c.get(3) == 3
  - check: c = LRUCache(1); c.put(1, 10); c.put(2, 20); assert c.get(1) == -1; assert c.get(2) == 20
  - check: c = LRUCache(2); c.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3); assert c.get(2) == -1; assert c.get(1) == 10
  - check: c = LRUCache(3); assert c.get(5) == -1; c.put(5, 0); assert c.get(5) == 0
  - check: c = LRUCache(2); c.put(1, 1); c.put(2, 2); c.put(2, 20); assert c.get(1) == 1; assert c.get(2) == 20
  - check: c = LRUCache(3); c.put(1, 1); c.put(2, 2); c.put(3, 3); c.get(1); c.get(2); c.put(4, 4); assert c.get(3) == -1; assert c.get(1) == 1 and c.get(2) == 2 and c.get(4) == 4
  - check: c = LRUCache(3); c.put(1, 1); c.put(2, 2); c.put(3, 3); assert c.get(1) == 1 and c.get(2) == 2 and c.get(3) == 3
big: 'c = LRUCache(20000); r = [c.get(k) if v is None else c.put(k, v) for k, v in [(k, k % 7 + 1) for k in range(20000)] + [op for t in range(4000) for op in ((2 * t, None if t % 2 == 0 else 100 + t), (20000 + t, t % 5 + 1))] + [(k, None) for k in range(8000)] + [(20000 + j % 2000, None) for j in range(64000)]]; g = [x for x in r if x is not None]; assert len(g) == 74000 and sum(g) == 4403994 and g.count(-1) == 4000'
solution: |
  from collections import OrderedDict


  class LRUCache:
      def __init__(self, capacity):
          self.capacity = capacity
          self.items = OrderedDict()

      def get(self, key):
          if key not in self.items:
              return -1
          self.items.move_to_end(key)
          return self.items[key]

      def put(self, key, value):
          if key in self.items:
              self.items.move_to_end(key)
          self.items[key] = value
          if len(self.items) > self.capacity:
              self.items.popitem(last=False)
brute: |
  class LRUCache:
      def __init__(self, capacity):
          self.capacity = capacity
          self.order = []
          self.data = {}

      def get(self, key):
          if key not in self.data:
              return -1
          self.order.remove(key)
          self.order.append(key)
          return self.data[key]

      def put(self, key, value):
          if key in self.data:
              self.order.remove(key)
          elif len(self.order) == self.capacity:
              oldest = self.order.pop(0)
              del self.data[oldest]
          self.order.append(key)
          self.data[key] = value
valid: |
  def valid(capacity, ops, args):
      if not 1 <= capacity <= 20000 or len(ops) != len(args) or len(ops) > 100000:
          return False
      for op, a in zip(ops, args):
          if op == "get" and len(a) == 1:
              pass
          elif op == "put" and len(a) == 2:
              pass
          else:
              return False
          if not all(0 <= v <= 100000 for v in a):
              return False
      return True
random:
  call: _pf_drive
  driver: |
    def _pf_drive(capacity, ops, args):
        c = LRUCache(capacity)
        return [getattr(c, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        cap = rng.randint(1, 4)
        keys = rng.randint(cap, cap + 4)
        ops, args = [], []
        for _ in range(rng.randint(1, size + 8)):
            if rng.random() < 0.5:
                ops.append("put"); args.append([rng.randrange(keys), rng.randint(0, 9)])
            else:
                ops.append("get"); args.append([rng.randrange(keys)])
        return (cap, ops, args)
wrong:
  - |
    from collections import OrderedDict


    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.items = OrderedDict()

        def get(self, key):
            if key not in self.items:
                return -1
            return self.items[key]

        def put(self, key, value):
            if key in self.items:
                self.items.move_to_end(key)
            self.items[key] = value
            if len(self.items) > self.capacity:
                self.items.popitem(last=False)
  - |
    from collections import OrderedDict


    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.items = OrderedDict()

        def get(self, key):
            if key not in self.items:
                return -1
            self.items.move_to_end(key)
            return self.items[key]

        def put(self, key, value):
            self.items[key] = value
            if len(self.items) > self.capacity:
                self.items.popitem(last=False)
  - |
    from collections import OrderedDict


    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.items = OrderedDict()

        def get(self, key):
            if key not in self.items:
                return -1
            self.items.move_to_end(key)
            return self.items[key]

        def put(self, key, value):
            if len(self.items) >= self.capacity:
                self.items.popitem(last=False)
            if key in self.items:
                self.items.move_to_end(key)
            self.items[key] = value
  - |
    from collections import OrderedDict


    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.items = OrderedDict()

        def get(self, key):
            if not self.items.get(key):
                return -1
            self.items.move_to_end(key)
            return self.items[key]

        def put(self, key, value):
            if key in self.items:
                self.items.move_to_end(key)
            self.items[key] = value
            if len(self.items) > self.capacity:
                self.items.popitem(last=False)
slow:
  - |
    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.keys = []
            self.data = {}

        def _use(self, key):
            for i in range(len(self.keys)):
                if self.keys[i] == key:
                    self.keys.pop(i)
                    break
            self.keys.append(key)

        def get(self, key):
            if key not in self.data:
                return -1
            self._use(key)
            return self.data[key]

        def put(self, key, value):
            if key in self.data:
                self._use(key)
            else:
                if len(self.keys) == self.capacity:
                    del self.data[self.keys.pop(0)]
                self.keys.append(key)
            self.data[key] = value
  - |
    class LRUCache:
        def __init__(self, capacity):
            self.capacity = capacity
            self.keys = []
            self.data = {}

        def get(self, key):
            if key not in self.data:
                return -1
            self.keys.remove(key)
            self.keys.append(key)
            return self.data[key]

        def put(self, key, value):
            if key in self.data:
                self.keys.remove(key)
            elif len(self.keys) == self.capacity:
                del self.data[self.keys.pop(0)]
            self.keys.append(key)
            self.data[key] = value
---
::
