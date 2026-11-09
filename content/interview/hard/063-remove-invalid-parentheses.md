---
title: Remove Invalid Parentheses
tier: hard
order: 63
leetcode: 301
url: https://leetcode.com/problems/remove-invalid-parentheses/
companies: [Google, Meta, Amazon]
topic: Backtracking
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week2-loops/01-while-loops, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a string of length 1 to 20 made of lowercase letters and the characters ( and ). A string of parentheses is valid when every opening parenthesis has a closing one after it, paired in the usual way, and the letters do not affect this. An empty string or one with no parentheses is valid.

Remove the fewest parentheses needed to make the string valid. Letters are never removed. Return every distinct string that you can get this way, with no repeats, in any order. If the string is already valid, return a list holding just that string.

The number of ways to remove characters grows fast, so try the removals in rounds. In the first round, consider the string itself. Each round removes exactly one more parenthesis from every string of the previous round. Stop at the first round where some string is valid, and return all the valid strings from that round.

::exercise
---
id: iv-hard-063
prompt: Write a function remove_invalid(s) that returns a list of every distinct valid string reachable from s by removing the fewest parentheses, in any order.
starter: |
  # write your code below
  def remove_invalid(s):
      pass
hints:
  - A string is valid when its running count of open parentheses never goes below zero and ends at zero.
  - Keep a set of strings for the current round, and build the next round by removing one parenthesis from each string in it.
tests:
  - check: assert sorted(remove_invalid("()())()")) == ["(())()", "()()()"]
  - check: assert sorted(remove_invalid("(a)())()")) == ["(a())()", "(a)()()"]
  - check: assert sorted(remove_invalid(")(")) == [""]
  - check: assert remove_invalid("abc") == ["abc"]
  - check: assert sorted(remove_invalid("(()")) == ["()"]
  - check: assert sorted(remove_invalid("()")) == ["()"]
  - check: assert sorted(remove_invalid("(a(b)")) == ["(ab)", "a(b)"]
  - check: assert sorted(remove_invalid("))((")) == [""]
  - check: assert sorted(remove_invalid("x)y(z")) == ["xyz"]
  - check: assert sorted(remove_invalid("((a)")) == ["(a)"]
big: assert sum(len(t) * (i + 1) for i, t in enumerate(sorted(remove_invalid(")((()a))b(a)()(()))a")))) == 270
solution: |
  def remove_invalid(s):
      def valid(t):
          balance = 0
          for ch in t:
              if ch == "(":
                  balance += 1
              elif ch == ")":
                  balance -= 1
                  if balance < 0:
                      return False
          return balance == 0
      level = {s}
      while True:
          good = [t for t in level if valid(t)]
          if good:
              return good
          nxt = set()
          for t in level:
              for i, ch in enumerate(t):
                  if ch in "()":
                      nxt.add(t[:i] + t[i + 1:])
          level = nxt
brute: |
  def remove_invalid(s):
      def valid(t):
          balance = 0
          for ch in t:
              if ch == "(":
                  balance += 1
              elif ch == ")":
                  balance -= 1
                  if balance < 0:
                      return False
          return balance == 0
      spots = [i for i, ch in enumerate(s) if ch in "()"]
      best = None
      found = set()
      for mask in range(1 << len(spots)):
          drop = {spots[j] for j in range(len(spots)) if (mask >> j) & 1}
          t = "".join(ch for i, ch in enumerate(s) if i not in drop)
          if not valid(t):
              continue
          if best is None or len(drop) < best:
              best = len(drop)
              found = {t}
          elif len(drop) == best:
              found.add(t)
      return list(found)
random:
  call: remove_invalid
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
  gen: |
    def gen(rng, size):
        length = min(max(size, 1), 12)
        return ("".join(rng.choice("()ab") for _ in range(length)),)
slow:
  - |
    def remove_invalid(s):
        def valid(t):
            balance = 0
            for ch in t:
                if ch == "(":
                    balance += 1
                elif ch == ")":
                    balance -= 1
                    if balance < 0:
                        return False
            return balance == 0
        spots = [i for i, ch in enumerate(s) if ch in "()"]
        best = None
        found = set()
        for mask in range(1 << len(spots)):
            drop = {spots[j] for j in range(len(spots)) if (mask >> j) & 1}
            t = "".join(ch for i, ch in enumerate(s) if i not in drop)
            if not valid(t):
                continue
            if best is None or len(drop) < best:
                best = len(drop)
                found = {t}
            elif len(drop) == best:
                found.add(t)
        return list(found)
wrong:
  - |
    def remove_invalid(s):
        out = []
        balance = 0
        for ch in s:
            if ch == "(":
                balance += 1
            elif ch == ")":
                if balance == 0:
                    continue
                balance -= 1
            out.append(ch)
        return ["".join(out)]
  - |
    def remove_invalid(s):
        def valid(t):
            balance = 0
            for ch in t:
                if ch == "(":
                    balance += 1
                elif ch == ")":
                    balance -= 1
                    if balance < 0:
                        return False
            return balance == 0
        level = [s]
        while True:
            good = [t for t in level if valid(t)]
            if good:
                return good[:1]
            nxt = []
            for t in level:
                for i, ch in enumerate(t):
                    if ch in "()":
                        nxt.append(t[:i] + t[i + 1:])
            level = nxt
  - |
    def remove_invalid(s):
        def valid(t):
            balance = 0
            for ch in t:
                if ch == "(":
                    balance += 1
                elif ch == ")":
                    balance -= 1
                    if balance < 0:
                        return False
            return balance == 0
        level = {s}
        while True:
            good = [t for t in level if valid(t)]
            if good:
                return good + good
            nxt = set()
            for t in level:
                for i, ch in enumerate(t):
                    if ch in "()":
                        nxt.add(t[:i] + t[i + 1:])
            level = nxt
equivalent: []
---
::
