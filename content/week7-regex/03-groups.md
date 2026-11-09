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
