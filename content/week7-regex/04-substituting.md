---
title: Replacing with patterns
week: 7
order: 4
minutes: 10
concepts: [regex]
---

A string's `replace` method swaps one exact piece of text for another. `re.sub(pattern, replacement, text)` swaps every part that matches a **pattern**, and returns the new string. That makes it the tool for cleaning up messy text. Step through this trace:

::trace
---
code: |
  import re

  phone = "555-123 4567"
  digits = re.sub(r"[^\d]", "", phone)
  print(digits)
---
::

`[^\d]` matches any character that isn't a digit, and replacing it with `""` deletes it, so only the digits are left.

The replacement can use the pattern's groups, too. `\1` in the replacement stands for whatever group 1 matched, `\2` for group 2, and so on. Write the replacement as a raw string as well:

```python
re.sub(r"(\w+)@example\.com", r"\1 at example dot com", "Mail ada@example.com")
```

That returns `Mail ada at example dot com`.

A common mistake: using `replace` to remove repeated spaces. `text.replace("  ", " ")` turns three spaces into two, not one. The pattern ` +`, or `\s+` for any whitespace, matches the whole run at once.

Your turn: tidy up some text.

::exercise
---
id: w7-l4-ex1
prompt: Finish tidy so that every run of spaces, tabs or newlines in text becomes a single space, with none left at the start or the end.
starter: |
  def tidy(text):
      return text.replace("  ", " ").strip()
hints:
  - replace only handles two spaces at a time, and never tabs or newlines.
  - import re, then use re.sub(r"\s+", " ", text) and strip the result.
tests:
  - check: |
      assert tidy("  hello   world ") == "hello world"
  - check: |
      tidied = tidy("one\t two\n\nthree")
      assert tidied == "one two three", f"tidy returned {tidied!r}"
solution: |
  import re

  def tidy(text):
      return re.sub(r"\s+", " ", text).strip()
---
::

Now reorder a date with groups.

::exercise
---
id: w7-l4-ex2
prompt: Finish to_day_first so that every date like 2026-10-31 in text becomes 31/10/2026. The rest of the text stays as it is.
starter: |
  import re

  def to_day_first(text):
      return re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\1/\2/\3", text)
hints:
  - The starter keeps the parts in the same order, so 2026-10-31 becomes 2026/10/31.
  - Group 1 is the year, group 2 the month and group 3 the day. Write the replacement as r"\3/\2/\1".
tests:
  - check: |
      changed = to_day_first("Due 2026-10-31.")
      assert changed == "Due 31/10/2026.", f"to_day_first returned {changed!r}"
  - check: |
      changed = to_day_first("From 2026-01-05 to 2026-02-09")
      assert changed == "From 05/01/2026 to 09/02/2026", f"to_day_first returned {changed!r}"
      assert to_day_first("no dates") == "no dates"
solution: |
  import re

  def to_day_first(text):
      return re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\3/\2/\1", text)
---
::
