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
