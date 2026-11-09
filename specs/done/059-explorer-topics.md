# 059: Write the 8 explorer topics (shell step, task C6)
Files: content/explorer/*.yml (8 new files)
Severity: med

## Why a shell step
These are fixed data files. Heredocs write them exactly and avoid empty files. Each one is
a topic from the proposal's list, with code that traces in under 30 steps and does not
call `input()`.

Deviation from the proposal: there is no `icon` field. Nothing would show it.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
mkdir -p content/explorer
cat > content/explorer/01-variables.yml <<'YAML'
topic: variables
title: Variables
summary: A variable is a name for a value. Assigning again replaces the value.
week: 0
code: |
  name = "Ada"
  age = 36
  age = age + 1
  greeting = "Hello, " + name
  print(greeting, age)
YAML
cat > content/explorer/02-types.yml <<'YAML'
topic: types
title: Types and conversion
summary: Every value has a type. int() and str() turn a value into another type.
week: 0
code: |
  text = "42"
  number = int(text)
  half = number / 2
  whole = number // 2
  big = number > 40
  label = "Answer: " + str(number)
  print(label, half, whole, big)
YAML
cat > content/explorer/03-functions.yml <<'YAML'
topic: functions
title: Functions and the call stack
summary: Calling a function adds a frame to the call stack. Returning removes it.
week: 0
code: |
  def square(n):
      return n * n


  def sum_of_squares(a, b):
      return square(a) + square(b)


  result = sum_of_squares(3, 4)
  print(result)
YAML
cat > content/explorer/04-conditionals.yml <<'YAML'
topic: conditionals
title: Conditionals
summary: if, elif and else pick one branch. Python skips the others.
week: 1
code: |
  score = 72
  if score >= 90:
      grade = "A"
  elif score >= 70:
      grade = "B"
  else:
      grade = "C"
  print("Grade:", grade)
YAML
cat > content/explorer/05-loops.yml <<'YAML'
topic: loops
title: Loops
summary: for repeats once for each item. while repeats as long as its condition is true.
week: 2
code: |
  total = 0
  for n in range(1, 5):
      total = total + n
  print("Total:", total)

  count = 3
  while count > 0:
      print(count)
      count = count - 1
YAML
cat > content/explorer/06-lists.yml <<'YAML'
topic: lists
title: Lists
summary: A list keeps values in order. Each value has an index, starting at 0.
week: 2
code: |
  fruits = ["apple", "banana"]
  fruits.append("cherry")
  first = fruits[0]
  fruits[1] = "blueberry"
  for fruit in fruits:
      print(fruit)
YAML
cat > content/explorer/07-dictionaries.yml <<'YAML'
topic: dictionaries
title: Dictionaries
summary: A dictionary maps each key to a value. Assigning to a key adds or replaces it.
week: 2
code: |
  ages = {"Ada": 36, "Alan": 41}
  ages["Grace"] = 85
  ages["Ada"] = 37
  for name in ages:
      print(name, ages[name])
YAML
cat > content/explorer/08-exceptions.yml <<'YAML'
topic: exceptions
title: Exceptions
summary: An error raises an exception. try and except catch it; if nothing does, the program stops.
week: 3
code: |
  def to_number(text):
      try:
          return int(text)
      except ValueError:
          print(text, "is not a number")
          return 0


  print(to_number("12"))
  print(to_number("cat"))
  values = [1, 2, 3]
  print(values[3])
YAML
```

## Acceptance gates
- `ls content/explorer | wc -l` prints `8`.
- `grep -l "^code: |$" content/explorer/*.yml | wc -l` prints `8`.
- `wc -c content/explorer/*.yml | tail -1` prints `2307 total`.
- Do not commit yet. Commit 059 and 060 together once 060's gates pass.
