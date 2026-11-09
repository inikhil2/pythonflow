---
title: Evaluate Reverse Polish Notation
tier: medium
order: 24
leetcode: 150
url: https://leetcode.com/problems/evaluate-reverse-polish-notation/
companies: [Amazon, Google, Meta]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/06-numbers]
---

You get a list `tokens` of 1 to 10000 strings. Each token is either an integer, written with an optional minus sign, or one of the four operators `+`, `-`, `*` and `/`. Each integer is from -200 to 200. The list is a valid Reverse Polish expression: each operator comes after the two numbers it works on, and the whole list reduces to one number. Evaluate it and return that number as an integer.

Division keeps only the whole part and throws away the fraction, rounding toward zero. So 7 divided by -2 is -3, not -4. You may assume no division by zero happens, and that every intermediate result fits in a normal integer.

For example, `["2", "1", "+", "3", "*"]` means (2 + 1) * 3, which is 9.

::exercise
---
id: iv-medium-024
prompt: Write a function eval_rpn(tokens) that evaluates a Reverse Polish expression given as a list of strings and returns the integer result.
starter: |
  # write your code below
  def eval_rpn(tokens):
      pass
hints:
  - Walk the tokens from left to right and keep the numbers you have seen in a list. An operator takes the last two numbers off the list.
  - For division, do not use // alone: it rounds down. Round toward zero instead.
tests:
  - check: assert eval_rpn(["2", "1", "+", "3", "*"]) == 9
  - check: assert eval_rpn(["4", "13", "5", "/", "+"]) == 6
  - check: assert eval_rpn(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]) == 22
  - check: assert eval_rpn(["7", "-2", "/"]) == -3
  - check: assert eval_rpn(["3"]) == 3
  - check: assert eval_rpn(["-3", "-2", "-"]) == -1
  - check: assert eval_rpn(["2", "3", "-", "4", "*"]) == -4
  - check: assert eval_rpn(["-6", "4", "/"]) == -1
no_slow: "The list has at most 10000 tokens, and every method that reads the tokens once is fast enough; a slower method gives the same answers, so no slower method is a wrong answer."
solution: |
  def eval_rpn(tokens):
      stack = []
      for tok in tokens:
          if tok in ("+", "-", "*", "/"):
              b = stack.pop()
              a = stack.pop()
              if tok == "+":
                  stack.append(a + b)
              elif tok == "-":
                  stack.append(a - b)
              elif tok == "*":
                  stack.append(a * b)
              else:
                  q = abs(a) // abs(b)
                  stack.append(q if (a < 0) == (b < 0) else -q)
          else:
              stack.append(int(tok))
      return stack[0]
brute: |
  def eval_rpn(tokens):
      items = list(tokens)
      while len(items) > 1:
          for i, tok in enumerate(items):
              if tok in ("+", "-", "*", "/"):
                  a, b = int(items[i - 2]), int(items[i - 1])
                  if tok == "+":
                      v = a + b
                  elif tok == "-":
                      v = a - b
                  elif tok == "*":
                      v = a * b
                  else:
                      v = int(a / b)
                  items[i - 2:i + 1] = [str(v)]
                  break
      return int(items[0])
random:
  call: eval_rpn
  gen: |
    def gen(rng, size):
        def build(depth):
            if depth == 0 or rng.random() < 0.4:
                n = rng.randint(-9, 9)
                return [str(n)], n
            while True:
                lt, lv = build(depth - 1)
                rt, rv = build(depth - 1)
                op = rng.choice("+-*/")
                if op == "/":
                    if rv == 0:
                        continue
                    q = abs(lv) // abs(rv)
                    v = q if (lv < 0) == (rv < 0) else -q
                elif op == "+":
                    v = lv + rv
                elif op == "-":
                    v = lv - rv
                else:
                    v = lv * rv
                if abs(v) <= 200:
                    return lt + rt + [op], v
        tokens, _ = build(min(1 + size // 3, 4))
        return (tokens,)
wrong:
  - |
    def eval_rpn(tokens):
        stack = []
        for tok in tokens:
            if tok in ("+", "-", "*", "/"):
                b = stack.pop()
                a = stack.pop()
                if tok == "+":
                    stack.append(a + b)
                elif tok == "-":
                    stack.append(a - b)
                elif tok == "*":
                    stack.append(a * b)
                else:
                    stack.append(a // b)
            else:
                stack.append(int(tok))
        return stack[0]
  - |
    def eval_rpn(tokens):
        stack = []
        for tok in tokens:
            if tok in ("+", "-", "*", "/"):
                b = stack.pop()
                a = stack.pop()
                if tok == "+":
                    stack.append(a + b)
                elif tok == "-":
                    stack.append(b - a)
                elif tok == "*":
                    stack.append(a * b)
                else:
                    stack.append(int(a / b))
            else:
                stack.append(int(tok))
        return stack[-1]
  - |
    def eval_rpn(tokens):
        stack = []
        for tok in tokens:
            if tok in ("+", "-", "*", "/"):
                b = stack.pop()
                a = stack.pop()
                if tok == "+":
                    stack.append(a + b)
                elif tok == "-":
                    stack.append(a - b)
                elif tok == "*":
                    stack.append(a * b)
                else:
                    q = abs(a) // abs(b)
                    stack.append(q if (a < 0) == (b < 0) else -q)
            else:
                stack.append(abs(int(tok)))
        return stack[0]
equivalent:
  - "return stack[-1]"  # why: a valid expression leaves exactly one item on the stack, so the first and last item are the same
  - "stack.append(q if (a < 1) == (b < 0) else -q)"  # why: the two versions differ only when a is 0, and then q is 0, so the sign makes no difference (-0 is 0)
  - "stack.append(q if (a <= 0) == (b < 0) else -q)"  # why: the two versions differ only when a is 0, and then q is 0, so the sign makes no difference (-0 is 0)
  - "stack.append(q if (a < 0) == (b < 1) else -q)"  # why: division by zero never happens, so b is never 0, and for every other b, b < 1 and b < 0 agree
  - "stack.append(q if (a < 0) == (b <= 0) else -q)"  # why: b is never 0 (no division by zero), so b <= 0 and b < 0 agree on every legal input
---
::
