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
