# 119: Week 7 lessons 03 and 04: capturing groups, replacing with patterns
Files: content/week7-regex/03-groups.md, content/week7-regex/04-substituting.md
Severity: med

## Problem
These are the last two week 7 lessons. Run this spec after 118. Lesson 03 covers
`match.group` and non-capturing `(?:...)` groups, and lesson 04 covers `re.sub`, including
`\1` group references in the replacement.

The principal engineer has written and checked the full text. Every solution passes its
tests, every starter fails at least one, every trace runs, and generate builds the routes.
Copy each file exactly. Do not reword, reorder or add anything.

## Required change
1. **Create `content/week7-regex/03-groups.md`** with exactly this content, and nothing before or after it.
````markdown
---
title: Capturing groups
week: 7
order: 3
minutes: 10
concepts: [regex]
---

A regex can do more than say yes or no. Brackets in a pattern also **capture** the text they match, so you can pull it out afterwards.

When `re.search` or `re.fullmatch` succeeds, it returns a match object. `match.group(1)` is the text matched by the first pair of brackets, `match.group(2)` by the second, and so on. Groups are numbered by their opening bracket, from left to right. Step through this trace:

::trace
---
code: |
  import re

  match = re.fullmatch(r"(\d+)-(\d+)", "10-25")
  if match:
      low = int(match.group(1))
      high = int(match.group(2))
      print("From", low, "to", high)
---
::

Always check that the match isn't `None` before you call `group`. Calling `group` on `None` stops with `AttributeError`.

Sometimes you need brackets for a choice, but you don't want to capture it. Write `(?:` instead of `(`. For example, `(?:www\.)?` makes `www.` optional without adding a group, so the numbers of the other groups don't change.

A common mistake: counting groups wrong after adding brackets. Adding `(www\.)?` at the start of a pattern makes it group 1, so the group you wanted moves to number 2.

Your turn: turn a name around.

::exercise
---
id: w7-l3-ex1
prompt: Finish fix_name. If name is written as last name, comma, first name, such as Lovelace, Ada, it returns Ada Lovelace. The space after the comma may be missing. Any other name comes back unchanged.
starter: |
  import re

  def fix_name(name):
      match = re.fullmatch(r"(.+), (.+)", name)
      if match:
          return f"{match.group(2)} {match.group(1)}"
      return name
hints:
  - The pattern needs a space after the comma, so Lovelace,Ada does not match.
  - Write ", *" instead of ", ", so the comma can be followed by any number of spaces, even none.
tests:
  - check: |
      assert fix_name("Lovelace, Ada") == "Ada Lovelace"
      assert fix_name("Ada Lovelace") == "Ada Lovelace"
  - check: |
      fixed = fix_name("Hopper,Grace")
      assert fixed == "Grace Hopper", f"fix_name returned {fixed!r}"
solution: |
  import re

  def fix_name(name):
      match = re.fullmatch(r"(.+), *(.+)", name)
      if match:
          return f"{match.group(2)} {match.group(1)}"
      return name
---
::

Now pull a user name out of a web address.

::exercise
---
id: w7-l3-ex2
prompt: Finish user_name so that it returns the name at the end of an address like https://example.com/users/ada. The address may start with http or https, and may have www. before example.com. If the address does not fit, it returns None.
starter: |
  import re

  def user_name(url):
      match = re.fullmatch(r"https://example\.com/users/(\w+)", url)
      if match:
          return match.group(1)
      return None
hints:
  - The starter only accepts https with no www., so it returns None for http://www.example.com/users/bo.
  - Write https? for the scheme and (?:www\.)? before example. The name stays group 1.
tests:
  - check: |
      assert user_name("https://example.com/users/ada") == "ada"
      assert user_name("https://example.com/about") is None
  - check: |
      name = user_name("http://www.example.com/users/bo")
      assert name == "bo", f"user_name returned {name!r}"
      name = user_name("https://www.example.com/users/cy")
      assert name == "cy", f"user_name returned {name!r}"
solution: |
  import re

  def user_name(url):
      match = re.fullmatch(r"https?://(?:www\.)?example\.com/users/(\w+)", url)
      if match:
          return match.group(1)
      return None
---
::
````
2. **Create `content/week7-regex/04-substituting.md`** with exactly this content, and nothing before or after it.
````markdown
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
````

## Acceptance gates
1. `node scripts/check-lessons.ts` prints `lessons ok: 36 lessons, 66 exercises`.
2. File sizes match:
```sh
   wc -c "content/week7-regex/03-groups.md"   # expect 3572
   wc -c "content/week7-regex/04-substituting.md"   # expect 2835
```
3. The exercise blocks are exact:
```sh
   awk '/^::exercise$/,/^::$/' "content/week7-regex/03-groups.md" | shasum | cut -c1-12   # expect 840b6c2555dd
   awk '/^::exercise$/,/^::$/' "content/week7-regex/04-substituting.md" | shasum | cut -c1-12   # expect 74ee1fccec36
```
4. `git status --short` shows only these new lesson files, apart from changes from earlier specs.
