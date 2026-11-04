# Five consecutive green runs (certification evidence)

Last five completed GitHub Actions runs of https://github.com/meyuval/itac-finals (workflow "Playwright"), read from the Actions API and each run's published `run.json` at 20:54 Asia/Jerusalem, 4 Nov 2026. All five concluded `success`; no failed run in between. Full suite (`npx playwright test`, projects `api` + `chromium`), 50 tests, `retries: 0`, ubuntu-latest.

| Run | Actions run | Commit | Event | Passed / failed / flaky / skipped | Report |
|---|---|---|---|---|---|
| 9 | [41887652161](https://github.com/meyuval/itac-finals/actions/runs/41887652161) | `d58b82f` | push | 50 / 0 / 0 / 0 | [report](https://meyuval.github.io/itac-finals/runs/9/) |
| 10 | [41889943540](https://github.com/meyuval/itac-finals/actions/runs/41889943540) | `3d54d98` | workflow_dispatch | 50 / 0 / 0 / 0 | [report](https://meyuval.github.io/itac-finals/runs/10/) |
| 11 | [41890338549](https://github.com/meyuval/itac-finals/actions/runs/41890338549) | `3d54d98` | workflow_dispatch | 50 / 0 / 0 / 0 | [report](https://meyuval.github.io/itac-finals/runs/11/) |
| 12 | [41890770389](https://github.com/meyuval/itac-finals/actions/runs/41890770389) | `3d54d98` | workflow_dispatch | 50 / 0 / 0 / 0 | [report](https://meyuval.github.io/itac-finals/runs/12/) |
| 13 | [41891097605](https://github.com/meyuval/itac-finals/actions/runs/41891097605) | `3d54d98` | workflow_dispatch | 50 / 0 / 0 / 0 | [report](https://meyuval.github.io/itac-finals/runs/13/) |

Disclosure: `3d54d98` is a docs-only commit on top of `d58b82f` (same test code). Run 14 was still in progress at the time of writing and is not counted. Earlier green sequence: runs #1–#5 on `6abf104` (`.itac/baseline/certification-runs.tsv`).
