# Software Test Plan (STP) — Stonewake, ITAC 2026 final

| Field | Value |
|---|---|
| Version | 1.0 (4 Nov 2026, written against the inherited project; v0.1 was a pre-project draft from public docs) |
| Author | Yuval Menashe, with Claude Code (Claude Fable 5.1) as drafting assistant, see `docs/AI_USAGE.md` |
| SUT | Stonewake dashboard https://app.stonewake.ai and REST API https://api.stonewake.ai (MCP server out of scope this round) |
| Project | https://github.com/meyuval/itac-finals (submission repo; history forked from AlexKomanov/stonewake-final-repo via meyuval/stonewake-final-repo) |
| Unknowns | Marked **[UNKNOWN]** where not verified |

## 1. Executive summary

The inherited Playwright + TypeScript project had 20 tests in two flat files; 10 failed deterministically because of
test defects (wrong path, auth scheme, field name, expected value, selectors), credentials were committed, and there was
no structure, no configuration injection and no public report. This plan covers the stabilised and refactored suite:
50 tests (20 inherited scenarios preserved, 30 added; `api` 24, `chromium` 26), two Playwright projects (`api`, `chromium`), retries 0, secrets
injected from the environment, GitHub Actions with a public GitHub Pages report, and the evidence rules that make
"green" mean something. Evidence for the five consecutive green runs is kept in `.itac/FIVE_GREEN.md`.

## 2. Scope and assumptions

**In scope**
- Dashboard: sign-in and session boundary, sidebar navigation to all nine modules offered in the workspace, Deal Book
  search and deal page, Countries list/search/detail, Institutions search/detail, Portfolio tiles and row navigation.
- REST API (read-only, `/v1`): health, identity and rate-limit headers, authentication boundary, portfolio list/summary
  and pagination, institutions list/detail/errors, countries list/detail, search and input validation.
- Consistency between the dashboard and the API for the same record (country).

**Out of scope for this round (with reason)**
- MCP server, the network canvas graph, alert deliveries, and UI writes (UI-PF-06 add/remove a monitored company) because a
  write would change the counts that the parallel parity tests compare. API-AUTH-09 (`/org/api-keys` uniform 401) is
  excluded because the product fails it (SpiraTest IN:81); a failing test would not be hidden by a skip, so it is not in the certified suite.
- Admin-only writes (API keys, SCIM, SSO), alert deliveries: not available to the contestant account / not verifiable in CI.
- Cross-browser: chromium only, to keep five full runs inside the time budget.

**Assumptions**
- A1: One personal account in the competition workspace *itac-ja*; the account is shared by the inherited `.env`, so
  the organizers are asked to rotate it (see `docs/DEFECTS_AND_CHANGES.md` §5).
- A2: Workspace data is test data and may change between runs; assertions avoid pinning live counts and row contents,
  except the inherited `/entities/4` (UK Export Finance) check.
- A3: The 4 Nov product changes (22 changelog entries) are reflected in the current UI; "EDD Dossiers" is not offered in
  this workspace.

## 3. Risk analysis and priorities

| # | Area | Risk if broken | Priority | Coverage now |
|---|---|---|---|---|
| R1 | Sign-in, terms gate, session, sign-out | nothing else works; data exposure | High | `tests/ui/auth.spec.ts` (5 tests) |
| R2 | Authentication boundary on the API | data exposure | High | `health-and-auth.spec.ts` (uniform 401, bad keys) |
| R3 | Deal Book list/search/deal page | core workflow | High | `deal-book.spec.ts` |
| R4 | Portfolio statuses, summary vs list consistency | wrong credit colour | High | `portfolio.spec.ts` (API ×3, UI ×1) |
| R5 | Countries risk record, UI/API parity | wrong country risk | Medium-High | `countries.spec.ts` (API ×1, UI ×2) |
| R6 | Institutions list/detail/validation | wrong counterparty | Medium | `entities.spec.ts`, `institutions.spec.ts` |
| R7 | Search ranking bounds and validation | missed entity | Medium | `search.spec.ts` |
| R8 | Rate-limit contract | automation or agents throttled unexpectedly | Low-Medium | new test: remaining decreases per call |
| R9 | Navigation shell | module unreachable | Medium | `navigation.spec.ts` (9 modules) |

## 4. Coverage matrix

