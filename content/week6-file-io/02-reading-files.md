---
title: Reading files
week: 6
order: 2
minutes: 10
concepts: [files, exceptions]
---

`read` gives you the whole file as one string. More often, you want a file one line at a time. A file object works in a `for` loop, and each turn of the loop gives you the next line:

::trace
---
code: |
  with open("pets.txt", "w") as file:
      file.write("cat\ndog\n")

  with open("pets.txt") as file:
      for line in file:
          print("Pet:", line.rstrip())
---
::

Each line keeps its `"\n"` at the end. Printing it as it is would add a blank line after every pet, because `print` adds a newline of its own. `rstrip()` removes the newline, and any spaces, from the end of the string.

You can also read every line into a list and work with that, such as sorting it:

```python
with open("pets.txt") as file:
    pets = [line.rstrip() for line in file]
print(sorted(pets))
```

A common mistake: using `file.readlines()` and forgetting the newlines. It returns `["cat\n", "dog\n"]`, so `"cat" in pets` is `False`.

Your turn: read a file into a sorted list.

::exercise
---
id: w6-l2-ex1
prompt: Finish load so that it returns a sorted list of the lines in the file at path, without their newlines. For a file holding Bo and then Ada, it returns ["Ada", "Bo"].
starter: |
  def load(path):
      with open(path) as file:
          return sorted(file.readlines())
hints:
  - readlines keeps the newline at the end of every line, so the list holds "Ada\n" instead of "Ada".
  - Build the list with line.rstrip() for each line in the file, then sort it.
tests:
  - check: |
      with open("w6_load.txt", "w") as file:
          file.write("Bo\nAda\nCy\n")
      names = load("w6_load.txt")
      assert names == ["Ada", "Bo", "Cy"], f"load returned {names!r}"
solution: |
  def load(path):
      with open(path) as file:
          return sorted(line.rstrip() for line in file)
---
::

What if the file isn't there? Reading a file that doesn't exist raises `FileNotFoundError`. That's an exception like any other, so the `try` and `except` you learned in week 3 can handle it. A program that saves scores, for example, should start with no scores the first time it runs, not crash.

Now handle a missing file.

::exercise
---
id: w6-l2-ex2
prompt: Change read_scores so that, if the file at path does not exist, it returns an empty list instead of stopping with FileNotFoundError. If the file exists, it still returns its lines without their newlines.
starter: |
  def read_scores(path):
      with open(path) as file:
          return [line.rstrip() for line in file]
hints:
  - Opening a file that is not there raises FileNotFoundError.
  - Put the with block inside try, and return [] in except FileNotFoundError.
tests:
  - check: |
      import os
      if os.path.exists("w6_missing.txt"):
          os.remove("w6_missing.txt")
      scores = read_scores("w6_missing.txt")
      assert scores == [], f"for a missing file, read_scores returned {scores!r}"
  - check: |
      with open("w6_scores.txt", "w") as file:
          file.write("90\n85\n")
      scores = read_scores("w6_scores.txt")
      assert scores == ["90", "85"], f"read_scores returned {scores!r}"
solution: |
  def read_scores(path):
      try:
          with open(path) as file:
              return [line.rstrip() for line in file]
      except FileNotFoundError:
          return []
---
::
