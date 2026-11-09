---
title: Searching with patterns
week: 7
order: 1
minutes: 10
concepts: [regex, strings]
---

Welcome to week 7! You already know `in`, which tells you whether one exact piece of text is inside another. But what if you're looking for any phone number, or any year, not one exact string? You need to describe the **shape** of the text. That's what a **regular expression** does.

A regular expression, or regex, is a pattern written in a small language of its own. Python's `re` module runs them. `re.search(pattern, text)` looks for the pattern anywhere in the text. It returns a match if it finds one, and `None` if it doesn't, so you can use it straight in an `if`.

Most characters in a pattern match themselves. A few have special meanings:

- `.` matches any one character, except a newline.
- `\d` matches any one digit, 0 to 9.
- `*` matches the thing before it, zero or more times.
- `+` matches the thing before it, one or more times.
- `?` matches the thing before it, zero times or once.
- `{4}` matches the thing before it, exactly 4 times.

So `\d+` means "one or more digits", and `colou?r` matches both `color` and `colour`. Step through this trace:

::trace
---
code: |
  import re

  for text in ["Call 555 1234", "Call me later"]:
      if re.search(r"\d+", text):
          print(text, "has a number")
      else:
          print(text, "has no number")
---
::

The `r` before the pattern makes it a **raw string**, so Python leaves each backslash alone and passes it to `re` as it is. Always write patterns as raw strings.

A common mistake: forgetting that `.` is special. The pattern `3.14` also matches `3514`. To match a real dot, write `\.`.

Your turn: look for a year.

::exercise
---
id: w7-l1-ex1
prompt: Finish has_year so that it returns True if text contains four digits in a row, such as 1969, and False otherwise. Use re.search.
starter: |
  import re

  def has_year(text):
      return re.search(r"\d", text) is not None
hints:
  - The pattern \d matches any one digit, so "Room 12" counts as having a year.
  - Ask for exactly four digits with \d{4}.
tests:
  - check: |
      assert has_year("Apollo 11 landed in 1969") is True
      assert has_year("2026") is True
  - check: |
      assert has_year("Room 12") is False, "Room 12 has only two digits"
      assert has_year("no digits here") is False
solution: |
  import re

  def has_year(text):
      return re.search(r"\d{4}", text) is not None
---
::

Now match a word that can be spelled two ways.

::exercise
---
id: w7-l1-ex2
prompt: Finish mentions_colour so that it returns True if text contains colour or color, and False otherwise. Use one pattern with ?.
starter: |
  import re

  def mentions_colour(text):
      return re.search(r"colour", text) is not None
hints:
  - The starter's pattern only matches the spelling with a u.
  - Put ? after the u, so the u can appear once or not at all.
tests:
  - check: |
      assert mentions_colour("What colour is it?") is True
      assert mentions_colour("Pick a color") is True, "color without a u should count"
  - check: |
      assert mentions_colour("Pick a shade") is False
solution: |
  import re

  def mentions_colour(text):
      return re.search(r"colou?r", text) is not None
---
::
