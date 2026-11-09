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
