# Software Test Plan (STP) — Stonewake, ITAC 2026 final

| Field | Value |
|---|---|
| Version | 0.1 DRAFT (pre-project, written 4 Nov 2026 17:40 from public docs only) |
| Author | Yuval Menashe, with Claude Code (Fable 5.1) as drafting assistant, see `docs/AI_USAGE.md` |
| SUT | Stonewake dashboard https://app.stonewake.ai, REST API https://api.stonewake.ai, MCP https://mcp.stonewake.ai/ |
| Status of unknowns | Marked **[UNKNOWN]**. To be resolved once the inherited project, the Stonewake invite and the Q&A answers arrive. |

## 1. Executive summary

The final asks us to take over an existing, unreliable Playwright + TypeScript project, make it trustworthy, extend it, and prove it with five consecutive green runs and public links. This plan sets scope, risk priorities and the coverage matrix for the six flows the Stonewake team recommended, and the rules we follow so that green means real.

Baseline numbers, defects and the five-run evidence are **[UNKNOWN]** until the project is received and run. They will be filled in here and in `.itac/JUDGE_STATUS.md` as work happens.

## 2. Scope and assumptions

**In scope**
- The six recommended flows (section 4), on the dashboard, plus read-only verification of the same data over the REST API and the MCP server.
- Stabilising and refactoring the inherited suite without losing its original test intent.
- Product bugs found on the way, reported in SpiraTest with Jam.dev evidence.
- Light performance (response-time budgets on the API) and security (auth boundary, rate limiting, headers) checks, as the organizers said both are in scope.

**Out of scope for the 3-hour window (with reason)**
- Writes that the product offers only to admins (API-key creation, SCIM, SSO). Reason: we may not hold admin rights, and the risk of locking the competition workspace is high.
- Alert deliveries by SMS, email, Teams or webhook. Reason: needs external receivers; not verifiable in CI.
- Screening and EDD dossier *completion*. Reason: long-running, asynchronous jobs that depend on external providers; we test the request and the read of an existing result instead.
- Full cross-browser matrix. Reason: each extra browser multiplies the five-run CI time. Decision: chromium only for certification, unless the inherited config already runs more and stays within budget. **[UNKNOWN]**

**Assumptions**
- A1: Each contestant gets one personal account in a competition workspace full of test data (ITAC email, 4 Nov 17:25).
- A2: The workspace is a sandbox where person data is switched off, so person lookups answer 404 by design, not by defect (docs: data-handling, mcp). Verify on login.
- A3: An API key may or may not be available to us (keys are created by a workspace admin). If none, the API/MCP flow is tested only for the unauthenticated boundary and `/health`, and the gap is disclosed.
- A4: The product changed heavily on 4 Nov 2026 (22 changelog entries). Many inherited failures are expected to be real UI changes, not flakiness.

## 3. Risk analysis and priorities

| # | Area | Risk if broken | Priority | Why |
|---|---|---|---|---|
| R1 | Login and session | Nothing else can be tested; CI cannot run | High | Supabase auth, mandatory terms checkbox, magic-link alternative |
| R2 | Deal Book list, search, filters, order | Core origination workflow, wrong deals shown or hidden | High | Complex rules: priority order, held-back deals, whole-word search, filter counts |
| R3 | Deal page: summary, sources, export | Wrong or uncited facts reach a credit committee | High | Export to Excel, PDF report, PPTX deck; every claim must cite a source |
| R4 | Portfolio statuses and status-change causes | Credit decisions on wrong colour | High | Six statuses; add-to-book; causes named per change |
| R5 | Countries score and indicators | Wrong country risk | Medium-High | Deterministic formula with published weights; "Not scored" rule |
| R6 | Network, ownership chain, financing | Wrong beneficial owner or lender | Medium-High | Canvas graph (no text alternative); ownership chain is tabular and testable |
| R7 | Screenings read with sources | Missed adverse media | Medium | Request is async; verify reading an existing screening and its sources |
| R8 | Monitoring settings (frequency, pause/resume) | Stale research | Medium | Was restructured today (Following tab, settings page) |
| R9 | API/MCP parity with UI | Agents receive different data than humans | Medium | Docs promise same values, dates and order |
| R10 | Auth boundary, rate limiting, security headers | Data exposure | Medium | Uniform 401 bodies, RateLimit headers, CSP, HSTS, X-Frame-Options |
| R11 | Accessibility basics | Compliance target WCAG 2.1 AA; known gaps admitted | Low | Only if time allows; one axe-core smoke on two pages |

## 4. Application flows and coverage matrix

Spec file names are the planned layout; they will be aligned with the inherited structure. **T** = test type: S smoke, P positive, N negative/boundary, D data/state, A API, X access/security.

