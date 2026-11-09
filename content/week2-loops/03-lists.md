---
title: Lists
week: 2
order: 3
minutes: 10
concepts: [lists, for-loops]
---

So far each variable has held one value. A **list** holds many values in order, inside square brackets and separated by commas:

```python
temps = [18, 25, 31]
print(temps[0])
print(len(temps))
```

Each value has a position, called its **index**, and counting starts at 0, just like `range`. So `temps[0]` is `18`, and `temps[2]` is `31`. `len(temps)` gives the length of the list, here `3`. You can count from the end too: `temps[-1]` is the last value.

A common mistake: asking for `temps[3]` in a list of three. The last index is one less than the length, so Python stops with `IndexError`.

A `for` loop can walk through a list directly, taking each value in turn. You don't need `range` or an index at all. Step through this trace:

::trace
---
code: |
  temps = [18, 25, 31]
  for t in temps:
      print(t + 1)
  temps.append(22)
  print(len(temps))
---
::

The loop prints `19`, `26` and `32`. Then `temps.append(22)` adds `22` to the end of the list, so its length grows to `4`. A list can start empty, written `[]`, and grow one `append` at a time.

Your turn: collect values into a list.

::exercise
---
id: w2-l3-ex1
prompt: Read words, one per line, until the word done. Then print how many words came before done, as a line like 3 words.
starter: |
  words = []
  word = input()
  while word != "done":
      word = input()
  print(f"{len(words)} words")
hints:
  - The loop reads every word, but the list never changes, so its length stays 0.
  - Inside the loop, before reading the next word, add this one with words.append(word).
tests:
  - stdin: |
      apple
      pear
      plum
      done
    stdout: "3 words"
  - stdin: "done"
    stdout: "0 words"
  - stdin: |
      fig
      kiwi
      done
    stdout: "2 words"
solution: |
  words = []
  word = input()
  while word != "done":
      words.append(word)
      word = input()
  print(f"{len(words)} words")
---
::

Walking through a list with `for` goes well with an `if` and a running total. Together they can count how many values in a list pass some test.

Now count the warm days.

::exercise
---
id: w2-l3-ex2
prompt: The list temps holds a week of temperatures. Read a whole number, and print how many of the temperatures are above it.
starter: |
  temps = [18, 25, 31, 22, 29, 17, 20]
  limit = int(input())
hints:
  - Start a count at 0, then walk through temps with a for loop.
  - Add 1 to the count only when a temperature is greater than limit. Print the count after the loop.
tests:
  - stdin: "24"
    stdout: "3"
  - stdin: "30"
    stdout: "1"
  - stdin: "40"
    stdout: "0"
solution: |
  temps = [18, 25, 31, 22, 29, 17, 20]
  limit = int(input())
  count = 0
  for t in temps:
      if t > limit:
          count += 1
  print(count)
---
::
