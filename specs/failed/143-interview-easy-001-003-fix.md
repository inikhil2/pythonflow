# 143: Fix interview problems easy 001 to 003 so check-interview passes
Files: content/interview/easy/001-palindrome-number.md, content/interview/easy/002-climbing-stairs.md, content/interview/easy/003-sqrtx.md
Severity: high

## Problem
`node scripts/check-interview.ts` stops with:
`interview/easy/001-palindrome-number.md: the solution fails test 7: ValueError: invalid literal for int() with base 10: ''`
Test 7 is the random check. For size 0, 001's `gen` joins zero digits and calls `int("")`.
It also never builds a palindrome, so almost every random input has the answer False.

The PE review found more that the checker would reject next:
- 001, wrong solutions 1 and 3 are correct. Wrong 1 keeps the `x < 0` guard before `abs`.
  Wrong 3 adds `and x != 0`, so 0 still gives True. Neither fails a test.
- 001's solution: its `x < 0` guard is redundant, because the loop already returns False
  for a negative number. So the mutant `if x < -1:` survives.
- 002's solution: its `if n == 2: return 2` branch is redundant, so the mutant
  `if n == 1: return 2` survives.
- 003, wrong solution 1 (a linear search with `<=` that returns `i - 1`) is correct. It
  fails no test.
- 003's solution: its separate `==` branch makes the mutant `<` to `<=` survive.
- All three have a `same` block. It is only for problems with more than one right answer.

## Required change
Make only the changes below. Leave the frontmatter, the statement text, the prompt, the
starter, the hints and the tests as they are.

### 001-palindrome-number.md
1. Replace `solution` with:
```yaml
solution: |
  def is_palindrome(x):
      original = x
      reversed_num = 0
      while x > 0:
          reversed_num = reversed_num * 10 + x % 10
          x = x // 10
      return original == reversed_num
```
2. Replace the whole `random` block, with no `same` key:
```yaml
random:
  call: is_palindrome
  gen: |
    def gen(rng, size):
        if rng.random() < 0.5:
            s = "".join(str(rng.randint(0, 9)) for _ in range(size // 2 + 1))
            x = int(s + s[::-1][rng.randint(0, 1):])
        else:
            x = rng.randint(0, 10 ** (size // 2 + 1))
        return (-x if rng.random() < 0.25 else x,)
```
3. Replace the whole `wrong` list with:
```yaml
wrong:
  - |
    def is_palindrome(x):
        x = abs(x)
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
  - |
    def is_palindrome(x):
        s = str(x)
        return s[0] == s[-1]
  - |
    def is_palindrome(x):
        if x % 10 == 0:
            return False
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + x % 10
            x = x // 10
        return original == reversed_num
```

### 002-climbing-stairs.md
1. Replace `solution` with:
```yaml
solution: |
  def climb_stairs(n):
      prev2, prev1 = 1, 1
      for _ in range(n - 1):
          prev2, prev1 = prev1, prev1 + prev2
      return prev1
```
2. Delete the `same` key and its code from the `random` block. Keep `call` and `gen`.

### 003-sqrtx.md
1. Replace `solution` with:
```yaml
solution: |
  def my_sqrt(x):
      lo = 0
      hi = x
      while lo < hi:
          mid = (lo + hi + 1) // 2
          if mid * mid > x:
              hi = mid - 1
          else:
              lo = mid
      return lo
```
2. Delete the `same` key and its code from the `random` block. Keep `call` and `gen`.
3. Replace the first `wrong` entry, the linear search, with this one. Keep the other two.
   Indent their bodies with 4 spaces, like this one:
```yaml
  - |
    def my_sqrt(x):
        return round(x ** 0.5)
```
4. Add this block after the `wrong` list and before the closing `---`:
```yaml
equivalent:
  - lo = -1  # why: mid never drops below 0, so starting one lower ends on the same answer
  - mid = (lo + hi + 2) // 2  # why: mid stays above lo and at most hi, so the search still ends on the same answer
```

## Acceptance gates
1. `grep -cF "same:" content/interview/easy/001-palindrome-number.md` prints `0`
2. `grep -cF "same:" content/interview/easy/002-climbing-stairs.md` prints `0`
3. `grep -cF "same:" content/interview/easy/003-sqrtx.md` prints `0`
4. `grep -cF "if x < 0" content/interview/easy/001-palindrome-number.md` prints `0`
5. `grep -cF "x = int(s + s[::-1][rng.randint(0, 1):])" content/interview/easy/001-palindrome-number.md` prints `1`
6. `grep -cF "x = abs(x)" content/interview/easy/001-palindrome-number.md` prints `1`
7. `grep -cF "prev2, prev1 = prev1, prev1 + prev2" content/interview/easy/002-climbing-stairs.md` prints `1`
8. `grep -cF "return round(x ** 0.5)" content/interview/easy/003-sqrtx.md` prints `1`
9. `grep -cF "  - lo = -1  # why:" content/interview/easy/003-sqrtx.md` prints `1`
10. `grep -c "  - check: assert" content/interview/easy/003-sqrtx.md` prints `6`
11. Run by hand: `node scripts/check-interview.ts` prints a mutant line for each of the 5
    problems, then `interview ok: 5 problems`, and exits 0. If it names a file, send the PE
    the exact message. Do not patch it by hand.
12. Run by hand: if 11 passes, commit the three files with the message
    "Interview: easy 001 to 003 (Palindrome Number, Climbing Stairs, Sqrt(x))".
