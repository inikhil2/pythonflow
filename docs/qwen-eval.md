# Qwen eval: base vs digest (T6) and autotest (T6b)

Qwen3.5-9B via aider + llama-server, one run per spec per config, temperature 0, 16 specs (15 items; 040 + 041 score as one item, both must pass).

## Result

- **Final pass = auto_pass AND every rubric item yes AND no unlisted edits** (ignoring `__pycache__/` and `*.pyc`) (and no gamed gate). auto_pass alone is not the verdict.
- **Base 13/15 (87%). Digest 13/15 (87%).** Recomputed from the result files (see "Recomputation"). 046 and 055 are counted **as rescored** (`rescore-loop.py`, SHA-256 `74ceb5ab…`, accepted by eval-reviewer), not as originally recorded (see "Loop-gate artifact").
- Both configs fail the same two items: **124** and **142**. Both are content fails, neither is a process fail.
- **Verdict: NO DIGEST WIN.** A tie, mostly built in by the copy-task test set (see "Key finding").
- **Decision line:** the digest does not win. First-try passes: digest 13 vs base 13 (equal, not more). Specs that passed on base and failed on digest: **none**. Digest fails that were cap or no-write: **none** (digest's 2 fails both wrote files; 142 digest ended on an idle kill but its content was scored on its diff). Under Decision 5 the digest needs more passes than base; it has the same number. Next is **T6b (autotest)**. The LoRA bar (T7) is the best of base, digest and autotest.
- **Autotest (T6b) 13/15 (87%), the same as base.** Same two fails (124, 142), zero items differing, no gaming, no unlisted edits. **This is no measurable effect on this set, not proof that autotest doesn't help** (see "Autotest result"). Decision 4: autotest is kept for live runs because CLAUDE.md requires test feedback, not because it won.
- 1 item is about 7 points. Decision 5 stays the verdict; the Progress table only illustrates it.

The 4 live-failed specs (037, 040, 041, 044) pass at base in the eval; the live failures were process failures. The eval's failed set is effectively the stand-ins (124, 142) plus base fails 046 and 055 before the loop-gate rescore (see below). That leaves the digest little room to win.

## Why "no win" is weak evidence about digests

The digest is almost all lesson voice (R1-R6, scoped to lessons), and only 098 (partly 044) is a lesson spec. R1-R6 only matter when a lesson spec gives an outline rather than full text to copy; if 098's spec gives full text, the digest's expected effect there is about zero. So a "no win" mostly reflects a digest/test-set mismatch, not proof a digest cannot work. 098 scored 3/3 in both configs and its diffs are byte-identical.

## Progress table

Items over 15 (040 + 041 = one). Autotest and LoRA are added by T6b and T7.

| Row | Base | Digest | Autotest | LoRA |
|---|---|---|---|---|
| Final pass | 13/15 (87%) | 13/15 (87%) | 13/15 (87%) | pending |
| Items with all counted gates met (not pooled gates) | 13/15 (87%) | 13/15 (87%) | 13/15 (87%) | pending |
| Content fails | 2/15 (13%) | 2/15 (13%) | 2/15 (13%) | pending |
| Process fails (loop_pass false) | 0/15 (0%) | 0/15 (0%) | 0/15 (0%) (055 as rescored) | pending |
| Median seconds (16 runs) / runs hitting cap or idle kill | 227 s / 7 (4 cap, 3 idle) | 192 s / 8 (3 cap, 5 idle) | 496 s / 5 (5 cap, 0 idle); not comparable | pending |
| Change vs Base, final pass | n/a | 0 points | 0 points | pending |
| Change vs Base, counted-gate items | n/a | 0 points | 0 points | pending |
| Change vs Base, content fails | n/a | 0 points (124, 142 fail in both) | 0 points (124, 142) | pending |
| Change vs Base, process fails | n/a | 0 points | 0 points | pending |
| Change vs Base, median seconds | n/a | -35 s (noise; not a result) | not comparable (includes test time) | pending |
| Live (context only, no change vs Base shown) | 4 of the 16 specs failed live (037, 040, 041, 044); all 4 were process failures | | | |

Notes on the table:
- Live ran under different conditions (see Known gaps). It is a context row, not a comparison.
- A run's seconds add up its retries, each with its own 720 s cap (why 142 base shows 882 s).
- 046 has 0 counted gates (rubric and regression gates only), so its "all counted gates met" is vacuous; it is still gated by 2 regression gates and 4 rubric items.
- Counted-gate row equals final-pass row because the only items with a counted-gate miss (124, 142) are also the only final fails; no item failed on the rubric alone.

## Per-spec results (16 rows)

Seconds are noisy and not comparable to live runs. End reason from each .log: normal exit, `EVAL: waitspec idle kill`, or cap (seconds >= 720). Fail class: content = files changed and a counted/regression/rubric/unlisted item unmet; process = loop_pass false.

| Spec | Base | Digest | Base s / end | Digest s / end | Compliance verdict (Opus session) |
|---|---|---|---|---|---|
| 035 activity-bars | pass | pass | 724 / cap | 724 / cap | No violation noted; diffs identical, match spec text |
| 037 usepython-auto-import | pass | pass | 85 / normal | 95 / normal | No violation noted; diffs identical, deletes only the ref import |
| 040 learn-page-unused-import | pass | pass | 100 / normal | 110 / normal | No violation noted; diffs identical, deletes only the RunResult import |
| 041 learn-page-full-replace | pass | pass | 120 / normal | 115 / normal | No violation noted; diffs identical, single deletion, file not rewritten |
| 044 concepts-data | pass | pass | 724 / cap | 185 / idle kill | No violation noted; diffs identical |
| 046 mastery-rules | pass | pass | 539 / normal | 725 / cap | No violation noted; diffs identical, only spec lines added |
| 047 progress-components | pass | pass | 553 / normal | 558 / normal | No violation noted; diffs identical |
| 055 use-trace | pass | pass | 90 / normal | 95 / normal | No violation noted; diffs identical |
| 083 use-tutor | pass | pass | 100 / normal | 95 / normal | No violation noted; diffs identical |
| 084 tutor-box | pass | pass | 186 / idle kill | 186 / idle kill | No violation noted; diffs identical |
| 085 lesson-checker | pass | pass | 725 / cap | 725 / cap | No violation noted; diffs identical |
| 098 week1-comparisons-if | pass | pass | 186 / idle kill | 186 / idle kill | No violation noted; diffs identical, lesson voice 3/3 |
| 124 trace-object-attributes | **fail (content)** | **fail (content)** | 208 / idle kill | 198 / idle kill | Both break spec intent (keyed on list/tuple); digest also deletes the dict branch (R8 violation). The `.pyc` is a harness artifact, not a violation |
| 142 interview-easy-001-003 | **fail (content)** | **fail (content)** | 882 / cap | 346 / idle kill | Both fail rubric items 1 and 2; no digest rule followed where base broke it |
| 148 interview-easy-004 | pass | pass | 246 / normal | 372 / normal | No violation noted; diffs identical |
| 152 interview-easy-007 | pass | pass | 248 / normal | 391 / normal | No violation noted; diffs identical |

Compliance column: Princi was not running, so the Opus lead session did the patterns.md compliance review. Lead verdict: on the 14 byte-identical specs compliance is identical by construction, and the blind review found no violation. On 124, both configs break spec intent (`keyed` on the list/tuple branch), and the digest config also deletes the dict branch, a digest R8 violation ("change only the named lines"). On 142, both configs fail rubric items 1 and 2. Neither config shows a digest rule being followed where base broke it.

Idle kills: base 084, 098, 124; digest 044, 084, 098, 124, 142. Cap hits: base 035, 044, 085, 142; digest 035, 046, 085. Every capped or idle-killed run except 124 and 142 still passed.

## What differed between configs

Diffs are byte-identical between configs on 14 of 16 specs. Only 124 and 142 differ (mapping unblinded now that scoring is finished). Both fail in both configs.

- **124.** Both: counted gate 0/1 (the probe's third print is `True`, expected `None`: the list/tuple branch gets `keyed = True`; the spec wants it only for dicts and objects). The stray `public/__pycache__/trace.cpython-314.pyc` in both diffs is a harness artifact and is void as an unlisted edit (see below); 124 fails on the counted gate alone, a real content fail.
  - Digest variant (blind A): deleted the `elif isinstance(v, dict)` branch (and its 2 lines), so dicts no longer send items, and put `out['keyed'] = True` in the list/tuple branch. Object branch correct.
  - Base variant (blind B): kept the dict branch and gave it `keyed`, but also added `keyed = True` to the list/tuple branch; the object `elif` sits before the dict branch.
  - Neither is better in pass terms; the digest variant is the more destructive (drops dict handling).
- **142.** Both: counted gates 10/11 and rubric 1/3 (items 1, 2 failed; 3 passed; 4 is the counted gate). Same items failed in both configs.
  - Item 1 (generators valid): failed in both, same defect. 001's generator builds random digits and does not mirror them into palindromes.
  - Item 2 (6 tests, 3 wrongs each failing a test): failed in both, with different defects.
    - Digest (blind A): 001 has two "wrong" solutions that pass all 6 tests (wrong #1 returns False for x<0 and is otherwise correct; wrong #2 `x == int(str(x)[::-1])` is correct for x>=0), and 003 wrong #1 `round(ans)` is identical to the solution.
    - Base (blind B): 003 wrong #3 (`while i*i <= x: i += 1; return i - 1`) is a correct sqrt and passes all 6 tests; the other 8 wrongs each fail a test.
  - Item 3 (002 has n = 45, 003 plain solution): passed in both.
  - Extra defects, digest: 003 test 6 `my_sqrt(2147395599) == 46340` is wrong (46340^2 = 2147395600, so the answer is 46339) and the solution fails its own test; 002's statement never gives the n range 1 to 70. Base: a stray path line (`cs50p-tutor/content/interview/easy/002-climbing-stairs.md`) at the end of the diff, after the closing `::`; 003 wrong #1 hits UnboundLocalError on x=1 (still fails a test).

## Key finding: digest effect not measurable on copy-task specs

Diffs are byte-identical between configs on 14 of 16 specs because most specs are copy tasks: run-eval's prompt says "Copy code blocks from the spec exactly", and those specs hold the full solution, so there is nothing for a digest to change. Only 124 and 142, where Qwen writes the content itself, differed at all, and there the digest neither helped nor hurt in pass terms. This is a limit of the test set, not evidence that the digest does not work.

Consequences:
- T7 dev and held-out specs must be outline-style, where Qwen authors the content.
- Mock training specs must be mostly outline-style, because full-solution specs teach copying.

## Harness artifact: 124 `.pyc`

`score-gates.py:20-21` runs `exec_module` on `trace.py`, which writes bytecode to `public/__pycache__/`. `run-eval.sh:121-128` takes the diff after scoring, and `git add -N` picks the `.pyc` up. So the blind reviewer's unlisted-edit flag on 124 is void in both configs. Rule for all configs: the unlisted-edit check ignores `__pycache__/` and `*.pyc`. Fixes: `PYTHONDONTWRITEBYTECODE=1` in T6b, and T8 never takes the diff after the scorer.

## Loop-gate artifact (found after T5)

**Counted as rescored.** 046 and 055 are counted as rescored by `rescore-loop.py` (SHA-256 `74ceb5ab5984a233df023f5aea91b173219e2a3a0e26104d32ca24d279bb7897`), not as originally recorded. eval-reviewer approved the script before it ran and accepted the rescore.

run-eval.sh, like the live `fixer-loop.sh`, (a) refuses `<` redirect gates (055: `wc -c < app/composables/useTrace.ts`, recorded as "unsafe gate, not run") and (b) never runs `generate` before `.output` gates (046: `grep -c "Not started" .output/public/learn/index.html` got an empty string). The original recorded loop_pass was false for 046 and 055 in both configs, which would have been 4 process fails.

Procedure: `rescore-loop.py`, SHA-256 `74ceb5ab5984a233df023f5aea91b173219e2a3a0e26104d32ca24d279bb7897`, approved by eval-reviewer before it ran. It rebuilds each eval setup, applies the recorded diff, and re-evaluates only the broken loop gates. Output: `results/rescore-loop.json`; non-`#control` entries override the recorded auto_pass for 046 and 055 (all four pass).

- Reference sanity (`results/rescore-ref-sanity.json`): the 046 and 055 reference commits pass their gates; 055 at its base commit fails (got empty, wanted 872), so the gate can fail.
- Control: 10/10 controls reproduced the recorded loop_pass. Controls re-run all loop gates on 041, 047, 142, 148, 152 in both configs. The 142 controls show auto_pass false because of the counted gate, as recorded.
- **The live `fixer-loop.sh` has the same two bugs.** T8 fixes or flags them. Until then the live loop fails `<`-redirect gates and `.output` gates for process reasons.
- Eight specs (035, 037, 040, 083, 084, 085, 098, 124) have no loop gate, so their loop_pass is vacuous ("no loop-checkable gates").

## Autotest harness bugs (T6b)

Autotest run 1 is **void** (kept in `.harness/eval/results/autotest-run1-void/`). It counts neither for nor against autotest. The four bugs below affect autotest's in-session test feedback only. Base and digest never run tests inside the aider session, and final scoring (score-gates, rescore-loop) uses its own trees, so the T6 results stand.

1. **Wrong directory.** aider 0.86.2 runs `--test-cmd` from the git root (`commands.py:1005-1006`, `cwd=self.coder.root`). spec-test.sh expects the app dir, so in run 1 every relative gate failed with ENOENT, "No such file" or module-loader errors (false failures in 13 of 16 logs). Qwen kept its first answer (14 of 16 diffs were byte-identical to base) and spent its time on false failures until the 720 s cap. An earlier note that blamed Qwen for writing misplaced paths was mostly this bug. Fix: the test-cmd `cd`s to the app dir.
2. **Repeat generate.** The eval tree's `node_modules` is a symlink to the main repo's, and Nuxt keeps its build cache there. A second `npm run generate` in a tree with a leftover `.nuxt` fails (`Package import specifier "#internal/nuxt/paths" is not defined`). Every autotest retry on a generate-gated spec would have got a false build failure. Fix: `rm -rf .nuxt` before each test (gitignored, not in the diff).
3. **Root-path writes.** The harness prompt tells Qwen to write `app/x.vue`, not `cs50p-tutor/app/x.vue`, but aider resolves reply paths from the git root. So Qwen's edits land at `../app/...` and `relocate` moves them home only after aider exits. In-session tests saw the still-empty listed file (055 smoke: "wanted 872, got 0" on every round). Fix: before each test, copy any non-empty `../$f` over the listed file, the same rule as `relocate`.

4. **Limit inversion.** score-gates gave every gate 120 s, which equals check-interview's own per-file limit (FILE_S = 120). spec-test gave node 300 s, which a slow multi-file check can also exceed. So a slow or looping interview file was killed by the harness before the checker could report its own failure. Run 2 halted at 142 with "env: timeout 120s", and in-session Qwen was told "timed out: harness limit, not a code error". Fix: node limits raised to 900 s in score-gates and 600 s in spec-test (inside the 720 s cap). 142 at REF takes 67 s and at BASE 1 s. Base and digest are unchanged (every gate finished under 120 s), and the 5 run-2 specs before 142 had no harness-limit lines. The halted 142 files are void (`results/autotest-142-halt-void/`), and 142 plus the rows after it ran under the new limits (freeze-t6b-run2b.txt).

Fixes 1 to 3 are in the run-eval.sh line-110 test-cmd; fix 4 is in score-gates.py and spec-test.sh. All are approved by eval-reviewer. Smoke-test run `results/autotest-smoke-b-1/` (before fix 3) is void. **The live fixer loop has the same problems** once `--auto-test` is on (same aider, same relocate, same spec-test). T8 applies the same test-cmd and the 600 s spec-test limit, and checks all of them in the live log.

Freeze chain (SHA-256 of each freeze file; each differs from the one before only in the files named):
- `freeze-pre-t6b.txt` `13d65ff4…` (run-eval.sh `9a381876…`, score-gates.py `e53070fb…`, spec-test.sh `e86fe672…`);
- `freeze-t6b-run2.txt` `9a4053eb…`: run-eval.sh `0532d04a…` (fixes 1 to 3, plus `--llm-history-file`);
- `freeze-t6b-run2b.txt` `0313562f…`: score-gates.py `0e46f83d…` and spec-test.sh `b8b64ba1…` (fix 4).
The run2b freeze was checked after the run with an empty diff. Voids: run 1, smoke-b-1, the 142 halt (`results/autotest-run1-void/`, `results/autotest-smoke-b-1/`, `results/autotest-142-halt-void/`) and the run-1 blind sitting (`blind-t6b-run1-void/`).

## Autotest result (T6b)

**13/15, the same as base.** Run 2 (5 specs) and run 2b (142 onward) ended with EXIT 0 and 16 JSONs. Harness-error, timeout and idle-kill greps were 0 in every log, and cleanup was clean. rescore-loop turned 055 from false to true (`<` gate), the same as base. A fresh blind Sonnet scorer scored base against autotest (`blind-t6b/`, seeded A/B, no prompt logs in the packet): every rubric item yes on both arms except 142 (1/4 on both: items 1, 2 and 4 no), gaming no on all 32, and no unlisted edits other than the void 124 `.pyc`. Diffs are byte-identical to base on 14 of 16 specs. On 124 both arms put `keyed` on the list branch, and the autotest arm also deletes the dict branch (the digest arm's pattern).

**Measurement caveat.** Autotest feedback had almost no chance to act on this set:
- each run had exactly one in-session test round;
- 15 of 16 specs passed every visible gate on Qwen's first answer, so there was nothing to retry;
- 142 failed 1 of 12 checks, but the run hit the 720 s cap before a second round;
- 124 fails the hidden probe, which spec-test can't see by design.
So this is "no measurable effect on this set", not "autotest doesn't help". A real test needs specs where the first answer fails a visible gate and there's time to retry (for example the T7.3 held-outs, if run).

**Cost (not comparable).** Autotest total 6798 s vs base 5716 s, 5 cap hits vs 4 (035, 044, 084, 085, 142; base 035, 044, 085, 142). On 035, 044, 084 and 085 the passing spec-test line is second-to-last in the log, so the time went into the first answer, not into retries. 084 is the exception: base 186 s (idle kill), autotest 724 s (cap), same diff. The likely cause is spec-test's generate plus slower generation, but this is unexplained and not attributed.

## Training data authorship (T7 hold)

User ruling (2026-11-06): train only on text Claude didn't write, anywhere in the example (prompt, context, think or answer). Count: **0 qualifying examples.** All 128 repo commits carry a `Co-Authored-By: Claude` trailer (all authored as the user, so the author field alone would mislead), and none has an aider author. Every spec and the context docs (DESIGN.md, plan.md, docs/patterns.md) arrived in those commits, and every served aider prompt includes them, so even Qwen's own passing answers don't qualify. Training (T7.4 onward) is held. The user's options: write specs or outlines themselves; train without the context files (no longer matching serving); run T7.3 as an eval-only extension (about 8 to 15 h); or stop at T6b.

## Method and frozen inputs

- Rubric freeze: test-set.md SHA-256 first frozen at 49af7997…190a2 at 2026-11-05T19:17:10; reviewer-approved structural change to `96dfcd6ae61f75feae76dfb5167362b35d52b0961ab25b606e3277e96b9395ba` (remove-at-setup column added, rubric text byte-identical), both before any T3 result.
- gate-classes.json `8d3b6291c92b199a4cbf1c9e19efe3747b234107a10755a7c56601c0f2065fef`; score-gates.py `e53070fb7c981665dc339c550fb75d76ea6b9595ebe9dc3ce1652039ee11ebfb`.
- digest.md `a1ec07e732315bcba926816429077fb9745e46a75167de1c0413a1a024f4d000`, frozen 2026-11-05T20:01:09Z during T3 before any base result was opened; 9 rules (R10 dropped; R1-R6 scoped to lessons, R7-R9 to code).
- Also frozen (freeze-t3.txt, identical to freeze-post-t5.txt, so nothing changed across T5): run-eval.sh `8598b97cf0b3fe0e42f3ad05e0c32bf80a95260d1f69aa0d225dbee178219ff6`, run-all.sh `842d912e50d19e3456938b2c84a4bb5c8ba86ead824ef7c55dd62d50dfa8b474`, aider-model-settings.yml `3b86b87bf1cafb4af9f10d7db3caa81eb9d2e2b79a3b4944d3c87ea1e2585aaf`.
- llama-server args: `-m $HOME/.cache/huggingface/hub/models--unsloth--Qwen3.5-9B-MTP-GGUF/snapshots/9716a636ee4bddc3fed678220b7a33dd2a4160ae/Qwen3.5-9B-UD-Q4_K_XL.gguf --port 8080 -c 32768 --jinja --flash-attn on --alias qwen --spec-type ngram-mod,draft-mtp --spec-draft-n-max 3`.
- Rubric scoring: a fresh blind Sonnet teammate scored `blind/packet/` (spec + rubric + shuffled A/B diffs, paths and config names stripped; digest-leak grep 0). Both configs scored in one sitting after T5. The mapping stayed in `blind/key/` and is used only here.
- Compliance review: Princi was not running; the Opus lead session did it.
- Gaming (a gate string met only through a comment, dead code or an unrelated literal): **none, in either config.** Unlisted edits (diff touches a file outside the spec's Files list) fail the item, with `__pycache__/` and `*.pyc` ignored for every config. The blind reviewer flagged only the 124 `.pyc`, which is void.
- Gate visibility to Qwen: visible = all counted spec gates (they are in the spec text Qwen read), including 142's `node scripts/check-interview.ts`. Unseen = the rubric, `gate-classes.json`, the non-discriminating regression gates (e.g. `check-lessons`), and 124's probe (probe form hand-written, content in spec gate 2). Neither config had test feedback (`--auto-test` is T6b).
- No re-runs to "check" results.

## Known gaps

- The idle-kill path is only lightly tested: the eval's clean worktree gives Qwen more time before the idle kill than the live loop had (the kill waits until Qwen writes something; otherwise the 720 s cap applies). Idle kills happened in 3 base and 5 digest runs.
- Eval seconds are not comparable to live runs and are noisy (one run per spec per config).
- One run per spec per config at temperature 0; a 1-item difference is about 7 points.
- 14 of 16 specs are byte-identical across configs, so the comparison has effectively two informative specs (124, 142).
- Digest/test-set mismatch described above.
- Qwen failures in this set are content mistakes on stand-ins (124, 142); the 4 live-failed specs were process failures and pass at base here.
- Autotest on 098 ran without `check-lessons` feedback. Its lesson count is stale even at the reference commit (the spec says 10 lessons, the reference has 12), so it is on the eval-only skip list (`spec-test-skip/098.txt`). Qwen got only the spec's grep and wc feedback there, so the one lesson spec is weak evidence for autotest too.

## Recomputation

Pass counts were recomputed with `python3 -I` from `results/{base,digest}/*.json`, `results/rescore-loop.json` (override of 046/055 auto_pass), `blind/scores.json` and `blind/key/mapping.json`, and match the tables above. Autotest: `results/autotest/*.json`, `results/rescore-loop.json` (055), `blind-t6b/scores.json` and `blind-t6b/key/mapping.json`.
