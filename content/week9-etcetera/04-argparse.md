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
