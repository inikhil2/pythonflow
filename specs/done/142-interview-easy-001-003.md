# 142: Interview problems easy 001 to 003 (Palindrome Number, Climbing Stairs, Sqrt(x))
Files: content/interview/easy/001-palindrome-number.md, content/interview/easy/002-climbing-stairs.md, content/interview/easy/003-sqrtx.md
Severity: medium

## Problem
The Interview track has only two sample problems. This is the first batch from
docs/interview-list.yml, and it is the pilot for the format. The user will review it before
more batches are written. The user practises for real interviews offline, so a wrong
answer must never pass.

## Required change
Create the three files. Follow docs/interview-format.md exactly, and copy the shape of
content/interview/easy/057-two-sum.md. Every statement, test and solution is your own
writing, never LeetCode's text.

All three problems use these values:
- tier: easy
- companies: copy them from the per-problem notes below
- topic: Math
- needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week0-functions/06-numbers]

Each exercise has these parts:
- **Tests:** exactly 6 `check` tests.
- **Wrong solutions:** exactly 3 `wrong` solutions. Each one is a real learner mistake and
  fails at least one of your tests.
- **Random block:** a `random` block, as described for each problem below.
- **Solution:** a plain solution that uses loops and arithmetic. No `**0.5`, no `math`
  import and no string tricks, unless the notes below allow them. Plain code gives the
  mutation test something to bite on.

### 001-palindrome-number.md
- **Frontmatter:** title "Palindrome Number", order 1, leetcode 9,
  url https://leetcode.com/problems/palindrome-number/, companies [Google, Amazon, Meta].
  The exercise id is iv-easy-001.
- **Function:** `is_palindrome(x)` gets an int and returns True when its digits read the
  same both ways. Negative numbers are never palindromes. Say so in the statement.
- **Solution:** reverse the digits with `% 10` and `// 10` in a loop, then compare.
- **Tests:** use exactly these six inputs: 121, -121, 10, 0, 1221 and 12341. 12341 has the
  same first and last digit but is not a palindrome.
- **gen:** half the time build a palindrome from random digits (it may be negative, which
  gives False). Otherwise return a random int in `-10**(size // 2 + 1)` to
  `10**(size // 2 + 1)`. Return a 1-tuple, `(x,)`.
- **Wrong solutions:** one uses `abs(x)`, so -121 counts as a palindrome. One compares
  only the first and last digit. One treats a number ending in 0 as never a palindrome,
  so 0 gives False.

### 002-climbing-stairs.md
- **Frontmatter:** title "Climbing Stairs", order 2, leetcode 70,
  url https://leetcode.com/problems/climbing-stairs/, companies [Google, Amazon, Meta].
  The exercise id is iv-easy-002.
- **Function:** `climb_stairs(n)` returns the number of ways to climb n steps, taking 1 or
  2 steps at a time. n is from 1 to 70. Say so in the statement.
- **Solution:** keep the last two counts in a loop. No recursion.
- **Tests:** include n = 1, 2, 3, 5 and 10. One test uses n = 45, whose answer is
  1836311903.
- **gen:** return `(rng.randint(1, 5 * size + 10),)`. That gives n up to 70, enough for
  50 distinct inputs.
- **Wrong solutions:** one uses `return n` for every n. One gets the start wrong:
  climb_stairs(1) returns 2, because the loop runs one time too many. One returns the
  n-th Fibonacci number with fib(1) = fib(2) = 1, which is one step behind.

### 003-sqrtx.md
- **Frontmatter:** title "Sqrt(x)", order 3, leetcode 69,
  url https://leetcode.com/problems/sqrtx/, companies [Google, Amazon, Microsoft].
  The exercise id is iv-easy-003.
- **Function:** `my_sqrt(x)` gets an int x ≥ 0 and returns the square root rounded down
  to an int. Say that the learner may not use `**`, `pow` or `math`. Name binary search as
  the fast way.
- **Solution:** a binary search on lo and hi.
- **Tests:** include 0, 1, 4, 8, a large perfect square such as 2147395600 and the number
  just below it, 2147395599.
- **gen:** return `(rng.randint(0, 10**(size // 2 + 1)),)`. Half the time, square a
  random int and add -1, 0 or +1, and keep the result ≥ 0. That keeps the cases near the
  boundaries.
- **Wrong solutions:** one rounds to the nearest integer instead of down. One runs
  `while i * i < x: i += 1` and returns i, which overshoots on non-squares. One is the
  binary search with `lo < hi`, which misses the last step.

## Acceptance gates
1. `grep -cF "id: iv-easy-00" content/interview/easy/001-palindrome-number.md` prints `1`
2. `grep -cF "id: iv-easy-00" content/interview/easy/002-climbing-stairs.md` prints `1`
3. `grep -cF "id: iv-easy-00" content/interview/easy/003-sqrtx.md` prints `1`
4. `grep -c "  - check: assert is_palindrome(" content/interview/easy/001-palindrome-number.md` prints `6`
5. `grep -c "  - check: assert climb_stairs(" content/interview/easy/002-climbing-stairs.md` prints `6`
6. `grep -c "  - check: assert my_sqrt(" content/interview/easy/003-sqrtx.md` prints `6`
7. `grep -cF "  - |" content/interview/easy/001-palindrome-number.md` prints `3`
8. `grep -cF "  - |" content/interview/easy/002-climbing-stairs.md` prints `3`
9. `grep -cF "  - |" content/interview/easy/003-sqrtx.md` prints `3`
10. `grep -cF "def gen(rng, size):" content/interview/easy/003-sqrtx.md` prints `1`
11. Run by hand: `node scripts/check-interview.ts` prints a mutant line for each of the 5
    problems, then `interview ok: 5 problems`, and exits 0. If it names a file, report the
    message. The PE writes the fix.
12. Run by hand: `node scripts/check-lessons.ts` prints `lessons ok: 49 lessons, 91 exercises`.
