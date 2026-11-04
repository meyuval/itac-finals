# Five consecutive green runs (certification evidence)

Status: **CERTIFIED on `6abf1045a17023f50831fe2cf459b9ebd4cd0a15`** (repository https://github.com/meyuval/itac-finals,
GitHub Actions runs #1–#5, 4 Nov 2026 18:01–18:14 UTC = 20:01–20:14 Asia/Jerusalem). Five consecutive runs, all dispatched
one at a time with `workflow_dispatch` after the Finalist 5 secrets were set (18:00:03Z), no failed or cancelled run in
between. Data read from the Actions API and each run's log; nothing is inferred.

Scope of each run: `npx playwright test`, projects `api` (24) + `chromium` (26) = 50 tests, `retries: 0`, 2 workers,
ubuntu-latest, Node 22, Playwright 1.64.1, account Finalist 5 (workspace `itac-5`, viewer key, scopes read + reports).

| # | Workflow run | Commit | Started (UTC) | Finished (UTC) | Passed / failed / flaky / skipped | Test time | Public report |
|---|---|---|---|---|---|---|---|
| 1 | [41882894791](https://github.com/meyuval/itac-finals/actions/runs/41882894791) | `6abf1045a170` | 2026-11-04T18:01:38Z | 2026-11-04T18:03:52Z | 50 / 0 / 0 / 0 | 1.4 m | https://meyuval.github.io/itac-finals/runs/1/ |
| 2 | [41883315559](https://github.com/meyuval/itac-finals/actions/runs/41883315559) | `6abf1045a170` | 2026-11-04T18:03:59Z | 2026-11-04T18:06:40Z | 50 / 0 / 0 / 0 | 1.5 m | https://meyuval.github.io/itac-finals/runs/2/ |
| 3 | [41883825380](https://github.com/meyuval/itac-finals/actions/runs/41883825380) | `6abf1045a170` | 2026-11-04T18:06:48Z | 2026-11-04T18:08:47Z | 50 / 0 / 0 / 0 | 1.3 m | https://meyuval.github.io/itac-finals/runs/3/ |
| 4 | [41884232258](https://github.com/meyuval/itac-finals/actions/runs/41884232258) | `6abf1045a170` | 2026-11-04T18:09:04Z | 2026-11-04T18:11:58Z | 50 / 0 / 0 / 0 | 1.5 m | https://meyuval.github.io/itac-finals/runs/4/ |
| 5 | [41884761006](https://github.com/meyuval/itac-finals/actions/runs/41884761006) | `6abf1045a170` | 2026-11-04T18:12:08Z | 2026-11-04T18:13:55Z | 50 / 0 / 0 / 0 | 1.2 m | https://meyuval.github.io/itac-finals/runs/5/ |

Raw rows: `.itac/baseline/certification-runs.tsv`.

**Changes after certification (disclosed, NOT five-times certified):**
- `d104959` (ci): run summary lists the Pages report links. Run #6 (push) and #7 (dispatch): 50/50 green; run #8 cancelled by us when superseded.
- `d58b82f` (ci + test): the Playwright workflow deploys GitHub Pages itself, so the report link appears on the Playwright
  run page; API false-positive fixes from the final audit (API-PF-06 `since` cutoff, API-DL-02 sampled deal in results,
  portfolio list/paging non-empty) and the restored landing-URL check in the inherited sign-out test. Verified locally
  (api 24/24, retries 0) and by its push run; there was no time for five further runs before the 21:00 deadline.

Earlier certifications on the intermediate fork (superseded by code and credential changes):

Previous certification: **commit `e0fd863f495ed8602ec502c84f0471d7558b70d7`** (GitHub Actions runs #8–#12, 4 Nov 2026 17:08–17:16 UTC = 19:08–19:16 Asia/Jerusalem). Data below was read from the Actions API and each run's published `run.json`; nothing is inferred. If code changes after this commit, a new five-run sequence is required and this file is updated.

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
