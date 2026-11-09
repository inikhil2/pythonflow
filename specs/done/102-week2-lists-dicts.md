# 102: Week 2 lessons 03 and 04: lists and dictionaries
Files: content/week2-loops/03-lists.md, content/week2-loops/04-dictionaries.md
Severity: med

## Problem
These are the last two week 2 lessons in plan.md. Run this spec after spec 101.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week2-loops/03-lists.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week2-loops/04-dictionaries.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Dictionaries
week: 2
order: 4
minutes: 10
concepts: [dictionaries, lists]
---

A list finds values by their position: 0, 1, 2 and so on. Often it's more useful to find a value by a name. A **dictionary** does that. It stores pairs, each with a **key** and a **value**, inside curly brackets:

```python
rooms = {"lab": 101, "library": 204}
print(rooms["lab"])
```

This prints `101`. The key goes in square brackets, just like an index. You can add a new pair, or change an existing one, the same way: `rooms["office"] = 12`.

A common mistake: looking up a key that isn't there. `rooms["gym"]` stops with `KeyError`. To check first, use `in`, which asks whether a key is in the dictionary: `"gym" in rooms` is `False`.

Step through this trace:

::trace
---
code: |
  rooms = {"lab": 101, "library": 204}
  rooms["office"] = 12
  print("gym" in rooms)
  for place in rooms:
      print(place, rooms[place])
---
::

A `for` loop over a dictionary gives you each key in turn, in the order the pairs were added. With the key, you can look up its value.

Your turn: look up a value safely.

::exercise
---
id: w2-l4-ex1
prompt: Read the name of a place, and print its room number as a line like Room 101. If the place is not in rooms, print unknown place instead.
starter: |
  rooms = {"lab": 101, "library": 204, "office": 12}
  place = input()
  print(f"Room {rooms[place]}")
hints:
  - The starter works for lab, but stops with KeyError for a place that is not in rooms.
  - Check with if place in rooms before you look it up, and use else for the unknown place.
tests:
  - stdin: "lab"
    stdout: "Room 101"
  - stdin: "office"
    stdout: "Room 12"
  - stdin: "gym"
    stdout: "unknown place"
solution: |
  rooms = {"lab": 101, "library": 204, "office": 12}
  place = input()
  if place in rooms:
      print(f"Room {rooms[place]}")
  else:
      print("unknown place")
---
::

Dictionaries are great for counting. The string method `split()` breaks a line of text into a list of words, wherever there are spaces: `"to be or".split()` gives `["to", "be", "or"]`. Walk through those words, and keep a count for each one in a dictionary. The first time you see a word, its count starts at 1. After that, add 1 to it.

Now count some words.

::exercise
---
id: w2-l4-ex2
prompt: Read a line of words. Print each different word once, in the order it first appears, followed by how many times it appears, like to 2.
starter: |
  counts = {}
  for word in input().split():
      counts[word] = 1
  for word in counts:
      print(word, counts[word])
hints:
  - The starter sets every count back to 1, so a word that appears twice still shows 1.
  - If the word is already in counts, add 1 to its count. Otherwise, set it to 1.
tests:
  - stdin: "to be or not to be"
    stdout: |
      to 2
      be 2
      or 1
      not 1
  - stdin: "hi"
    stdout: "hi 1"
solution: |
  counts = {}
  for word in input().split():
      if word in counts:
          counts[word] += 1
      else:
          counts[word] = 1
  for word in counts:
      print(word, counts[word])
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 16 lessons, 31 exercises`.
2. File sizes match:
```sh
   wc -c "content/week2-loops/03-lists.md"   # expect 2818
   wc -c "content/week2-loops/04-dictionaries.md"   # expect 3079
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week2-loops/03-lists.md" | shasum | cut -c1-12   # expect a505707f7db8
   awk '/^::exercise$/,/^::$/' "content/week2-loops/04-dictionaries.md" | shasum | cut -c1-12   # expect 0933adcb1e11
```
4. `git status --short` shows only these new lesson files.