| Flow | Scenario | T | Priority | Planned spec |
|---|---|---|---|---|
| Auth | Login with valid credentials via setup project, `storageState` reused by all tests | S | High | `auth.setup.ts` |
| Auth | Login refused without accepting Evaluation Terms; wrong password shows an error, no redirect | N | High | `auth.spec.ts` |
| Auth | Protected route redirects to `/login` when signed out | X | High | `auth.spec.ts` |
| Deal Book | List renders rows with Deal, Financing window, Value, Parties, Score, Last activity columns | S | High | `deal-book.spec.ts` |
| Deal Book | Search keeps only rows that show every typed word; quoted phrase is exact; empty result names the filters and offers Clear | P/N | High | `deal-book.spec.ts` |
| Deal Book | Stage filter lists only rows that read the chosen financing window; Filters button shows a count of active filters | P | High | `deal-book.spec.ts` |
| Deal Book | Default order: Financing open, then Early stage, then Not confirmed; highest score first inside each group | D | High | `deal-book.spec.ts` |
| Deal Book | Each list page has its own address; browser Back returns to the previous page | P | Medium | `deal-book.spec.ts` |
| Deal Book | Held-back deals: count shown, toggle reveals them | P | Medium | `deal-book.spec.ts` |
| Deal page | Opening a deal shows Stage, Key facts, summary lines each citing a source; source link opens a quote with URL and date | P | High | `deal-page.spec.ts` |
| Deal page | Export downloads an `.xlsx`; file is non-empty and contains the visible deal names | D | High | `deal-export.spec.ts` |
| Deal page | Download report produces a PDF (content-type and size asserted) | D | Medium | `deal-export.spec.ts` |
| Screenings | Screenings list shows existing screenings; opening one shows findings with sources and official lists section | P | Medium | `screenings.spec.ts` |
| Screenings | Requesting a screening for a company creates a new row in a non-final state (no wait for completion) | D | Medium | `screenings.spec.ts` |
| Network | Company page shows ownership chain hop by hop, each hop with a citation | P | High | `network.spec.ts` |
| Network | Financing section lists charges / listed debt with coverage states; Export CSV downloads rows with citations | D | Medium | `network.spec.ts` |
| Network | "How are A and B connected?" returns a path or a clear "no path" message | P | Low | `network.spec.ts` |
| Countries | List shows risk 0–100, band strip counts; clicking a band filters the list | P | High | `countries.spec.ts` |
| Countries | A "Not scored" country shows its reason on hover and no number | N | Medium | `countries.spec.ts` |
| Countries | Country page breakdown: component weights sum to 100 and the printed total equals the weighted sum | D | High | `countries.spec.ts` |
| Countries | Export downloads a workbook; "No value on record" instead of blank cells | D | Medium | `countries.spec.ts` |
| Portfolio | Counts strip equals the sum of rows per status in the book | D | High | `portfolio.spec.ts` |
| Portfolio | Add a company to the monitored book, verify the row and the "Added to the book" review record, then remove it with a reason (cleanup) | D | High | `portfolio.spec.ts` |
| Portfolio | Adding the same company twice is refused with a message naming the existing entry | N | Medium | `portfolio.spec.ts` |
| Portfolio | Status change row names a cause; acknowledge removes it from open changes | P | Medium | `portfolio.spec.ts` |
| Monitoring | Following tab lists followed deals/names; Follow a name adds one; Monitoring page shows it with frequency; pause then resume toggles status | D | Medium | `monitoring.spec.ts` |
| API | `/health` returns ok; `/v1/*` without key returns 401 with `error.code = unauthenticated`; bad key gets the identical body | X/A | High | `api-boundary.spec.ts` |
| API | `RateLimit-Policy` header present on every `/v1` response | A | Medium | `api-boundary.spec.ts` |
| API (if key) | `GET /v1/deals` items match the first page of the UI Deal Book (names and order); `GET /v1/countries/{iso3}` risk equals the country page score | A/D | High | `api-parity.spec.ts` |
| MCP | `tools/list` returns the documented tools; tool call without key returns JSON-RPC `-32001` | A | Medium | `mcp.spec.ts` |
| MCP (if key) | `deal_book` result equals `GET /v1/deals` for the same filter | A/D | Medium | `mcp.spec.ts` |
| Security | Security headers on the app (CSP, HSTS, X-Frame-Options DENY, nosniff) | X | Low | `security-headers.spec.ts` |
| Performance | API p95 for `/health` and one list endpoint under a stated budget, measured in CI and reported, not asserted hard unless stable | A | Low | `perf-smoke.spec.ts` |

Coverage will be reported as scenario count per flow, not as raw test count.

## 5. Test types and exclusions

