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
