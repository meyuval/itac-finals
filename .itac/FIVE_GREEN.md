# Five consecutive green runs (certification evidence)

Status: IN PROGRESS. This file is filled with real run data after the runs complete; nothing here is inferred.

Scope of each qualifying run: full suite (`npx playwright test`), both projects (`api`: 9 tests, `chromium`: 15 tests),
24 tests, `retries: 0`, 2 workers, ubuntu-latest, Node 22, Playwright 1.64.1, triggered by push or `workflow_dispatch`.
A run qualifies only if it concludes `success` with 24 passed, 0 failed, 0 flaky, 0 skipped.

A first certification of five green runs was completed on commit `f0a9705` (23 tests, runs #3–#7, see
`.itac/baseline/certification-runs-f0a9705.tsv`). It was superseded because an audit of the EDD Dossiers change restored
one inherited destination as a new test, which changed the code; the table below is for the final commit.

| # | Workflow run | Commit | Started (UTC) | Finished (UTC) | Passed / failed / flaky / skipped | Public report |
|---|---|---|---|---|---|---|
| (pending) | | | | | | |
