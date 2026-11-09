# Builtin-slow backlog (reviewer check 5, 2026-11-01)

Dispatch after platform-dev task 6 (wall-clock limit) lands. For each file: raise the stated maximum to
LeetCode size (usually 10^5) so a C-level O(n^2) is ~1e10 ops and fails the time limit, keep `big`
at that maximum and general, and add the builtin version as an extra `slow:`.

- easy 032 `max(sum(nums[i:i+k]) ...)/k`
- easy 033 repeated `s.replace(c+c, "")`
- easy 046 `sum(nums[:i]) == sum(nums[i+1:])`
- easy 058 `x in nums[i+1:]`
- easy 059 `nums.count(x)`
- easy 062 `max(nums2[i+1:], default=-1)`
- easy 063 `x in nums2` over set(nums1)
- easy 064 `s.count(ch) == 1`
- easy 066 `nums[i] in nums[i+1:i+k+1]`
- easy 068 `k not in nums`
- easy 070 `left.replace(ch, "", 1)`
- easy 072 `sum(nums[l:r+1])` per query
- easy 073 `nums.count(k)`
- easy 074 `k not in nums`
- easy 075 `nums.count(a)` over set; big needs many distinct values
- medium 052 `sorted(map(sum, combinations(nums, 3)))` + bisect; big at stated max
- medium 057 `max(arr[:i+1]) == i`
- easy 095 `sorted(seen)[k-1]` per add
- easy 099 `node.val in values`
- medium 006 `math.prod(nums[:i]) * math.prod(nums[i+1:])`
- medium 010 `nums.insert(0, nums.pop())` k times

# Open fix lists at wrap-up (2026-11-01, 17:30)

Fix lists come before new problems. Every file below is on disk and not committed.

## Size rule (LeetCode limits, never above)
- The reviewer's size audit of every file was cut off by the usage limit before any finding came back. Run it again first:
  for each file, compare each stated range with LeetCode's constraints, and check that big stays inside the statement.
- Known violations: medium 089 (states 100000, LeetCode 198 allows 100), medium 091 (100000, LeetCode 55 allows 10^4),
  easy 062 (50000, LeetCode 496 allows 1000), hard 067 (100000, LeetCode 42 allows 2·10^4), hard 068 (5000, LeetCode 410 allows 1000).

