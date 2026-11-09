# 129: Week 9 lessons 04 and 05: argparse, unpacking with *args and **kwargs
Files: content/week9-etcetera/04-argparse.md, content/week9-etcetera/05-unpacking.md
Severity: med

## Problem
Spec 128 adds week 9 lessons 01 to 03. This spec adds lessons 04 and 05, in the same folder
`content/week9-etcetera/`. They cover command-line options with `argparse`, and unpacking with
`*` and `**`. Do spec 128 first.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week9-etcetera/04-argparse.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Command-line options with argparse
week: 9
order: 4
minutes: 10
concepts: [command-line, modules]
---

In week 4 you read `sys.argv` yourself. That gets fiddly once a program has options, such as `python meow.py -n 3`. The `argparse` module does the work for you. You describe each option, and it reads them, converts them and even writes a `--help` message.

Make a parser, add an argument for each option, then call `parse_args`. In a real program, `parse_args()` reads `sys.argv` by itself. This page has no terminal, so the examples pass it a list instead, to pretend the program was run with those options. Step through this trace:

::trace
---
code: |
  import argparse

  parser = argparse.ArgumentParser(prog="meow.py")
  parser.add_argument("-n", type=int, default=1, help="how many times to meow")
  args = parser.parse_args(["-n", "3"])
  for _ in range(args.n):
      print("meow")
---
::

Each option becomes an attribute of `args`, named after it, so `-n` becomes `args.n`. `type=int` converts the text `"3"` to the number `3`. `default=1` is the value when the option isn't given at all.

An option that is only on or off, like `--loud`, uses `action="store_true"`. Then `args.loud` is `True` if the option was given, and `False` if it wasn't. A dash inside a name becomes an underscore, so `--dry-run` becomes `args.dry_run`.

A common mistake: leaving out `type=int`. Every command-line argument is text, so `args.n` is then `"3"`, and `range(args.n)` stops with `TypeError`.

Your turn: read a number option.

::exercise
---
id: w9-l4-ex1
prompt: Fix parse so that args.n is a number. parse(["-n", "3"]).n is 3, and parse([]).n is 1.
starter: |
  import argparse

  def parse(argv):
      parser = argparse.ArgumentParser(prog="meow.py")
      parser.add_argument("-n", default=1)
      return parser.parse_args(argv)
hints:
  - Without a type, argparse keeps -n as text, so it gives "3", not 3.
  - Add type=int to the add_argument call.
tests:
  - check: |
      n = parse(["-n", "3"]).n
      assert n == 3, f"args.n is {n!r}"
  - check: |
      assert parse([]).n == 1
solution: |
  import argparse

  def parse(argv):
      parser = argparse.ArgumentParser(prog="meow.py")
      parser.add_argument("-n", type=int, default=1)
      return parser.parse_args(argv)
---
::

Now add an on or off option.

::exercise
---
id: w9-l4-ex2
prompt: Add a --loud option to parse, so that parse(["--loud"]).loud is True and parse([]).loud is False.
starter: |
  import argparse

  def parse(argv):
      parser = argparse.ArgumentParser(prog="meow.py")
      parser.add_argument("-n", type=int, default=1)
      return parser.parse_args(argv)
hints:
  - The parser has no --loud option yet, so parse(["--loud"]) stops with an error.
  - Add parser.add_argument("--loud", action="store_true") before the return.
tests:
  - check: |
      try:
          args = parse(["--loud"])
      except SystemExit:
          raise AssertionError("parse stopped with an error, because it has no --loud option")
      assert args.loud is True
      assert parse([]).loud is False
  - check: |
      try:
          args = parse(["-n", "2", "--loud"])
      except SystemExit:
          raise AssertionError("parse stopped with an error, because it has no --loud option")
      assert args.n == 2 and args.loud is True
solution: |
  import argparse

  def parse(argv):
      parser = argparse.ArgumentParser(prog="meow.py")
      parser.add_argument("-n", type=int, default=1)
      parser.add_argument("--loud", action="store_true")
      return parser.parse_args(argv)
---
::
````

2. **Create `content/week9-etcetera/05-unpacking.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Unpacking, *args and **kwargs
week: 9
order: 5
minutes: 10
concepts: [functions, lists]
---

**Unpacking** takes the items out of a collection in one go. `first, last = "Ada Lovelace".split(" ")` puts each part of the list into its own variable. There must be exactly as many names as items.

A `*` unpacks a list into separate arguments when you call a function. `print(*["a", "b"])` is the same as `print("a", "b")`. A `**` unpacks a dict into keyword arguments, so `f(**{"size": "L"})` is the same as `f(size="L")`.

The same signs work the other way round in a `def`. A parameter written `*numbers` collects every extra positional argument into a tuple. One written `**details` collects every extra keyword argument into a dict. By custom they're often called `*args` and `**kwargs`. Step through this trace:

::trace
---
code: |
  def total(*numbers):
      result = 0
      for number in numbers:
          result += number
      return result

  coins = [1, 5, 10]
  print(total(2, 3))
  print(total(*coins))
---
::

`total` now takes any number of arguments, as `print` does. Inside it, `numbers` is a tuple of all of them.

A common mistake: calling `total(coins)` without the `*`. That passes one argument, the whole list, so `numbers` is `([1, 5, 10],)`, and `result += number` stops with `TypeError`.

Your turn: take any number of arguments.

::exercise
---
id: w9-l5-ex1
prompt: Change largest so that it takes any number of separate arguments. largest(3, 9, 4) returns 9, and largest(7) returns 7.
starter: |
  def largest(numbers):
      return max(numbers)
hints:
  - With one parameter, largest(3, 9, 4) gets three arguments but takes one, so it stops with TypeError.
  - Put a * in front of the parameter, so it collects all the arguments into a tuple.
tests:
  - check: |
      result = largest(3, 9, 4)
      assert result == 9, f"largest returned {result}"
  - check: |
      assert largest(7) == 7
solution: |
  def largest(*numbers):
      return max(numbers)
---
::

Now unpack a dict into keyword arguments.

::exercise
---
id: w9-l5-ex2
prompt: Fix from_dict so that it passes the dict's items to label as keyword arguments. from_dict({"name" with "Tea" and "size" with "large"}) returns "Tea (large)".
starter: |
  def label(name, size):
      return f"{name} ({size})"

  def from_dict(info):
      return label(info)
hints:
  - label(info) passes the whole dict as name, and nothing as size, so it stops with TypeError.
  - Write label(**info), so each key becomes a keyword argument.
tests:
  - check: |
      result = from_dict({"name": "Tea", "size": "large"})
      assert result == "Tea (large)", f"from_dict returned {result!r}"
  - check: |
      assert from_dict({"size": "S", "name": "Jam"}) == "Jam (S)"
solution: |
  def label(name, size):
      return f"{name} ({size})"

  def from_dict(info):
      return label(**info)
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 47 lessons, 87 exercises`.
2. File sizes match:
```sh
   wc -c "content/week9-etcetera/04-argparse.md"   # expect 3582
   wc -c "content/week9-etcetera/05-unpacking.md"   # expect 2882
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/04-argparse.md" | shasum | cut -c1-12   # expect 46b8d69a3f63
   awk '/^::exercise$/,/^::$/' "content/week9-etcetera/05-unpacking.md" | shasum | cut -c1-12   # expect 3078f3e3fc37
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
