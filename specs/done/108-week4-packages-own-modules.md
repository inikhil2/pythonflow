# 108: Week 4 lessons 04 and 05: packages and APIs, your own modules
Files: content/week4-libraries/04-packages-and-apis.md, content/week4-libraries/05-your-own-modules.md
Severity: med

## Problem
These are the last two week 4 lessons. Run this spec after 106 and 107. Lesson 05 teaches
the `if __name__ == "__main__":` ending, and its solution prints nothing until spec 106 is
in place. With 106 missing, gate 1 fails with `w4-l5-ex1: the solution fails test 1`.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week4-libraries/04-packages-and-apis.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Packages and APIs
week: 4
order: 4
minutes: 10
concepts: [modules, dictionaries]
---

The modules so far come with Python. Thousands more are written by other people and shared as **packages**. On your own computer, you install one with `pip`, Python's package installer, by typing this in a terminal:

```sh
pip install requests
```

After that, `import requests` works like any other import. This page runs Python inside your browser, so it can't install packages with `pip`. The examples here use modules that come with Python instead.

`requests` is popular because it talks to **APIs**: websites that answer with data for programs to use, instead of pages for people to read. On your own computer, asking a weather API for a forecast might look like this:

```python
import requests

response = requests.get("https://weather.example.com/forecast?city=Oslo")
data = response.json()
```

Most APIs answer in **JSON**, a text format that looks a lot like Python's dictionaries and lists. `response.json()` turns it into exactly those. The `json` module does the same for any JSON text, using `json.loads`:

::trace
---
code: |
  import json

  text = '{"city": "Oslo", "temp": 7}'
  data = json.loads(text)
  print(data["city"], data["temp"])
---
::

`text` is just a string, so `text["temp"]` would stop with `TypeError`. After `json.loads`, `data` is a real dictionary.

Your turn: read some JSON.

::exercise
---
id: w4-l4-ex1
prompt: The string reply holds JSON from a weather API. Print the city's name, then its temperature, as a line like Oslo 7.
starter: |
  reply = '{"city": "Oslo", "temp": 7, "wind": 12}'
  print(reply["city"], reply["temp"])
hints:
  - reply is still text, so it stops with TypeError when you look up a key.
  - Import json, turn reply into a dictionary with json.loads, then look up the keys in that.
tests:
  - stdout: "Oslo 7"
solution: |
  import json

  reply = '{"city": "Oslo", "temp": 7, "wind": 12}'
  data = json.loads(reply)
  print(data["city"], data["temp"])
---
::

Real API answers are usually dictionaries with lists inside, and dictionaries inside those. You walk in one step at a time: `data["days"]` is a list, `data["days"][0]` is the first dictionary in it, and `data["days"][0]["high"]` is a number.

Now dig into a bigger answer. Here it has already been turned into a dictionary, as `response.json()` would give you.

::exercise
---
id: w4-l4-ex2
prompt: Read a day such as Tue, and print its high temperature from forecast. If the day is not in the forecast, print no forecast.
starter: |
  forecast = {
      "city": "Oslo",
      "days": [
          {"day": "Mon", "high": 12},
          {"day": "Tue", "high": 9},
          {"day": "Wed", "high": 14},
      ],
  }
  day = input()
  print(forecast["days"])
hints:
  - Loop through forecast["days"]. Each item is a dictionary with a day and a high.
  - Print the high when the item's day matches. To know whether any matched, start found = False before the loop.
tests:
  - stdin: "Tue"
    stdout: "9"
  - stdin: "Wed"
    stdout: "14"
  - stdin: "Sun"
    stdout: "no forecast"
solution: |
  forecast = {
      "city": "Oslo",
      "days": [
          {"day": "Mon", "high": 12},
          {"day": "Tue", "high": 9},
          {"day": "Wed", "high": 14},
      ],
  }
  day = input()
  found = False
  for item in forecast["days"]:
      if item["day"] == day:
          print(item["high"])
          found = True
  if not found:
      print("no forecast")
---
::
````
2. **Create `content/week4-libraries/05-your-own-modules.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Your own modules
week: 4
order: 5
minutes: 8
concepts: [modules, functions]
---

Any Python file can be a module. Say you write some handy functions in a file called `units.py`:

```python
def km_to_miles(km):
    return km * 0.621371
```

Another file in the same folder can then use them, just like `math`:

```python
import units

print(units.km_to_miles(10))
```

That's how bigger programs stay tidy: each file holds one kind of job, and the others import it.

There's one catch. When Python imports a file, it runs every line in it. If `units.py` also asked for input and printed results, importing it would do all that too. The fix is a special check at the bottom of the file:

```python
if __name__ == "__main__":
    main()
```

Python sets the variable `__name__` to `"__main__"` only in the file you ran directly. In a file that was imported, `__name__` is the module's name instead, such as `"units"`. So `main()` runs when you run `units.py` itself, and stays quiet when another file imports it.

Step through this trace. This page always runs your code as the main file, so `main()` is called:

::trace
---
code: |
  def km_to_miles(km):
      return km * 0.621371

  def main():
      print(round(km_to_miles(5), 1))

  if __name__ == "__main__":
      main()
---
::

The usual layout is: imports first, then functions, then `main`, then that check at the very end.

Your turn: finish a module that also works as a program.

::exercise
---
id: w4-l5-ex1
prompt: Finish main so that it reads a distance in kilometres, as a whole number, and prints it in miles rounded to 1 decimal place. Keep km_to_miles and the check at the bottom as they are.
starter: |
  def km_to_miles(km):
      return km * 0.621371

  def main():
      pass

  if __name__ == "__main__":
      main()
hints:
  - Inside main, read the number with int(input()).
  - Print round(km_to_miles(km), 1), then remove pass.
tests:
  - stdin: "10"
    stdout: "6.2"
  - stdin: "42"
    stdout: "26.1"
  - stdin: "10"
    check: |
      assert round(km_to_miles(100), 1) == 62.1
solution: |
  def km_to_miles(km):
      return km * 0.621371

  def main():
      km = int(input())
      print(round(km_to_miles(km), 1))

  if __name__ == "__main__":
      main()
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 24 lessons, 46 exercises`.
2. File sizes match:
```sh
   wc -c "content/week4-libraries/04-packages-and-apis.md"   # expect 3487
   wc -c "content/week4-libraries/05-your-own-modules.md"   # expect 2259
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week4-libraries/04-packages-and-apis.md" | shasum | cut -c1-12   # expect bec6e943c2f0
   awk '/^::exercise$/,/^::$/' "content/week4-libraries/05-your-own-modules.md" | shasum | cut -c1-12   # expect e687f77cbfc4
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
