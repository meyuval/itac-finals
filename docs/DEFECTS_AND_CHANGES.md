# Defects and changes log (ITAC 2026 final, 4 Nov 2026)

Inherited project: https://github.com/AlexKomanov/stonewake-final-repo (commit `b4f92c9`, 10 API + 10 UI tests).
Fork and submission: https://github.com/meyuval/stonewake-final-repo.

## 1. Baseline (observed, not inferred)

| Run | Where | Result | Evidence |
|---|---|---|---|
| Upstream's own last run (committed `test-results/.last-run.json`) | author's machine | 10 failed / 20 | `.itac/baseline/` (copied before untracking) |
| Local baseline on merge commit `591c836`, unchanged tests, retries 0 | Windows, Node 26, Playwright 1.64.1 | 10 failed / 10 passed, 3.1 min | `.itac/baseline/local-baseline-591c836.txt` |

Failing: api 1, 2, 5, 9, 10 and ui 1, 3, 6, 7, 10. Same ten as upstream, so the failures are deterministic, not flaky.

## 2. Root causes of the ten failures

Category key: **A** = automation (test) defect, **P** = product/workspace behaviour, **U** = unknown.

| # | Inherited test | Observation (evidence) | Root cause | Cat. | Correction |
|---|---|---|---|---|---|
| 1 | api 1 health | `GET /v1/health` → 404; `GET /health` → 200 (curl, OpenAPI) | wrong path | A | call `/health` |
| 2 | api 2 me | `Authorization: Token …` → 401; `Bearer …` → 200 | wrong auth scheme (the other 20 calls use Bearer) | A | Bearer via one `ApiClient`; removed `console.log` of the account payload |
| 3 | api 5 portfolio list | body keys are `items, limit, offset, total`; test read `data` | wrong field name | A | assert on `items` (typed `PageOf<T>`) |
| 4 | api 9 countries | `/v1/countries/DEU` returns `iso2: "DE"`; test expected `GE` (Georgia) | wrong expected value | A | expect `DE`; guard `find()` with `toBeDefined()` |
| 5 | api 10 search | 422 message says "less than or equal to 25"; test expected 50 (OpenAPI: max 25) | stale expectation | A | bound taken from `API_LIMITS.searchMax` |
| 6 | ui 1 login ok | login page has no `#email`; textbox is named "Email" | brittle id selector | A | `getByRole('textbox', { name: 'Email' })`; dropped a 2 s sleep and a non-web-first URL check |
| 7 | ui 3 terms checkbox | native `input[type=checkbox]` is `aria-hidden`; the visible control is a `role=checkbox` button | wrong element | A | `getByRole('checkbox', { name: /Evaluation Terms/ })` + `toBeChecked()` |
| 8 | ui 6 sidebar | sidebar in workspace *itac-ja* has Deal Book, Tenders, Countries, Institutions, Network, Monitoring, Portfolio, Screenings, Scoring; no "EDD Dossier" | module not enabled for this workspace (changelog 4 Nov lists EDD Dossiers as a sidebar entry) | P/U | navigation test covers the nine modules that exist; EDD Dossiers noted as a question for the organizers, not asserted |
| 9 | ui 7 deal book | deal rows link to `/deals/<id>`; test looked for `/deal/` | wrong href prefix | A | `/deals/`; dropped a 3 s sleep |
| 10 | ui 10 portfolio | DOM has `data-testid="tile-not_assessed"`; test used `tile-not-assessed` | wrong test id (product uses an underscore while the other four tiles use plain words) | A (+ product observation) | use the real id; naming inconsistency reported, see §4 |

Negative control: with the fix in place, flipping `DE` back to `GE` makes api 9 fail (`.itac/baseline/negative-control-api9.txt`), so the assertion detects wrong data.

## 3. Stability and quality changes (no change of test intent)

- Removed all fixed sleeps (`waitForTimeout` ×3) and `page.url()` value checks; every wait is now a web-first assertion (`toHaveURL`, `toBeVisible`, `toHaveText`).
- Credentials and URLs are injected: `.env` (untracked) locally, GitHub secrets in CI, validated once per worker by `loadConfig()`.
- One login implementation (`LoginPage.signIn`) used by the `loggedInApp` fixture instead of seven copies; the fixture verifies the landing page before the test starts.
- Locators moved into page objects and converted from XPath/CSS ids to role/label/placeholder/test-id locators.
- `var` → `const`, typed API models, strict TypeScript with `npm run typecheck` in CI.
- `playwright.config.ts`: `retries: 0` explicit, `forbidOnly` in CI, `fullyParallel`, `expect.timeout` 10 s, per-test 60 s, two projects (`api`, `chromium`).
- CI: no `cancel-in-progress`, secrets via `env`, credential scan of the report, artifact upload, public report on GitHub Pages with run number and SHA stamped in the page.
- Repo hygiene: `node_modules`, `.env`, `test-results`, `playwright-report` untracked (history not rewritten, see §5).

Mapping of inherited tests to new files: api 1–4 → `tests/backend/health-and-auth.spec.ts`; api 5–6 → `portfolio.spec.ts`; api 7–8 → `entities.spec.ts`; api 9 → `countries.spec.ts`; api 10 → `search.spec.ts`; ui 1–5 → `tests/ui/auth.spec.ts`; ui 6 → `navigation.spec.ts`; ui 7 → `deal-book.spec.ts`; ui 8 → `countries.spec.ts`; ui 9 → `institutions.spec.ts`; ui 10 → `portfolio.spec.ts`. Each test carries an `// inherited: …` comment.

## 4. Product observations (candidates for SpiraTest; file only what is confirmed)

| ID | Observation | Evidence | Status |
|---|---|---|---|
| P-1 | Portfolio tile test ids are inconsistent: `tile-red`, `tile-amber`, `tile-green`, `tile-insufficient` but `tile-not_assessed` | DOM in trace of baseline run; API status enum uses `not_assessed` | Low severity (test-hook naming); SpiraTest ID: _pending_ |
| P-2 | "EDD Dossiers" module absent from the sidebar of the competition workspace although the 4 Nov changelog lists it | baseline snapshot of ui 6; `.itac/sut-docs/changelog.md` | Unknown whether intended (feature flag); question for organizers |
| P-3 | Portfolio row navigation appends `?from=portfolio` to the institution URL | run `phase2-run1` | Informational, not a defect |

## 5. Residual risks and known limitations

- The inherited history contains `.env` and traces with real credentials; the fork inherits that history. Rewriting history would break provenance, so the organizers are asked to rotate the key and password.
- Exact error-message strings and exact key sets are asserted because the OpenAPI spec documents them; copy changes will fail these tests by design.
- Tests run against live, shared workspace data. Assertions avoid depending on specific row content except `/entities/4` (UK Export Finance), inherited intent.
- Sign-in is performed per UI test (7 sign-ins per run), well under the documented 60 writes/min limit. A storageState setup project is a possible later optimisation.
