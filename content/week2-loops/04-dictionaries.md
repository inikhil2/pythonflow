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
