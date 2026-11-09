---
title: Command-line arguments
week: 4
order: 3
minutes: 10
concepts: [command-line, lists]
---

On your own computer, you run a Python program by typing a command in a terminal, such as `python table.py 7`. The words after the program's name are **command-line arguments**. They let someone give a program its input before it starts, without any `input()`.

The `sys` module puts them in a list called `sys.argv`. For `python table.py 7`, `sys.argv` is `["table.py", "7"]`. The program's own name always comes first, and every argument is text, even `"7"`.

This page has no terminal, so the examples below set `sys.argv` themselves, to pretend the program was run with arguments. Step through this trace:

::trace
---
code: |
  import sys

  sys.argv = ["table.py", "3"]
  n = int(sys.argv[1])
  for i in range(1, 4):
      print(f"{n} x {i} = {n * i}")
---
::

To take every argument after the program's name, use a **slice**: `sys.argv[1:]` is a new list of everything from index 1 to the end.

Your turn: add up the arguments.

::exercise
---
id: w4-l3-ex1
prompt: Finish add so that, given a list like sys.argv, it returns the total of every number after the program's name. For ["add.py", "3", "4"] it returns 7.
starter: |
  def add(argv):
      total = 0
      for arg in argv:
          total += int(arg)
      return total
hints:
  - The starter also tries int("add.py"), which raises ValueError.
  - Loop over argv[1:] instead, to skip the program's name.
tests:
  - check: |
      assert add(["add.py", "3", "4", "5"]) == 12
  - check: |
      assert add(["add.py", "10"]) == 10
      assert add(["add.py"]) == 0
solution: |
  def add(argv):
      total = 0
      for arg in argv[1:]:
          total += int(arg)
      return total
---
::

What if someone forgets the argument? `sys.argv[1]` would stop with `IndexError`, which helps nobody. A good program checks `len(sys.argv)` first and explains how to run it. `sys.exit("message")` stops the program at once and shows that message. In this app, it appears as `SystemExit:` followed by your message.

Now make a program explain itself.

::exercise
---
id: w4-l3-ex2
prompt: 'Finish get_name so that it returns the one name in a list like sys.argv. If there is not exactly one name after the program''s name, it calls sys.exit("Usage: python hi.py NAME").'
starter: |
  import sys

  def get_name(argv):
      return argv[1]
hints:
  - With no name, argv[1] stops with IndexError. With two names, the second is ignored.
  - Check that len(argv) == 2. If it isn't, call sys.exit with the usage message.
tests:
  - check: |
      assert get_name(["hi.py", "Ada"]) == "Ada"
  - check: |
      try:
          get_name(["hi.py"])
          raise AssertionError("get_name with no name should call sys.exit")
      except SystemExit as e:
          assert str(e) == "Usage: python hi.py NAME", f"the message was {str(e)!r}"
  - check: |
      try:
          get_name(["hi.py", "Ada", "Lovelace"])
          raise AssertionError("get_name with two names should call sys.exit")
      except SystemExit as e:
          assert str(e) == "Usage: python hi.py NAME", f"the message was {str(e)!r}"
solution: |
  import sys

  def get_name(argv):
      if len(argv) != 2:
          sys.exit("Usage: python hi.py NAME")
      return argv[1]
---
::
