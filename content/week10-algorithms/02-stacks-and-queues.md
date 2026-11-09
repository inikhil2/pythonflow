---
title: Stacks and queues
week: 10
order: 2
minutes: 13
concepts: [lists, while-loops, for-loops]
---

A **stack** is a pile of plates. You add to the top and take from the top, so the last thing in is the first thing out. Python lists already work this way. `append` puts a value on top, and `pop()` takes the top value off:

```python
stack = []
stack.append("(")
stack.append("[")
print(stack[-1])
print(stack.pop())
print(stack)
```

`stack[-1]` looks at the top without removing it. `pop()` removes and returns it. A stack is the right tool when you need to match something with the most recent open thing, such as brackets.

A **queue** is a line at a shop. The first person in is the first served. A list can do this with `pop(0)`, but removing from the front shifts every other value along, which gets slow for long lists. Use `collections.deque` (a double-ended queue) instead. Its `append` adds to the back and its `popleft` takes from the front, both quickly:

```python
from collections import deque

line = deque(["ann", "bob"])
line.append("cy")
print(line.popleft())
print(list(line))
```

A **monotonic stack** keeps its values in order, from the bottom to the top. Here is a common use: for each day's temperature, find the next warmer day. The stack holds the days that still have no warmer day after them:

```python
temps = [2, 1, 3]
stack = []
for i, t in enumerate(temps):
    while stack and temps[stack[-1]] < t:
        j = stack.pop()
        print(f"next warmer than {temps[j]} is {t}")
    stack.append(i)
```

Each new day pops every earlier day it is warmer than, since it is the answer for them. Then it pushes itself. Every day is pushed once and popped at most once, so the loop runs in about `len(temps)` steps. Step through it:

::trace
---
code: |
  temps = [2, 1, 3]
  stack = []
  for i, t in enumerate(temps):
      while stack and temps[stack[-1]] < t:
          j = stack.pop()
          print(f"next warmer than {temps[j]} is {t}")
      stack.append(i)
---
::

A common mistake is to use a list with `pop(0)` as a queue. It gives the right answer, so the mistake only shows up on long inputs. Use `deque` for queues.

Your turn: check the brackets with a stack.

::exercise
---
id: w10-l2-ex1
prompt: Read one line of text. Print BALANCED if every (, [ and { is closed by the matching ), ] or } in the right order, ignoring other characters. Otherwise print NOT BALANCED.
starter: |
  line = input()
  print("BALANCED")
hints:
  - Push each opening bracket onto a stack, a plain list.
  - When you see a closing bracket, the stack must not be empty, and its top must be the matching opening bracket. Pop it off.
  - At the end the stack must be empty. Use a dictionary to map each closing bracket to its opening one.
tests:
  - stdin: "([]{})"
    stdout: "BALANCED"
  - stdin: "([)]"
    stdout: "NOT BALANCED"
  - stdin: "(("
    stdout: "NOT BALANCED"
  - stdin: ")"
    stdout: "NOT BALANCED"
  - stdin: "a(b)c"
    stdout: "BALANCED"
solution: |
  pairs = {")": "(", "]": "[", "}": "{"}
  line = input()
  stack = []
  ok = True
  for ch in line:
      if ch in "([{":
          stack.append(ch)
      elif ch in pairs:
          if not stack or stack.pop() != pairs[ch]:
              ok = False
  if ok and not stack:
      print("BALANCED")
  else:
      print("NOT BALANCED")
---
::

Now a queue. Use `deque` so that taking from the front stays fast.

::exercise
---
id: w10-l2-ex2
prompt: Read a line of names separated by spaces, then a whole number k. Move the name at the front of the line to the back, k times. Then print the names on one line, separated by spaces.
starter: |
  names = input().split()
  k = int(input())
  print(" ".join(names))
hints:
  - Put the names in a deque, from collections import deque.
  - Each time, take the front name with popleft() and add it to the back with append().
  - Repeat k times with a for loop. Print with " ".join(...) after the loop.
tests:
  - stdin: |
      ann bob cy
      1
    stdout: "bob cy ann"
  - stdin: |
      ann bob cy
      2
    stdout: "cy ann bob"
  - stdin: |
      ann bob cy
      3
    stdout: "ann bob cy"
  - stdin: |
      solo
      5
    stdout: "solo"
solution: |
  from collections import deque

  names = deque(input().split())
  k = int(input())
  for _ in range(k):
      names.append(names.popleft())
  print(" ".join(names))
---
::
