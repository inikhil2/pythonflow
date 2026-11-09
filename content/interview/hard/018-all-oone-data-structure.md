---
title: "All O`one Data Structure"
tier: hard
order: 18
leetcode: 432
url: https://leetcode.com/problems/all-oone-data-structure/
companies: [Amazon, Meta, Apple]
topic: Hash table
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/04-dictionaries, /learn/week8-objects/01-classes]
---

Write a class AllOne that keeps a count for each string key. Each key is one to ten lowercase letters, and the class must handle at most 60000 calls in total.

The method inc(key) adds 1 to the count of key, and a key that is new starts at 1. The method dec(key) subtracts 1 from the count of key. You may assume key is stored when dec is called. When a count drops to 0, the key is removed. The method get_max_key() returns a key with the highest count, and get_min_key() returns a key with the lowest count. When more than one key ties, either one is correct. When no keys are stored, both return the empty string `""`.

Scanning every key on each call is too slow for the largest inputs. Keep the keys grouped by their count, so that each call finds the largest or smallest group in a few steps.

::exercise
---
id: iv-hard-018
prompt: Write a class AllOne with inc(key), dec(key), get_max_key() and get_min_key(), which track a count for each string key. The two getters return a key with the highest or lowest count, or "" when no keys are stored.
starter: |
  # write your code below
  class AllOne:
      def __init__(self):
          pass

      def inc(self, key):
          pass

      def dec(self, key):
          pass

      def get_max_key(self):
          pass

      def get_min_key(self):
          pass
hints:
  - Keep a dictionary from each key to its count, and a second dictionary from each count to the set of keys that have that count.
  - When a key moves from count c to c + 1 or c - 1, take it out of its old group and put it in the new one. Delete a group once it is empty, then read the largest or smallest group's count with max or min.
tests:
  - check: s = AllOne(); assert s.get_max_key() == "" and s.get_min_key() == ""
  - check: s = AllOne(); s.inc("hello"); assert s.get_max_key() == "hello" and s.get_min_key() == "hello"
  - check: s = AllOne(); s.inc("a"); s.inc("b"); s.inc("b"); assert s.get_max_key() == "b" and s.get_min_key() == "a"
  - check: s = AllOne(); s.inc("a"); s.dec("a"); assert s.get_max_key() == "" and s.get_min_key() == ""
  - check: s = AllOne(); s.inc("a"); s.inc("a"); s.dec("a"); assert s.get_max_key() == "a" and s.get_min_key() == "a"
  - check: s = AllOne(); s.inc("a"); s.inc("b"); assert s.get_max_key() in ("a", "b") and s.get_min_key() in ("a", "b")
  - check: s = AllOne(); s.inc("x"); s.inc("y"); s.inc("y"); s.inc("z"); s.inc("z"); s.dec("z"); assert s.get_max_key() == "y" and s.get_min_key() in ("x", "z")
  - check: s = AllOne(); [s.inc(k) for k in "abcab"]; assert s.get_min_key() == "c" and s.get_max_key() in ("a", "b")
  - check: s = AllOne(); s.inc("q"); s.inc("q"); s.inc("q"); s.dec("q"); s.dec("q"); assert s.get_max_key() == "q" and s.get_min_key() == "q"
  - check: s = AllOne(); s.inc("m"); s.inc("n"); s.dec("m"); assert s.get_max_key() == "n" and s.get_min_key() == "n"