## Per file
- easy 032, 067: rebuild big so at least one wrong fails it by output. For 032 the sum-slice wrongs time out at k = 50000, so plant a window that a wrong misses within the time cap.
- easy 043: haiku-problems' fix passed its gate; not yet reviewed.
- easy 062: nums2 ≤ 1000; big at 1000 from both offline methods; `no_slow` with "# why: LeetCode caps nums2 at 1000, so a quadratic scan stays far inside the step budget"; stack idea in a hint.
- medium 089: n 1–100; big at n = 100 where the last house matters (wrong #3 fails by output); expected from a second method offline.
- medium 091: n ≤ 10^4 in the statement and every big assert; keep the [1]*n assert; slice-fill slow goes to a hint with a `# why`.
- medium 097: line 103 why becomes "# why: the stop is exclusive, so the only extra step is s = x - 1, which ORs in dp[-1] == dp[half]; if dp[half] is True the answer is already True, otherwise nothing changes".
- medium 029: LeetCode allows 3·10^4 calls; rebuild big; builtin slow to a hint.
- medium 043: second big with about 12 candidates, e.g. [2] + 23..33, target 40.
- medium 044: big's call count must equal the stated max.
- medium 048: n at 10^5 if LeetCode allows, otherwise a `# why` and a hint (the `nums.count` slow lands at 10–15 s).
- hard 017: big takes 1.56 s of 2 s. Count the solution's steps; if over 1.5M, state 10^5 calls with "# why: LeetCode allows 2·10^5; halved so the reference stays inside the step budget", and rebuild big from the lazy heap.
- hard 019 (problems-b): gated ok, not reviewed. Check that dropping the n = 6 and n = 8 tests didn't weaken it.
- hard 026: confirm big's 23 with the bitmask-DP slow, run offline in plain python3.
- hard 028: max 9, big 352, `min_distinct: 9` with a `# why`; gen must give exactly 9 distinct inputs.
- hard 029: no_slow why: "well under a second" becomes "about a second".
- hard 037: build big from 8 distinct top-level pieces (length 50) so a tuned BFS can't pass.
- hard 040: a builtin `sum(...)` slow passes big. Check LeetCode's cap first (757 caps intervals at 3000). If big is already at the cap, don't raise it: put it in a hint with a `# why`.
  Also explain the slow's 0.03 s timing against 2M steps (count lines under settrace).
- hard 062: `disc = [None] * n` with `is None` checks; drop or re-reason "9: timer = [-1]" (it becomes a uniform shift).
- hard 067: 20000 heights; recompute from the prefix/suffix oracle.
- hard 068: n ≤ 1000; rebuild big.
- hard 069, 070: full report still owed (sizes vs LeetCode, expected-value source, which wrong fails big by output, the why for each equivalent).
- hard 071–073 (problems-d): written mid-batch; state unknown. Re-gate them, then report.

## Status unknown at wrap-up (on disk, never confirmed accepted in the final hours)
Re-gate each one, then send it to the reviewer before committing:
easy 042, 055, 097; medium 011, 012, 014, 018, 026, 030, 032, 034, 037, 071, 072, 078, 081, 084, 085;
hard 002, 003, 004, 041, 042, 043, 044, 063.
Parked: medium 006 and 035 (problems-c). Skipped: medium 082. Not written: easy 081.

## Wrap-up commit list sent to Orca (87 files)
- content/interview/easy/063-intersection-of-two-arrays.md
- content/interview/easy/064-first-unique-character-in-a-string.md
- content/interview/easy/065-happy-number.md
- content/interview/easy/066-contains-duplicate-ii.md
- content/interview/easy/068-missing-number.md
- content/interview/easy/070-ransom-note.md
- content/interview/easy/072-range-sum-query-immutable.md
- content/interview/easy/099-remove-duplicates-from-sorted-list.md
- content/interview/medium/002-divide-two-integers.md
- content/interview/medium/003-the-kth-factor-of-n.md
- content/interview/medium/005-rotate-image.md
- content/interview/medium/008-next-permutation.md
- content/interview/medium/009-next-greater-element-ii.md
- content/interview/medium/010-rotate-array.md
- content/interview/medium/033-lru-cache.md
- content/interview/medium/038-subsets.md
- content/interview/medium/039-permutations.md
- content/interview/medium/040-decode-string.md
- content/interview/medium/041-reorder-list.md
- content/interview/medium/042-power-of-x-to-the-n.md
- content/interview/medium/045-three-sum.md
- content/interview/medium/046-group-anagrams.md
- content/interview/medium/047-merge-intervals.md
- content/interview/medium/049-reorganize-string.md
- content/interview/medium/050-kth-largest-element-in-an-array.md
- content/interview/medium/063-two-sum-ii-input-array-is-sorted.md
- content/interview/medium/065-single-element-in-a-sorted-array.md
- content/interview/medium/066-find-the-duplicate-number.md
- content/interview/medium/070-search-in-rotated-sorted-array-ii.md
- content/interview/medium/073-lowest-common-ancestor-of-a-binary-tree.md
- content/interview/medium/074-rotting-oranges.md
- content/interview/medium/075-course-schedule.md
- content/interview/medium/083-binary-tree-level-order-traversal.md
- content/interview/medium/086-all-nodes-distance-k-in-binary-tree.md
- content/interview/medium/087-longest-palindromic-substring.md
- content/interview/medium/088-maximum-subarray.md
- content/interview/medium/090-generate-parentheses.md
- content/interview/medium/092-coin-change.md
- content/interview/medium/093-maximum-product-subarray.md
- content/interview/medium/094-best-time-to-buy-and-sell-stock-ii.md
- content/interview/medium/095-palindromic-substrings.md
- content/interview/medium/096-word-break.md
- content/interview/medium/098-non-overlapping-intervals.md
- content/interview/medium/099-jump-game-ii.md
- content/interview/medium/100-longest-subarray-of-1s-after-deleting-one-element.md
- content/interview/hard/005-minimum-number-of-k-consecutive-bit-flips.md
- content/interview/hard/006-shortest-palindrome.md
- content/interview/hard/007-create-maximum-number.md
- content/interview/hard/008-find-the-closest-palindrome.md
- content/interview/hard/009-longest-happy-prefix.md
- content/interview/hard/010-first-missing-positive.md
- content/interview/hard/011-minimum-window-substring.md
- content/interview/hard/012-substring-with-concatenation-of-all-words.md
- content/interview/hard/013-max-points-on-a-line.md
- content/interview/hard/014-subarrays-with-k-different-integers.md
- content/interview/hard/015-maximum-frequency-stack.md
- content/interview/hard/016-range-module.md
- content/interview/hard/027-24-game.md
- content/interview/hard/030-sliding-window-maximum.md
- content/interview/hard/031-merge-k-sorted-lists.md
- content/interview/hard/032-find-median-from-data-stream.md
- content/interview/hard/033-minimum-cost-to-hire-k-workers.md
- content/interview/hard/034-smallest-range-covering-elements-from-k-lists.md
- content/interview/hard/035-sliding-window-median.md
- content/interview/hard/036-the-skyline-problem.md
- content/interview/hard/038-minimum-initial-energy-to-finish-tasks.md
- content/interview/hard/039-contains-duplicate-iii.md
- content/interview/hard/045-longest-duplicate-substring.md
- content/interview/hard/046-count-of-smaller-numbers-after-self.md
- content/interview/hard/047-shortest-subarray-with-sum-at-least-k.md
- content/interview/hard/048-find-minimum-in-rotated-sorted-array-ii.md
- content/interview/hard/049-count-of-range-sum.md
- content/interview/hard/050-word-ladder.md
- content/interview/hard/051-serialize-and-deserialize-binary-tree.md
- content/interview/hard/052-word-search-ii.md
- content/interview/hard/053-bus-routes.md
- content/interview/hard/054-shortest-path-in-a-grid-with-obstacles-elimination.md
- content/interview/hard/055-making-a-large-island.md
- content/interview/hard/056-vertical-order-traversal-of-a-binary-tree.md
- content/interview/hard/057-word-ladder-ii.md
- content/interview/hard/058-reconstruct-itinerary.md
- content/interview/hard/059-recover-a-tree-from-preorder-traversal.md
- content/interview/hard/060-swim-in-rising-water.md
- content/interview/hard/061-trapping-rain-water-ii.md
- content/interview/hard/064-min-cost-valid-path-in-grid.md
- content/interview/hard/065-k-th-smallest-in-lexicographical-order.md
- content/interview/hard/066-palindrome-pairs.md
