# Five consecutive green runs (certification evidence)

Status: **CERTIFIED on commit `e0fd863f495ed8602ec502c84f0471d7558b70d7`** (GitHub Actions runs #8–#12, 4 Nov 2026 17:08–17:16 UTC = 19:08–19:16 Asia/Jerusalem). Data below was read from the Actions API and each run's published `run.json`; nothing is inferred. If code changes after this commit, a new five-run sequence is required and this file is updated.

Scope of each qualifying run: full suite (`npx playwright test`), both projects (`api`: 9 tests, `chromium`: 15 tests),
24 tests, `retries: 0`, 2 workers, ubuntu-latest, Node 22, Playwright 1.64.1, triggered by push or `workflow_dispatch`.
A run qualifies only if it concludes `success` with 24 passed, 0 failed, 0 flaky, 0 skipped.

A first certification of five green runs was completed on commit `f0a9705` (23 tests, runs #3–#7, see
`.itac/baseline/certification-runs-f0a9705.tsv`). It was superseded because an audit of the EDD Dossiers change restored
one inherited destination as a new test, which changed the code; the table below is for the final commit.

| # | Workflow run | Commit | Started (UTC) | Finished (UTC) | Passed / failed / flaky / skipped | Test time | Public report |
|---|---|---|---|---|---|---|---|
| 8 | [41874595214](https://github.com/meyuval/stonewake-final-repo/actions/runs/41874595214) | `e0fd863f495e` | 2026-11-04T17:08:22Z | 2026-11-04T17:09:35Z | 24 / 0 / 0 / 0 | 36 s tests | [report](https://meyuval.github.io/stonewake-final-repo/runs/8/) |
| 9 | [41874838020](https://github.com/meyuval/stonewake-final-repo/actions/runs/41874838020) | `e0fd863f495e` | 2026-11-04T17:09:49Z | 2026-11-04T17:11:08Z | (run.json unavailable) |  | [report](https://meyuval.github.io/stonewake-final-repo/runs/9/) |
| 10 | [41875119553](https://github.com/meyuval/stonewake-final-repo/actions/runs/41875119553) | `e0fd863f495e` | 2026-11-04T17:11:27Z | 2026-11-04T17:12:45Z | 24 / 0 / 0 / 0 | 40 s tests | [report](https://meyuval.github.io/stonewake-final-repo/runs/10/) |
| 11 | [41875399549](https://github.com/meyuval/stonewake-final-repo/actions/runs/41875399549) | `e0fd863f495e` | 2026-11-04T17:13:06Z | 2026-11-04T17:14:25Z | 24 / 0 / 0 / 0 | 34 s tests | [report](https://meyuval.github.io/stonewake-final-repo/runs/11/) |
| 12 | [41875666700](https://github.com/meyuval/stonewake-final-repo/actions/runs/41875666700) | `e0fd863f495e` | 2026-11-04T17:14:41Z | 2026-11-04T17:16:32Z | 24 / 0 / 0 / 0 | 43 s tests | [report](https://meyuval.github.io/stonewake-final-repo/runs/12/) |

Run #8 was triggered by the push of `e0fd863`; runs #9–#12 by `workflow_dispatch` with labels "certification 2/5" … "5/5",
each dispatched only after the previous run had completed (no overlap, no cancellation). No intervening failed run.
Command in every run: `npx playwright test` (both projects) after `npm ci`, `npm run typecheck` and `npx playwright install --with-deps chromium`.
Raw records: `.itac/baseline/certification-runs.tsv` (this certification) and `.itac/baseline/certification-runs-f0a9705.tsv` (the earlier, superseded one).
