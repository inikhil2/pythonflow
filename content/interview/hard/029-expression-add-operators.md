---
title: Expression Add Operators
tier: hard
order: 29
leetcode: 282
url: https://leetcode.com/problems/expression-add-operators/
companies: [Google, Meta, Amazon]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers, /learn/week10-algorithms/06-recursion-and-backtracking]
---

You get a string num of between 1 and 9 digits, and a whole number target. Between any two neighbouring digits you may put a + , a - , a * , or nothing. Putting nothing glues the two digits into one longer number. Build every expression that reads the digits in their given order and whose value equals target. The usual rule applies: * is done before + and -.

A number made of more than one digit may not start with 0, so "05" is not allowed, while a lone "0" and "10" are. Return a list of all the expressions as strings, in any order. Return an empty list if there are none. The target is between -1000000000 and 1000000000.

::exercise
---
id: iv-hard-029
prompt: Write a function add_operators(num, target) that returns a list of every expression, built by inserting +, - or * between the digits of num (or gluing them), that equals target.
starter: |
  # write your code below
  def add_operators(num, target):
      pass
hints:
  - Go through the string choosing where the next number ends. For each number, try each operator in front of it.
  - Multiplication binds tighter than the running total. Remember the last number added, so you can take it back out and put its product in instead.
tests:
  - check: assert sorted(add_operators("123", 6)) == ["1*2*3", "1+2+3"]
  - check: assert sorted(add_operators("232", 8)) == ["2*3+2", "2+3*2"]
  - check: assert sorted(add_operators("105", 5)) == ["1*0+5", "10-5"]
  - check: assert sorted(add_operators("00", 0)) == ["0*0", "0+0", "0-0"]
  - check: assert add_operators("1", 1) == ["1"]
  - check: assert add_operators("1", 5) == []
  - check: assert add_operators("999", 81) == []
  - check: assert add_operators("123", -5) == ["1-2*3"]
  - check: assert sorted(add_operators("100", 0)) == ["1*0*0", "1*0+0", "1*0-0", "10*0"]
  - check: assert sorted(add_operators("2020", 20)) == ["2*0+20", "20+2*0", "20-2*0"]
  - check: assert sorted(add_operators("3333", 9)) == ["3*3+3-3", "3*3-3+3", "3+3*3-3", "3-3+3*3"]
solution: |
  def add_operators(num, target):
      out = []

      def go(i, expr, total, last):
          if i == len(num):
              if total == target:
                  out.append(expr)
              return
          for j in range(i + 1, len(num) + 1):
              part = num[i:j]
              if len(part) > 1 and part[0] == "0":
                  break
              v = int(part)
              if i == 0:
                  go(j, part, v, v)
              else:
                  go(j, expr + "+" + part, total + v, v)
                  go(j, expr + "-" + part, total - v, -v)
                  go(j, expr + "*" + part, total - last + last * v, last * v)

      go(0, "", 0, 0)
      return out
brute: |
  def add_operators(num, target):
      from itertools import product
      n = len(num)
      found = []
      for cuts in product([0, 1], repeat=n - 1):
          parts = [num[0]]
          for digit, cut in zip(num[1:], cuts):
              if cut:
                  parts.append(digit)
              else:
                  parts[-1] += digit
          if any(len(p) > 1 and p[0] == "0" for p in parts):
              continue
          for ops in product("+-*", repeat=len(parts) - 1):
              text = parts[0]
              for op, p in zip(ops, parts[1:]):
                  text += op + p
              if eval(text) == target:
                  found.append(text)
      return found
valid: |
  def valid(num, target):
      return isinstance(num, str) and 1 <= len(num) <= 9 and num.isdigit() and isinstance(target, int) and abs(target) <= 10**9
random:
  call: add_operators
  same: |
    def same(args, got, want):
        return sorted(got) == sorted(want)
  gen: |
    def gen(rng, size):
        n = rng.randint(1, min(size + 1, 7))
        num = "".join(rng.choice("0011223456789") for _ in range(n))
        ops = [rng.choice(["", "+", "-", "*"]) for _ in range(n - 1)]
        text = num[0] + "".join(o + d for o, d in zip(ops, num[1:]))
        try:
            target = eval(text)
        except SyntaxError:
            target = rng.randint(-30, 100)
        if rng.random() < 0.3:
            target += rng.randint(-5, 5)
        return (num, target)
big: assert len(add_operators("314159265", 100)) == 65 and sorted(add_operators("314159265", 100))[::32] == ["3*1*4*1*5+9+26+5", "3+14*1*5+92-65", "314+15-9*26+5"]
no_slow: "there are at most 4 to the 8th power, about 65000, ways to choose the signs for 9 digits, so even writing out and evaluating every one takes about a second"
equivalent:
  - "for j in range(i + 1, len(num) + 2):"  # why: the extra j gives the same slice as the last one, and its call has i larger than len(num), so it loops over nothing and adds no expression
  - "go(0, '', 1, 0)"  # why: the first number takes the i == 0 branch, which sets total and last from the number itself and ignores the starting total
  - "go(0, '', -1, 0)"  # why: same as above, the starting total is never read
  - "go(0, '', 0, 1)"  # why: same as above, the starting last is never read
  - "go(0, '', 0, -1)"  # why: same as above, the starting last is never read
wrong:
  - |
    def add_operators(num, target):
        out = []

        def go(i, expr, total):
            if i == len(num):
                if total == target:
                    out.append(expr)
                return
            for j in range(i + 1, len(num) + 1):
                part = num[i:j]
                if len(part) > 1 and part[0] == "0":
                    break
                v = int(part)
                if i == 0:
                    go(j, part, v)
                else:
                    go(j, expr + "+" + part, total + v)
                    go(j, expr + "-" + part, total - v)
                    go(j, expr + "*" + part, total * v)

        go(0, "", 0)
        return out
  - |
    def add_operators(num, target):
        out = []

        def go(i, expr, total, last):
            if i == len(num):
                if total == target:
                    out.append(expr)
                return
            for j in range(i + 1, len(num) + 1):
                part = num[i:j]
                v = int(part)
                if i == 0:
                    go(j, part, v, v)
                else:
                    go(j, expr + "+" + part, total + v, v)
                    go(j, expr + "-" + part, total - v, -v)
                    go(j, expr + "*" + part, total - last + last * v, last * v)

        go(0, "", 0, 0)
        return out
  - |
    def add_operators(num, target):
        out = []

        def go(i, expr, total, last):
            if i == len(num):
                if total == target:
                    out.append(expr)
                return
            part = num[i]
            v = int(part)
            if i == 0:
                go(i + 1, part, v, v)
            else:
                go(i + 1, expr + "+" + part, total + v, v)
                go(i + 1, expr + "-" + part, total - v, -v)
                go(i + 1, expr + "*" + part, total - last + last * v, last * v)

        go(0, "", 0, 0)
        return out
  - |
    def add_operators(num, target):
        out = []

        def go(i, expr, total, last):
            if i == len(num):
                if total == target:
                    out.append(expr)
                return
            for j in range(i + 1, len(num) + 1):
                part = num[i:j]
                if len(part) > 1 and part[0] == "0":
                    break
                v = int(part)
                if i == 0:
                    go(j, part, v, v)
                else:
                    go(j, expr + "+" + part, total + v, v)
                    go(j, expr + "-" + part, total - v, v)
                    go(j, expr + "*" + part, total - last + last * v, last * v)

        go(0, "", 0, 0)
        return out
---
::
