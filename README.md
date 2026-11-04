# Stonewake test automation (ITAC 2026 final)

Playwright + TypeScript tests for **Stonewake** (https://app.stonewake.ai, https://api.stonewake.ai), inherited from
[AlexKomanov/stonewake-final-repo](https://github.com/AlexKomanov/stonewake-final-repo) and stabilised, refactored and
extended on 4 Nov 2026 by Yuval Menashe.

| Link | URL |
|---|---|
| Repository (submission) | https://github.com/meyuval/itac-finals (history: forked from AlexKomanov/stonewake-final-repo; the intermediate fork meyuval/stonewake-final-repo holds the earlier certification runs) |
| GitHub Actions workflow | https://github.com/meyuval/itac-finals/actions/workflows/playwright.yml |
| Public execution reports (one per run, with run number and commit) | https://meyuval.github.io/itac-finals/ |
| Five consecutive green runs (evidence table) | [.itac/FIVE_GREEN.md](.itac/FIVE_GREEN.md): commit `6abf104`, runs [#1](https://github.com/meyuval/itac-finals/actions/runs/41882894791)–[#5](https://github.com/meyuval/itac-finals/actions/runs/41884761006), 50/50 each, retries 0 |
| Latest certified run and its report | https://github.com/meyuval/itac-finals/actions/runs/41884761006 → https://meyuval.github.io/itac-finals/runs/5/ |
| Test strategy (STP/STR) | [docs/Stonewake_ITAC2026_STP_STR_v4.pdf](docs/Stonewake_ITAC2026_STP_STR_v4.pdf) |
| Defects, root causes and changes | [docs/DEFECTS_AND_CHANGES.md](docs/DEFECTS_AND_CHANGES.md) |
| AI usage (prompts log, AI-changed areas) | [prompts log](docs/AI_PROMPTS_LOG.md) · [AI-changed areas](docs/AI_CHANGED_AREAS.md) |

## Before and after

| | Inherited (commit `b4f92c9`) | Now |
|---|---|---|
| Tests | 10 API + 10 UI in two flat files | 50 (20 inherited scenarios preserved + 30 new) in 16 files; projects `api` (24) and `chromium` (26) |
| Local result, retries 0 | 10 failed / 10 passed (3.1 min) | 50 passed twice back to back (1.9 min each, `CI=true`, 2 workers) |
| Secrets | `.env`, API key and password committed and hardcoded | environment / GitHub secrets only; report scanned for credentials before publishing |
| Waits | 3 fixed sleeps, `page.url()` checks | web-first assertions only |
| Structure | none | infrastructure (config, HTTP + binary transport, file magic bytes) / business (models, API facade, page objects, WebApp, fixtures) / tests layers |
| CI | artifact only (login required), `cancel-in-progress` | queued runs, type-check, public report on GitHub Pages stamped with run + SHA |

All ten inherited failures were deterministic test defects (wrong path, auth scheme, field name, expected value, selector),
except one sidebar link that is not rendered in the competition workspace although its page exists (filed as SpiraTest IN:83). Details and evidence: `docs/DEFECTS_AND_CHANGES.md`.

## Setup and run

Requirements: Node.js 22 or newer (CI uses 22; developed on 26), npm.

```bash
npm ci
npx playwright install chromium        # add --with-deps on Linux CI images
cp .env.example .env                   # then fill STONEWAKE_EMAIL, STONEWAKE_PASSWORD, STONEWAKE_API_KEY
npm run typecheck
npm test                               # full suite, both projects, retries 0
npm run test:api                       # backend project only
npm run test:ui                        # chromium UI project only
npm run report                         # open the last HTML report
```

Environment contract (`.env.example`):

| Variable | Purpose |
|---|---|
| `STONEWAKE_APP_URL` | dashboard base URL (default https://app.stonewake.ai) |
| `STONEWAKE_API_URL` | API base URL (default https://api.stonewake.ai) |
| `STONEWAKE_EMAIL`, `STONEWAKE_PASSWORD` | dashboard sign-in for UI tests |
| `STONEWAKE_API_KEY` | `swk_live_…` key for backend tests |

Never commit `.env`. In CI the same names are GitHub Actions secrets.

## Architecture

```
src/
  infrastructure/            generic, no product knowledge
    config/env.ts            loads .env if present, validates STONEWAKE_*, exports typed Config
    http/api-client.ts       APIRequestContext transport: base URL, auth header, JSON parsing, binary GET
    files/magic-bytes.ts     file-type detection for downloaded PDF/PPTX/XLSX payloads
  business/                  Stonewake knowledge
    models/api.ts            typed API models (PageOf<T>, PortfolioItem, Country, ErrorEnvelope, ...)
    api/stonewake-api.ts     one method per endpoint; documented limits in API_LIMITS
    pages/*.page.ts          page objects (role/label/test-id locators only)
    app/web-app.ts           WebApp: typed entry point exposing the page objects for one Page
    fixtures/index.ts        test.extend: config (worker), api, anonApi, app, loggedInApp
tests/
  backend/*.spec.ts          project "api"
  ui/*.spec.ts               project "chromium"
scripts/ci/                  report-site builder used by the workflow
```

Dependency direction: infrastructure imports nothing from business or tests; business imports infrastructure; tests use
fixtures and business APIs. Tests state scenarios and expected outcomes; selectors and request details live below them.

## Stability policy

- `retries: 0` in `playwright.config.ts`; no `test.skip`, no `.only` (`forbidOnly` in CI), no fixed sleeps.
- Each UI test signs in through the `loggedInApp` fixture, which verifies the Deal Book landing before the test runs.
- API tests go through one `ApiClient`, so the auth scheme cannot drift between tests again.
- Expected values that come from the OpenAPI spec (limits, messages) are named constants.
- Five consecutive green GitHub Actions runs on one commit are recorded in `.itac/FIVE_GREEN.md`.

## CI and the public report

`.github/workflows/playwright.yml` runs on every push to `main` and on manual dispatch:
`npm ci` → `npm run typecheck` → `npx playwright test` (retries 0, 2 workers) → scan the HTML report for credentials →
upload the report as an artifact → publish it to the `gh-pages` branch under `runs/<run number>/` with a banner naming
the run, the commit and the result. The site index lists every published run. Runs are queued, never cancelled.

### How to execute the GitHub Actions workflow

1. Repository secrets (Settings → Secrets and variables → Actions): `STONEWAKE_EMAIL`, `STONEWAKE_PASSWORD`, `STONEWAKE_API_KEY`.
2. Run it: push to `main`, or open **Actions → Playwright → Run workflow** (optional label input), or from a terminal:
   `gh workflow run playwright.yml -R meyuval/itac-finals --ref main`, then `gh run watch -R meyuval/itac-finals`.
3. Results: the run's summary page shows counts and the report link; the report is at
   https://meyuval.github.io/itac-finals/runs/<run number>/ and the HTML report is also attached as an artifact.
4. Five consecutive green runs: [.itac/FIVE_GREEN.md](.itac/FIVE_GREEN.md).

## New coverage (risk-based, test IDs from `docs/test-plan.html`)

- API: deals list/detail/documents (API-DL-01/02/05/06), rate-limit policy and team scope (API-AUTH-05/06), transitions feed (API-PF-06), country scoring rules (API-CT-01/02), node and ownership routes (API-EN-04), screenings and monitoring reads (API-SC-01, API-MON-01), plus the earlier rate-limit, pagination and country-parity tests.
- UI: Deal Book parity, filters, search, ordering and downloads (UI-DB-01/03/04/06/09/11), Portfolio parity and status-change causes (UI-PF-02/04/05), Countries band strip and breakdown parity (UI-CTY-02/04), Network/company page (UI-NET-03, UI-NET-04-lite), Monitoring Research/Sentiment views, EDD Dossiers/Signals by URL.
- Parity tests read the API in the same test, seconds before the UI assertion, and assert relationships (equal totals, sums, ordering, documented bounds), never observed literals.

## Known limitations

- The inherited git history still contains the original `.env` and trace files; history was not rewritten to keep
  provenance. The organizers have been asked to rotate those credentials.
- Tests run against the live, shared competition workspace; one inherited test relies on institution `/entities/4`.
- "EDD Dossiers" and "Signals" have no sidebar link in this workspace; their pages are covered by direct URL and the missing link is filed as SpiraTest IN:83.
- Parity tests compare live counts read seconds apart; a product data refresh between the two reads fails them by design (genuine drift, not test logic). Some tests use the first row of a live list (top deal, newest transition, first book company), and some branches did not execute on today's data (ownership hop citations, screening and monitoring-target item fields, the "Cause not available" branch). These are listed in the STP/STR ([docs/Stonewake_ITAC2026_STP_STR_v4.pdf](docs/Stonewake_ITAC2026_STP_STR_v4.pdf)).
- Not implemented: UI-PF-06 (add/remove a monitored company) because it mutates the book while parity tests count it; API-AUTH-09 (`/org/api-keys` uniform 401) because the product fails it (SpiraTest IN:81).

## AI usage

Built with Claude Code (model Claude Fable 5.1; Claude Opus 5.5 subagents) under the organizers' AI-transparency rule.
Other AI tools: **ChatGPT** turned our instructions into better prompts for Claude Code. **Gemini** transcribed the
competition's opening session and Luca's product review. Neither touched the code.

- Main prompts log: [docs/AI_PROMPTS_LOG.md](docs/AI_PROMPTS_LOG.md)
- Parts created or changed with AI: [docs/AI_CHANGED_AREAS.md](docs/AI_CHANGED_AREAS.md)

AI produced most of the code. In short: AI drafted the audit, the layered refactor, the CI workflow and the
documentation; the 30 new tests were implemented by a second Claude Code session using seven parallel subagents, one per
test group, each verifying its locators against a live DOM snapshot; every change was reviewed and the root causes were
verified against the live product before fixing.
