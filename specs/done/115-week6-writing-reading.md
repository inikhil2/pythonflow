# 115: Week 6 lessons 01 and 02: writing files, reading files
Files: content/week6-file-io/01-writing-files.md, content/week6-file-io/02-reading-files.md
Severity: med

## Problem
Week 5 is committed. plan.md lists week 6 as `open`, `with`, reading and writing, CSV and
binary basics, and no week 6 lessons exist yet. This spec adds the first two, in a new folder
`content/week6-file-io/`. Pyodide gives each page session a file system in memory, so `open`
works with no runner change. Each check case writes the files it needs itself and uses its own
`w6_` file name, so leftover files from earlier runs cannot make a starter pass.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week6-file-io/01-writing-files.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Writing files
week: 6
order: 1
minutes: 10
concepts: [files]
---

Welcome to week 6! Every program so far has forgotten everything the moment it stopped. To keep something, such as a list of names or a high score, a program has to save it in a **file**.

`open` opens a file and gives you back a file object. Its second argument is the **mode**. `"w"` means write: Python creates the file, or empties it if it already exists. Then `write` adds text, and `close` saves the file and lets it go:

```python
file = open("names.txt", "w")
file.write("Ada\n")
file.close()
```

`write` doesn't add a newline the way `print` does. If you want each name on its own line, write the `"\n"` yourself.

Forgetting `close` can lose what you wrote. So Python programmers open files with `with` instead. The file stays open inside the indented block, and Python closes it for you when the block ends, even if an error happens. Step through this trace:

::trace
---
code: |
  names = ["Ada", "Bo"]
  with open("names.txt", "w") as file:
      for name in names:
          file.write(f"{name}\n")

  with open("names.txt") as file:
      print(file.read())
---
::

The second `open` has no mode, so it uses `"r"`, for read. `read` gives back the whole file as one string.

This page keeps the files your code writes until you reload it, so you can write a file in one run and read it in the next.

A common mistake: opening with `"w"` to add one more line. `"w"` empties the file first, so everything already in it is lost.

Your turn: save a list to a file.

::exercise
---
id: w6-l1-ex1
prompt: Finish save so that it writes each name in names to the file at path, one name per line. If the file already exists, its old contents are replaced.
starter: |
  def save(names, path):
      with open(path, "w") as file:
          for name in names:
              file.write(name)
hints:
  - write does not add a newline, so the starter writes AdaBo on one line.
  - Write f"{name}\n" instead of name.
tests:
  - check: |
      save(["Ada", "Bo"], "w6_save.txt")
      with open("w6_save.txt") as file:
          text = file.read()
      assert text == "Ada\nBo\n", f"the file holds {text!r}"
  - check: |
      save(["Ada", "Bo"], "w6_save.txt")
      save(["Cy"], "w6_save.txt")
      with open("w6_save.txt") as file:
          text = file.read()
      assert text == "Cy\n", f"after saving twice, the file holds {text!r}"
solution: |
  def save(names, path):
      with open(path, "w") as file:
          for name in names:
              file.write(f"{name}\n")
---
::

To add to the end of a file and keep what's there, open it with `"a"`, for append. Python creates the file if it doesn't exist yet.

Now keep a log that grows.

::exercise
---
id: w6-l1-ex2
prompt: Finish log so that it adds message to the end of the file at path, as a new line. Lines already in the file must stay.
starter: |
  def log(message, path):
      with open(path, "w") as file:
          file.write(f"{message}\n")
hints:
  - Mode "w" empties the file each time, so only the last message is kept.
  - Open the file with "a" instead of "w".
tests:
  - check: |
      with open("w6_log.txt", "w") as file:
          file.write("started\n")
      log("saved", "w6_log.txt")
      log("stopped", "w6_log.txt")
      with open("w6_log.txt") as file:
          text = file.read()
      assert text == "started\nsaved\nstopped\n", f"the file holds {text!r}"
solution: |
  def log(message, path):
      with open(path, "a") as file:
          file.write(f"{message}\n")
---
::
````
2. **Create `content/week6-file-io/02-reading-files.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 30 lessons, 55 exercises`.
2. File sizes match:
```sh
   wc -c "content/week6-file-io/01-writing-files.md"   # expect 3545
   wc -c "content/week6-file-io/02-reading-files.md"   # expect 3364
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week6-file-io/01-writing-files.md" | shasum | cut -c1-12   # expect bd59ac946d02
   awk '/^::exercise$/,/^::$/' "content/week6-file-io/02-reading-files.md" | shasum | cut -c1-12   # expect 0e77f1133c79
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
