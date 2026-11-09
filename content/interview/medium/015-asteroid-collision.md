---
title: Asteroid Collision
tier: medium
order: 15
leetcode: 735
url: https://leetcode.com/problems/asteroid-collision/
companies: [Amazon, Meta, Google]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a list `asteroids` of n nonzero whole numbers, where 1 <= n <= 10000 and each value is from -1000 to 1000. Each number is an asteroid. A positive number moves right and a negative number moves left, and all asteroids move at the same speed. Two asteroids collide only when one moving right is directly followed by one moving left. The smaller one (by size, which is the absolute value) explodes. If both are the same size, both explode. Asteroids moving in the same direction never collide.

Return the asteroids that are still alive after every collision, in their original order. A left-moving asteroid that is hit by nothing stays alive, and so does a right-moving one. For example, [5, 10, -5] leaves [5, 10], and [8, -8] leaves [].

::exercise
---
id: iv-medium-015
prompt: Write a function asteroid_collision(asteroids) that returns the asteroids still alive after all collisions, in their original order.
starter: |
  # write your code below
  def asteroid_collision(asteroids):
      pass
hints:
  - Keep a stack of the asteroids that are still alive. A new left-moving asteroid can only collide with the top of the stack.
  - A new asteroid can destroy several asteroids in a row, so keep checking the top of the stack until the new one is gone or nothing is left to hit.
tests:
  - check: assert asteroid_collision([5, 10, -5]) == [5, 10]
  - check: assert asteroid_collision([8, -8]) == []
  - check: assert asteroid_collision([10, 2, -5]) == [10]
  - check: assert asteroid_collision([-2, -1, 1, 2]) == [-2, -1, 1, 2]
  - check: assert asteroid_collision([1, -2, -2, -2]) == [-2, -2, -2]
  - check: assert asteroid_collision([1, -1, -2]) == [-2]
  - check: assert asteroid_collision([3, 5, -6, -1, 4, -4]) == [-6, -1]
  - check: assert asteroid_collision([-5]) == [-5]
no_slow: "The list is at most 10000 asteroids, and each one is checked against the same list again and again; a slower method gives the same answers, so no slower method is a wrong answer."
solution: |
  def asteroid_collision(asteroids):
      stack = []
      for a in asteroids:
          alive = True
          while alive and a < 0 and stack and stack[-1] > 0:
              top = stack[-1]
              if top < -a:
                  stack.pop()
              elif top == -a:
                  stack.pop()
                  alive = False
              else:
                  alive = False
          if alive:
              stack.append(a)
      return stack
brute: |
  def asteroid_collision(asteroids):
      row = list(asteroids)
      i = 0
      while i < len(row) - 1:
          a, b = row[i], row[i + 1]
          if a > 0 and b < 0:
              if a == -b:
                  del row[i:i + 2]
              elif a > -b:
                  del row[i + 1]
              else:
                  del row[i]
              i = max(i - 1, 0)
          else:
              i += 1
      return row
random:
  call: asteroid_collision
  gen: |
    def gen(rng, size):
        return ([rng.choice([-1, 1]) * rng.randint(1, 4) for _ in range(rng.randint(2, 8))],)
wrong:
  - |
    def asteroid_collision(asteroids):
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                top = stack[-1]
                if top < -a:
                    stack.pop()
                elif top == -a:
                    alive = False
                else:
                    alive = False
            if alive:
                stack.append(a)
        return stack
  - |
    def asteroid_collision(asteroids):
        stack = []
        for a in asteroids:
            if a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()
                elif stack[-1] == -a:
                    stack.pop()
                    continue
                else:
                    continue
            stack.append(a)
        return stack
  - |
    def asteroid_collision(asteroids):
        stack = []
        for a in asteroids:
            while a < 0 and stack and stack[-1] > 0 and stack[-1] < -a:
                stack.pop()
            stack.append(a)
        return stack
equivalent:
  - "5: while alive and a < 0 and stack and (stack[-1] >= 0):"  # why: asteroids are never 0, so stack[-1] >= 0 and stack[-1] > 0 agree on every value in the stack
  - "while alive and a < 0 and stack and (stack[-1] > -1):"  # why: asteroids are never 0, so stack[-1] > -1 and stack[-1] > 0 agree on every value in the stack
  - "while alive and a < 1 and stack and (stack[-1] > 0):"  # why: asteroids are never 0, so a < 1 and a < 0 agree on every value
  - "while alive and a <= 0 and stack and (stack[-1] > 0):"  # why: asteroids are never 0, so a <= 0 and a < 0 agree on every value
---
::