**T**: S smoke, P positive, N negative/boundary, D data consistency, A API, X access/security. Inherited scenarios keep
their original intent and carry an `// inherited: …` comment in code.

| Flow | Scenario | T | Origin | Spec |
|---|---|---|---|---|
| Auth | sign-in lands on Deal Book with sidebar | S | inherited ui 1 | `tests/ui/auth.spec.ts` |
| Auth | wrong password: message, stays on `/login`, no sidebar | N | inherited ui 2 | same |
| Auth | Sign in disabled until terms accepted; toggle back disables | N | inherited ui 3 | same |
| Auth | anonymous access to `/`, `/portfolio`, `/countries/DEU`, `/entities` redirects | X | inherited ui 4 | same |
| Auth | sign-out ends session; protected route redirects again | X | inherited ui 5 | same |
| Shell | each sidebar module opens its route and heading | S | inherited ui 6 (nine linked modules) | `navigation.spec.ts` |
| Shell | EDD Dossiers and Signals open by URL with their headings; sidebar link absent (documents IN:83) | P/D | inherited ui 6 destination, **new** test | same |
| Deal Book | filters visible, Deals tab selected, nonsense search → "No matching deals", deal opens with Briefing | P/N | inherited ui 7 | `deal-book.spec.ts` |
| Countries | search Germany → DEU page with Country risk and Data sources; nonsense search → none; ZZZ → not found | P/N | inherited ui 8 | `countries.spec.ts` |
| Countries | dashboard name and risk score equal the API record | D | **new** | same |
| Institutions | search UKEF isolates UK Export Finance (count 1); detail page title | P | inherited ui 9 | `institutions.spec.ts` |
| Portfolio | five status tiles visible; first monitored row opens its institution page with matching heading | P | inherited ui 10 | `portfolio.spec.ts` |
| API | `/health` public and shaped | S/A | inherited api 1 | `health-and-auth.spec.ts` |
| API | `/v1/me`: credential, role, team scope, rate-limit headers | A | inherited api 2 | same |
| API | rate-limit remaining decreases across two keyed calls | A/N | **new** | same |
| API | missing credential → uniform 401 on five routes | X | inherited api 3 | same |
| API | invalid/malformed credentials → same 401 body | X | inherited api 4 | same |
| API | portfolio list typed; limit bounds 100 / -1 / abc / 100000 | A/N | inherited api 5 | `portfolio.spec.ts` |
| API | offset pagination disjoint and consistent with total | A/D | **new** | same |
| API | summary buckets sum to active exposures = list total | D | inherited api 6 | same |
| API | entities list typed; detail equals list item | A/D | inherited api 7 | `entities.spec.ts` |
| API | entity 404 / 422 int_parsing / node 404 / anonymous 401 | N/X | inherited api 8 | same |
| API | countries ≥ 100, DEU record (iso2 DE, europe, risk 0–100), ZZZ 404 | A/N | inherited api 9 | `countries.spec.ts` |
| API | search hits scored; nonsense → []; missing q, short q, limit > 25 → 422 | A/N | inherited api 10 | `search.spec.ts` |

## 5. Test types and exclusions

Functional UI (chromium, headless), functional API (Playwright request context), data-consistency checks across layers.
No mocks: every test hits the live product, so failures can be real product defects. No visual, accessibility,
performance or MCP tests this round (see §11).

## 6. Environments, browsers, configuration

| Item | Value |
|---|---|
| Runtime | Node 22 in CI (ubuntu-latest), Node 26 locally (Windows 10) |
| Playwright | 1.64.1 pinned; chromium (Desktop Chrome device) |
| Config | `playwright.config.ts`: `fullyParallel`, `retries: 0`, `forbidOnly` in CI, workers 2 in CI, test timeout 60 s, expect timeout 10 s, `baseURL` from `STONEWAKE_APP_URL`, trace/screenshot on failure only |
| Secrets | `.env` locally (git-ignored); GitHub Actions secrets `STONEWAKE_EMAIL`, `STONEWAKE_PASSWORD`, `STONEWAKE_API_KEY`, scoped to the test and scan steps |
| Type safety | `tsconfig.json` strict; `npm run typecheck` in CI before tests |

## 7. Test data, fixtures, cleanup

