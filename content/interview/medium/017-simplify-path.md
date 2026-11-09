---
title: Simplify Path
tier: medium
order: 17
leetcode: 71
url: https://leetcode.com/problems/simplify-path/
companies: [Meta, Google, Amazon]
topic: Stack
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week10-algorithms/02-stacks-and-queues]
---

You get a string `path` of 1 to 3000 characters. It is a Unix-style file path that starts with a slash. Its characters are letters, digits, dots and slashes. Simplify it to the shortest equivalent absolute path, using these rules:

1. Several slashes in a row count as one slash.
2. A single dot, `.`, names the current folder, so remove it.
3. Two dots, `..`, move up one folder. At the top (the root, `/`), they do nothing.
4. Any other name is a folder, even `...` or `..hidden`, and stays as it is.
5. The result starts with one slash and has no slash at the end, except when the result is just the root `/`.

For example, `/home//foo/` becomes `/home/foo`, and `/a/./b/../../c/` becomes `/c`.

::exercise
---
id: iv-medium-017
prompt: Write a function simplify_path(path) that returns the simplified absolute path following the rules above.
starter: |
  # write your code below
  def simplify_path(path):
      pass
hints:
  - Split the path on slashes, then skip the empty parts and the single dots.
  - Keep a list of folder names. A double dot removes the last name if there is one.
tests:
  - check: assert simplify_path("/home/") == "/home"
  - check: assert simplify_path("/../") == "/"
  - check: assert simplify_path("/home//foo/") == "/home/foo"
  - check: assert simplify_path("/a/./b/../../c/") == "/c"
  - check: assert simplify_path("/...") == "/..."
  - check: assert simplify_path("/a/...") == "/a/..."
  - check: assert simplify_path("/home/user/..") == "/home"
  - check: assert simplify_path("/..hidden") == "/..hidden"
  - check: assert simplify_path("/a/b/c/../../../..") == "/"
  - check: assert simplify_path("/") == "/"
no_slow: "The path is at most 3000 characters, so every method finishes at once; a slower method gives no wrong answer at this size."
solution: |
  def simplify_path(path):
      parts = []
      for name in path.split("/"):
          if name == "..":
              if parts:
                  parts.pop()
          elif name not in ("", "."):
              parts.append(name)
      return "/" + "/".join(parts)
brute: |
  def simplify_path(path):
      parts = []
      word = ""
      for ch in path + "/":
          if ch == "/":
              if word == "..":
                  if parts:
                      parts.pop()
              elif word not in ("", "."):
                  parts.append(word)
              word = ""
          else:
              word += ch
      return "/" + "/".join(parts)
random:
  call: simplify_path
  gen: |
    def gen(rng, size):
        names = [rng.choice(["a", "b", ".", "..", "", "..."]) for _ in range(rng.randint(0, 6))]
        return ("/" + "/".join(names),)
big: 'assert (lambda r: (lambda p: __import__("hashlib").sha256(simplify_path(p).encode()).hexdigest())("".join("/" * r.randint(1, 3) + r.choice(["x", "y", "name", "a1", ".", "..", "", "...", "node"]) for _ in range(750))))(__import__("random").Random(17)) == "90ebb55b60a8973c0caf1b6737ad3a59df4f9a8f49dd28b46ec75136e2d4cf4b"'
wrong:
  - |
    def simplify_path(path):
        parts = []
        for name in path.split("/"):
            if name == "..":
                pass
            elif name not in ("", "."):
                parts.append(name)
        return "/" + "/".join(parts)
  - |
    def simplify_path(path):
        parts = []
        for name in path.split("/"):
            if name == "..":
                if parts:
                    parts.pop()
            elif name != "":
                parts.append(name)
        return "/" + "/".join(parts)
  - |
    def simplify_path(path):
        parts = []
        for name in path.split("/"):
            if name in ("..", "..."):
                if parts:
                    parts.pop()
            elif name not in ("", "."):
                parts.append(name)
        return "/" + "/".join(parts)
---
::