big: ks = ["".join(chr(97 + (i // 26 ** j) % 26) for j in range(3)) for i in range(17576)]; seq = [ks[(i * 7919) % 17576] for i in range(20000)]; s = AllOne(); [(s.inc(k), s.get_max_key()) for k in seq]; [s.dec(k) for k in seq[:10000]]; c = __import__("collections").Counter(seq) - __import__("collections").Counter(seq[:10000]); assert c[s.get_max_key()] == max(c.values()) and c[s.get_min_key()] == min(c.values())
solution: |
  class AllOne:
      def __init__(self):
          self.cnt = {}
          self.by_count = {}

      def _move(self, key, old, new):
          if old:
              self.by_count[old].discard(key)
              if not self.by_count[old]:
                  del self.by_count[old]
          if new:
              self.by_count.setdefault(new, set()).add(key)

      def inc(self, key):
          old = self.cnt.get(key, 0)
          self.cnt[key] = old + 1
          self._move(key, old, old + 1)

      def dec(self, key):
          old = self.cnt[key]
          if old == 1:
              del self.cnt[key]
          else:
              self.cnt[key] = old - 1
          self._move(key, old, old - 1)

      def get_max_key(self):
          if not self.by_count:
              return ""
          return next(iter(self.by_count[max(self.by_count)]))

      def get_min_key(self):
          if not self.by_count:
              return ""
          return next(iter(self.by_count[min(self.by_count)]))
brute: |
  class AllOne:
      def __init__(self):
          self.cnt = {}

      def inc(self, key):
          self.cnt[key] = self.cnt.get(key, 0) + 1

      def dec(self, key):
          self.cnt[key] -= 1
          if self.cnt[key] == 0:
              del self.cnt[key]

      def get_max_key(self):
          if not self.cnt:
              return ""
          return max(self.cnt, key=self.cnt.get)

      def get_min_key(self):
          if not self.cnt:
              return ""
          return min(self.cnt, key=self.cnt.get)
valid: |
  def valid(ops, args):
      if len(ops) != len(args) or not 1 <= len(ops) <= 60000:
          return False
      cnt = {}
      for op, a in zip(ops, args):
          if op in ("inc", "dec"):
              if len(a) != 1 or not (isinstance(a[0], str) and 1 <= len(a[0]) <= 10 and a[0].isalpha() and a[0].islower()):
                  return False
              k = a[0]
              if op == "inc":
                  cnt[k] = cnt.get(k, 0) + 1
              else:
                  if cnt.get(k, 0) == 0:
                      return False
                  cnt[k] -= 1
                  if cnt[k] == 0:
                      del cnt[k]
          elif op in ("get_max_key", "get_min_key"):
              if a:
                  return False
          else:
              return False
      return True
random:
  call: _all_one_drive
  driver: |
    def _all_one_drive(ops, args):
        s = AllOne()
        return [getattr(s, op)(*a) for op, a in zip(ops, args)]
  gen: |
    def gen(rng, size):
        ops, args, cnt = [], [], {}
        for _ in range(rng.randint(1, size * 3 + 3)):
            r = rng.random()
            if cnt and r < 0.3:
                k = rng.choice(sorted(cnt))
                ops.append("dec")
                args.append([k])
                cnt[k] -= 1
                if cnt[k] == 0:
                    del cnt[k]
            elif r < 0.6:
                k = rng.choice("abcde")
                ops.append("inc")
                args.append([k])
                cnt[k] = cnt.get(k, 0) + 1
            else:
                ops.append(rng.choice(["get_max_key", "get_min_key"]))
                args.append([])
        return (ops, args)
  same: |
    def same(args, got, want):
        ops, a = args
        cnt = {}
        for op, x, g in zip(ops, a, got):
            if op == "inc":
                cnt[x[0]] = cnt.get(x[0], 0) + 1
            elif op == "dec":
                cnt[x[0]] -= 1
                if cnt[x[0]] == 0:
                    del cnt[x[0]]
            elif op == "get_max_key":
                if not cnt:
                    ok = g == ""
                else:
                    ok = g in cnt and cnt[g] == max(cnt.values())
                if not ok:
                    return False
            else:
                if not cnt:
                    ok = g == ""
                else:
                    ok = g in cnt and cnt[g] == min(cnt.values())
                if not ok:
                    return False
        return True
slow:
  - |
    class AllOne:
        def __init__(self):
            self.cnt = {}

        def inc(self, key):
            self.cnt[key] = self.cnt.get(key, 0) + 1

        def dec(self, key):
            self.cnt[key] -= 1
            if self.cnt[key] == 0:
                del self.cnt[key]

        def get_max_key(self):
            best = ""
            for k in self.cnt:
                if best == "" or self.cnt[k] > self.cnt[best]:
                    best = k
            return best

        def get_min_key(self):
            best = ""
            for k in self.cnt:
                if best == "" or self.cnt[k] < self.cnt[best]:
                    best = k
            return best
wrong:
  - |
    class AllOne:
        def __init__(self):
            self.cnt = {}

        def inc(self, key):
            self.cnt[key] = self.cnt.get(key, 0) + 1

        def dec(self, key):
            self.cnt[key] -= 1
            if self.cnt[key] == 0:
                del self.cnt[key]

        def get_max_key(self):
            return max(self.cnt) if self.cnt else ""

        def get_min_key(self):
            return min(self.cnt, key=self.cnt.get) if self.cnt else ""
  - |
    class AllOne:
        def __init__(self):
            self.cnt = {}

        def inc(self, key):
            self.cnt[key] = self.cnt.get(key, 0) + 1

        def dec(self, key):
            self.cnt[key] -= 1

        def get_max_key(self):
            if not self.cnt:
                return ""
            return max(self.cnt, key=self.cnt.get)

        def get_min_key(self):
            if not self.cnt:
                return ""
            return min(self.cnt, key=self.cnt.get)
  - |
    class AllOne:
        def __init__(self):
            self.cnt = {}

        def inc(self, key):
            self.cnt[key] = self.cnt.get(key, 0) + 1

        def dec(self, key):
            self.cnt[key] -= 1
            if self.cnt[key] == 0:
                del self.cnt[key]

        def get_max_key(self):
            if not self.cnt:
                return ""
            return max(self.cnt, key=self.cnt.get)

        def get_min_key(self):
            if not self.cnt:
                return ""
            return max(self.cnt, key=self.cnt.get)
---
::
