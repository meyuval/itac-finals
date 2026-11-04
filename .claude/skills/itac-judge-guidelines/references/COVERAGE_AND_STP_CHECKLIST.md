# Coverage and STP checklist — RECOMMENDED, not an official ITAC rule

**Status:** recommended practice, adapted on 4 Nov 2026 from the `test-plan-generator`, `prd-analyzer` and `qa-competition-tester` skills (built for another competition). It supports M4 (coverage with a risk-based rationale) and M7 (STP). Use it as a thinking checklist; the inherited project and the SUT decide what is in scope. Their bundled Python scripts need an OpenAI API key and Linux paths, and were deliberately not imported.

## 1. Risk-rank the product flows first

Classify each SUT flow or requirement and rank it by the impact of a failure:

| Category | Examples |
|---|---|
| Auth | login, logout, session, password reset |
| Payment / cart | checkout, pricing, coupons, totals |
| Business logic | rules, limits, quotas, state transitions |
| Data | create, read, update and delete; persistence; integrity |
| UI/UX | validation messages, layout, accessibility |
| API / integration | status codes, third-party services |
| Security (light) | access control between users, input handling |

Priority: **High** = core flow broken, data or security impact · **Medium** = validation, error handling, redirects · **Low** = cosmetic. Add coverage in priority order, and write a single line of rationale for each new test or group of tests.

## 2. Coverage types: mark each as in scope or out of scope, with a reason

- [ ] **Smoke:** critical paths load and work
- [ ] **Positive:** happy paths with valid input
- [ ] **Negative / boundary:** invalid input, empty values, limits, error messages
- [ ] **State and data:** create, then verify, then clean up; persistence after reload
- [ ] **Access control:** user B can't see user A's data (only if the SUT has users)
- [ ] **API checks:** only where the UI depends on them; prefer UI-level tests for this event
- [ ] **Cross-browser:** Playwright projects (chromium, firefox, webkit) if the CI time budget allows
- [ ] **Responsive:** one mobile viewport project (e.g. Pixel 7, iPhone 15) if relevant
- [ ] **Resilience (optional):** slow network or a mocked failed request for the error UI
- [ ] **Visual (bonus):** `toHaveScreenshot` on stable pages only

Every extra browser or project multiplies CI time × 5 for the five-green certification. Budget before adding.

## 3. Deterministic preconditions (prevents both flakiness and false bugs)

A test must create its own state and never assume it:

- **Unique test data per test** (e.g. `user+${Date.now()}-${workerIndex}@…`). Never rely on data left behind by another test.
- **Authentication through a setup project or fixture** (`storageState`), not by copying UI login steps into every test.
- **Data created before the test acts on it**, through the UI or an API, and checked before use.
- **Two-user tests** create both users explicitly.
- **Clean up** what the test created, or isolate it so leftovers don't matter.
- **Anti-patterns:** "user is logged in", "an order already exists", or a hard-coded ID with no setup that produces it.

## 4. Reporting structure (lessons from earlier judge feedback)

In the README, STP and summary report, put the **executive summary first**: initial state, what changed, current stability (the five-green evidence), the most important defects found, and residual risks. Then the details:

- a table of planned vs. executed vs. passed tests (before and after)
- defects by severity (table or chart) and by area
- a coverage matrix: flow × test type × spec file
- the automation scripts and workflows used, with links