- All tests are read-only against the product; nothing is created, so nothing needs cleanup.
- `config` (worker-scoped) validates the environment once; `api` / `anonApi` give authenticated and anonymous API
  facades; `app` gives a signed-out `WebApp`; `loggedInApp` signs in through the page object and verifies the Deal Book
  landing before the test starts. Each UI test gets its own browser context, so sign-out in one test cannot affect another.
- Expected values that come from the OpenAPI spec are constants in `API_LIMITS`; runtime data (first deal, first
  portfolio row) is read from the page, not hardcoded.

## 8. Execution and CI strategy

- Local: `npm test` (both projects), `npm run test:api`, `npm run test:ui`.
- CI (`.github/workflows/playwright.yml`): on push to `main` and manual dispatch; `npm ci` → typecheck → browser
  install → `npx playwright test` → credential scan of the HTML report → artifact → publish to `gh-pages` under
  `runs/<run number>/` with a banner (repository, run, commit, result, timestamp, link to the Actions run). Concurrency
  queues runs instead of cancelling them.
- Public report index: https://meyuval.github.io/itac-finals/ (one row per run with pass/fail/flaky/skipped). Earlier runs on the intermediate fork: https://meyuval.github.io/stonewake-final-repo/.

## 9. Flakiness controls

Web-first assertions only (`toHaveURL`, `toBeVisible`, `toHaveText`, `toBeChecked`); no `waitForTimeout`; role/label/
placeholder/test-id locators owned by page objects; a single sign-in implementation; status asserted before bodies are
read; `find()` results guarded; URL assertions tolerate the product's query strings; API limit bounds come from the spec.
Retries are disabled so a flaky test cannot hide behind a rerun.

## 10. Entry and exit criteria

Entry: secrets present, `npm run typecheck` clean, suite discovers 50 tests in two projects (24 api, 26 chromium).
Exit (certification): five consecutive successful full-suite GitHub Actions runs on one commit, retries 0, 0 skipped,
0 flaky, 50 passed, each with a public report, all five after the last change of code **and** credentials; recorded with run URLs, SHA and timestamps in `.itac/FIVE_GREEN.md`.

## 11. Defects, risks, known limitations

- Root causes of the ten inherited failures, product observations (P-1 test-id inconsistency → IN:82, P-2 EDD Dossiers/Signals unlinked → IN:83,
  P-3 `?from=portfolio`) and residual risks: `docs/DEFECTS_AND_CHANGES.md`.
- Residual risks from live, shared data (declared, not hidden):
  1. Parity tests read the API seconds before the UI assertion (UI-PF-02, UI-DB-01/03/04, UI-CTY-02); a product data
     refresh between the two reads fails them. That is real drift, not test logic.
  2. First-row dependence: API-DL-02 needs the top deal to have a sector and a 3-letter word in its name; UI-DB-09 needs a
     row with a "$" value; UI-PF-05 uses the newest transition; API-EN-04, UI-NET-03 and UI-NET-04-lite use the first book company.
  3. Branches that did not execute on today's data and are therefore not claimed as verified: ownership hop citations
     (first company's chain has no hops), screening and monitoring-target item fields (both lists empty), UI-PF-05's
     "Cause not available" branch, UI-NET-04-lite's owner branch.
  4. Every UI test signs in through the form; concurrent sign-ins with one account during a slow spell once left a probe
     on `/login`. Not seen in any full 2-worker run.
  5. Observations not filed as defects: unscored Portfolio Score cells are visually empty ("Not scored" only in the
     aria-label/title); deal names rendered with ", " where the API has " - "; Germany shows 5 breakdown rows vs 7 API rows
     because the page prints only components with data (documented in countries.md).
- Next coverage, in priority order: screenings read with sources; network/ownership chain via API; monitoring settings;
  deal exports (content-type and size); MCP `tools/list` and one data tool; axe-core smoke on login and Deal Book.

## 12. Evidence and references

- Baseline and local runs: `.itac/baseline/` (`local-baseline-591c836.txt`: 10 failed/10 passed; `phase1-run1.txt`:
  20 passed; `phase2-run2.txt`: 23 passed; `negative-control-api9.txt`).
- Five-run evidence: `.itac/FIVE_GREEN.md`. Status ledger: `.itac/JUDGE_STATUS.md`.
- Product docs used: `.itac/sut-docs/` (OpenAPI, changelog, errors, keys), `.itac/SUT_BRIEF.md`.