| Type | In scope | Note |
|---|---|---|
| Smoke | Yes | Login, each module loads |
| Positive | Yes | Per flow above |
| Negative / boundary | Yes | Empty search, bad login, duplicate add, unauthenticated API |
| State and data | Yes | Add then verify then remove; export files parsed |
| Access control | Partial | Signed-out redirect, API 401. Two-user isolation: **[UNKNOWN]**, needs a second account |
| API | Yes | Unauthenticated boundary always; authenticated parity only with a key |
| Cross-browser | No for certification | Chromium only; firefox/webkit optional nightly project, off by default |
| Responsive | Optional | One mobile viewport test of Deal Book block layout if time allows |
| Visual (bonus) | Optional | `toHaveScreenshot` on the login page and Countries band strip, masked dynamic text |
| Accessibility | Optional | One axe-core scan, informational |

## 6. Environments, browsers, configuration

- SUT: live product, competition workspace. Base URL `https://app.stonewake.ai`. API `https://api.stonewake.ai`.
- Local: Windows 10, Node.js LTS, Playwright (version pinned to the inherited project's, upgraded only if required and documented).
- CI: GitHub Actions `ubuntu-latest`, chromium, `workers` tuned to the SUT's signed-in rate limit (2,190 reads/min is generous; keep workers ≤ 4). Report published to GitHub Pages, public.
- Secrets: `SW_EMAIL`, `SW_PASSWORD`, optional `SW_API_KEY` as GitHub Actions secrets. Never in the repo. `storageState` and `.auth/` gitignored.
- Retries: `0` for the certification runs. If the inherited config has retries, they are reported and first-attempt pass is distinguished from eventual pass.
- Timeouts: expect ≤ 10 s, test ≤ 60 s; downloads and PDF generation get an explicit longer budget per test.
- Traces: `on-first-retry` or `retain-on-failure`; traces are sanitized (no auth headers) before publishing. If sanitizing cannot be guaranteed, traces are kept as workflow artifacts only and the Pages report shows screenshots.

## 7. Test data, fixtures, cleanup

- One personal account; login once in `auth.setup.ts`, reuse via `storageState`.
- Read-only flows use data that exists in the workspace. Tests pick the **first visible row** at run time and assert relationships (e.g. a deal page shows the same name as the row clicked), never hard-coded IDs.
- Write flows (add to book, follow a name, request screening) create their own state with a unique marker where the product allows it, verify, then clean up (Remove from book with reason, unfollow). If cleanup fails, the test fails loudly rather than leaving silent leftovers.
- Downloads are saved to a per-test temp directory and parsed (xlsx via a small reader, PDF by magic bytes and size).
- Person data: not expected in the sandbox (A2). No test depends on it.

## 8. Execution and CI strategy

1. Baseline: run the inherited suite unchanged 2–3 times locally and once in Actions; record pass/fail/flaky/skip and commit SHA.
2. Stabilise by root cause (sync to visible state, semantic locators, isolated data, reliable auth). Check `.itac/sut-docs/changelog.md` for same-day product changes before rewriting a locator.
3. Refactor modestly: page objects per module, shared fixtures, config cleanup. Preserve test intent.
4. Add coverage in the priority order of section 4.
5. Freeze: `freeze time = 20:30 − 5 × (measured CI wall-clock) − 15 min`. Then five sequential `workflow_dispatch` runs on one SHA, zero retries, dispatched one after another (same concurrency group cancels queued runs).
6. Publish: README links to the run and the report; the report names run and SHA.

## 9. Flakiness controls

- Web-first assertions only (`expect(locator).toBeVisible()` etc.), no `waitForTimeout`.
- Locator priority: `getByRole` → `getByText`/`getByPlaceholder` (many fields have placeholder-only labels) → `getByTestId` where the product exposes one → CSS as last resort with a comment.
- Network-dependent pages: wait for the specific row or heading, not for `networkidle`.
- Rate-limit awareness: ≤ 4 workers; API tests reuse one request context; a 429 is treated as an environment failure and reported with `Retry-After`.
- No `test.skip`, `.only`, `continue-on-error`, or weakened assertions to get green. Any quarantine is disclosed in the README.

## 10. Entry and exit criteria

**Entry**: account works in a browser; inherited project runs locally; Actions and Pages enabled on the public repo.

**Exit (for submission)**: five consecutive green Actions runs on one SHA with zero retries; README with three public links verified signed-out; this STP at version ≥ 1.0 with real numbers; defect log with SpiraTest IDs; AI usage section; video link.

## 11. Defects, risks, known limitations

- Defect log: `docs/DEFECTS.md` **[to be created]**, separating product bugs (SpiraTest ID + Jam link), automation bugs fixed, and open investigations.
- Known product observations already noted (not yet bugs): docs say 38 MCP tools, server lists 40; ITAC email typo `aoi.stonewake.ai`.
- Residual risks: single account (no two-user isolation); async screenings not verified to completion; live data can change during the run (tests assert relationships, not fixed values); API parity depends on a key we may not get.

## 12. Evidence and references

- Judge ledger: `.itac/JUDGE_STATUS.md`
- SUT brief and offline docs: `.itac/SUT_BRIEF.md`, `.itac/sut-docs/`
- Five-run proof, links, SpiraTest IDs: **[UNKNOWN]**, to be added.
