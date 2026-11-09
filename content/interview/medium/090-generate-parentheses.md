---
title: Generate Parentheses
tier: medium
order: 90
leetcode: 22
url: https://leetcode.com/problems/generate-parentheses/
companies: [Amazon, Google, Meta]
topic: Dynamic programming
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/06-recursion-and-backtracking, /learn/week10-algorithms/10-dynamic-programming]
---

You get a whole number `n` from 1 to 10. Return every string of exactly `n` pairs of round brackets that is well formed. A string is well formed when every closing bracket has a matching opening bracket before it, and the brackets are balanced at the end.

For `n = 3` the answer has 5 strings, such as `"((()))"` and `"()()()"`. The strings may come back in any order.

::exercise
---
id: iv-medium-090
prompt: Write a function generate_parentheses(n) that returns a list of every well-formed string made of n pairs of round brackets.
starter: |
  # write your code below
  def generate_parentheses(n):
      pass
hints:
  - Build the string one bracket at a time. You may add an opening bracket while you have not used all n of them, and you may add a closing bracket only when it closes an opening bracket already placed.
  - Each step has at most two choices, so try both and step back when a branch cannot finish. Once the string has 2n brackets, add it to the answer.
tests:
  - check: assert sorted(generate_parentheses(1)) == ["()"]
  - check: assert sorted(generate_parentheses(2)) == ["(())", "()()"]
  - check: assert sorted(generate_parentheses(3)) == ["((()))", "(()())", "(())()", "()(())", "()()()"]
  - check: assert len(generate_parentheses(4)) == 14
  - check: assert all(s.count("(") == 4 and s.count(")") == 4 for s in generate_parentheses(4))
  - check: assert sorted(generate_parentheses(4))[0] == "(((())))"
  - check: assert len(set(generate_parentheses(5))) == 42
  - check: assert "())(" not in generate_parentheses(2)
  - check: assert [len(generate_parentheses(k)) for k in range(1, 8)] == [1, 2, 5, 14, 42, 132, 429]
big: assert len(generate_parentheses(10)) == 16796 and len(set(generate_parentheses(10))) == 16796
solution: |
  def generate_parentheses(n):
      answer = []
      def build(s, opened, closed):
          if len(s) == 2 * n:
              answer.append(s)
              return
          if opened < n:
              build(s + "(", opened + 1, closed)
          if closed < opened:
              build(s + ")", opened, closed + 1)
      build("", 0, 0)
      return answer
brute: |
  import itertools
  def generate_parentheses(n):
      answer = []
      for combo in itertools.product("()", repeat=2 * n):
          s = "".join(combo)
          depth = 0
          ok = True
          for ch in s:
              depth += 1 if ch == "(" else -1
              if depth < 0:
                  ok = False
                  break
          if ok and depth == 0:
              answer.append(s)
      return answer
slow:
  - |
    def generate_parentheses(n):
        answer = []
        for i in range(1 << (2 * n)):
            s = ""
            for b in range(2 * n):
                s += "(" if i >> b & 1 else ")"
            depth = 0
            ok = True
            for ch in s:
                depth += 1 if ch == "(" else -1
                if depth < 0:
                    ok = False
            if ok and depth == 0:
                answer.append(s)
        return answer
random:
  call: generate_parentheses
  min_distinct: 10   # why: n runs from 1 to 10, so exactly 10 inputs exist
  gen: |
    def gen(rng, size):
        return (rng.randint(1, max(1, min(size, 10))),)
wrong:
  - |
    def generate_parentheses(n):
        answer = []
        def build(s, opened, closed):
            if len(s) == 2 * n:
                if opened == closed:
                    answer.append(s)
                return
            if opened < n:
                build(s + "(", opened + 1, closed)
            if closed < n:
                build(s + ")", opened, closed + 1)
        build("", 0, 0)
        return answer
  - |
    def generate_parentheses(n):
        answer = []
        def build(s, opened, closed):
            if len(s) == 2 * n:
                answer.append(s)
                return
            if opened < n:
                build(s + "(", opened + 1, closed)
            if closed <= opened:
                build(s + ")", opened, closed + 1)
        build("", 0, 0)
        return answer
  - |
    def generate_parentheses(n):
        return ["()" * n]
---
::
