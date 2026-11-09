# 118: Week 7 lessons 01 and 02: searching with patterns, validating formats
Files: content/week7-regex/01-searching.md, content/week7-regex/02-validating.md
Severity: med

## Problem
Week 6 is committed. plan.md lists week 7 as `re.search`, `match`, `fullmatch`, groups, `sub`
and validating formats, and no week 7 lessons exist yet. This spec adds the first two, in a new
folder `content/week7-regex/`. The `re` module is part of the standard library, so no runner
change is needed. Pattern lists are bullet lists, not tables, because the app has no table
styles.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week7-regex/01-searching.md`** with exactly this content, and nothing before or after it.
````markdown
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
````
2. **Create `content/week7-regex/02-validating.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Validating formats
week: 7
order: 2
minutes: 10
concepts: [regex]
---

`re.search` is happy if the pattern turns up anywhere. That's wrong for checking a format. If you ask for a code like `ABC-123`, the text `xxABC-123456` contains one, but it isn't one.

To check the **whole** text, use `re.fullmatch`. It only matches if the pattern covers the text from the first character to the last. You'll also see `^` and `$` in patterns. They mean the start and the end of the text, so `re.search(r"^\d+$", text)` does the same job. And `re.match` checks only the start.

Patterns can also offer choices:

- `[aeiou]` matches any one of the characters inside.
- `[A-Z]` matches any one capital letter, from A to Z.
- `[^0-9]` matches any one character that is not a digit.
- `\w` matches a letter, a digit or `_`.
- `\s` matches a space, tab or newline.
- `cat|dog` matches `cat` or `dog`.

Brackets group part of a pattern, so `(com|org)` means `com` or `org`. Step through this trace:

::trace
---
code: |
  import re

  for code in ["ABC-123", "abc-123", "ABC-1234"]:
      if re.fullmatch(r"[A-Z]{3}-\d{3}", code):
          print(code, "is valid")
      else:
          print(code, "is not valid")
---
::

To ignore upper and lower case, pass `re.IGNORECASE` as a third argument, as in `re.fullmatch(r"yes", answer, re.IGNORECASE)`.

A common mistake: validating with `re.search` and no `^` or `$`. The check passes for any text that merely contains a valid part.

Your turn: check a code properly.

::exercise
---
id: w7-l2-ex1
prompt: Finish is_code so that it returns True only if the whole of text is three capital letters, a dash and three digits, such as ABC-123.
starter: |
  import re

  def is_code(text):
      return re.search(r"[A-Z]{3}-\d{3}", text) is not None
hints:
  - re.search finds ABC-123 inside xABC-1234, so the starter accepts it.
  - Use re.fullmatch instead, so the pattern must cover the whole text.
tests:
  - check: |
      assert is_code("ABC-123") is True
      assert is_code("XYZ-999") is True
  - check: |
      assert is_code("xABC-123") is False, "xABC-123 has an extra letter at the start"
      assert is_code("ABC-1234") is False, "ABC-1234 has four digits"
      assert is_code("abc-123") is False
solution: |
  import re

  def is_code(text):
      return re.fullmatch(r"[A-Z]{3}-\d{3}", text) is not None
---
::

Now check a time on a 24-hour clock, where `\d\d` alone would allow `99`.

::exercise
---
id: w7-l2-ex2
prompt: Finish is_time so that it returns True only for a 24-hour time from 00:00 to 23:59, written with two digits, a colon and two digits.
starter: |
  import re

  def is_time(text):
      return re.fullmatch(r"\d\d:\d\d", text) is not None
hints:
  - The starter accepts 25:00 and 12:75, because \d allows any digit.
  - The hour is [01]\d or 2[0-3], so write ([01]\d|2[0-3]). The minutes are [0-5]\d.
tests:
  - check: |
      assert is_time("00:00") is True
      assert is_time("09:30") is True
      assert is_time("23:59") is True
  - check: |
      assert is_time("24:00") is False, "24:00 is not a time on a 24-hour clock"
      assert is_time("12:60") is False, "minutes only go up to 59"
      assert is_time("9:30") is False, "the hour needs two digits"
solution: |
  import re

  def is_time(text):
      return re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", text) is not None
---
::
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 34 lessons, 62 exercises`.
2. File sizes match:
```sh
   wc -c "content/week7-regex/01-searching.md"   # expect 3241
   wc -c "content/week7-regex/02-validating.md"   # expect 3362
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week7-regex/01-searching.md" | shasum | cut -c1-12   # expect 4d0869e325a9
   awk '/^::exercise$/,/^::$/' "content/week7-regex/02-validating.md" | shasum | cut -c1-12   # expect f564498834a3
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
