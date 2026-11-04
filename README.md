# Stonewake test automation (ITAC 2026 final)

Playwright + TypeScript tests for **Stonewake** (https://app.stonewake.ai, https://api.stonewake.ai), inherited from
[AlexKomanov/stonewake-final-repo](https://github.com/AlexKomanov/stonewake-final-repo) and stabilised, refactored and
extended on 4 Nov 2026 by Yuval Menashe.

| Link | URL |
|---|---|
| Repository (this fork) | https://github.com/meyuval/stonewake-final-repo |
| GitHub Actions workflow | https://github.com/meyuval/stonewake-final-repo/actions/workflows/playwright.yml |
| Public execution reports (one per run, with run number and commit) | https://meyuval.github.io/stonewake-final-repo/ |
| Five consecutive green runs (evidence table) | [.itac/FIVE_GREEN.md](.itac/FIVE_GREEN.md) |
| Test strategy (STP) | [docs/STP.md](docs/STP.md) |
| Defects, root causes and changes | [docs/DEFECTS_AND_CHANGES.md](docs/DEFECTS_AND_CHANGES.md) |
| AI usage (tools, prompts, AI-changed areas) | [docs/AI_USAGE.md](docs/AI_USAGE.md) |

## Before and after

| | Inherited (commit `b4f92c9`) | Now |
|---|---|---|
| Tests | 10 API + 10 UI in two flat files | 23 (20 inherited scenarios preserved + 3 new) in 11 files, two projects |
| Local result, retries 0 | 10 failed / 10 passed (3.1 min) | 23 passed (about 40 s locally, 2 workers in CI) |
| Secrets | `.env`, API key and password committed and hardcoded | environment / GitHub secrets only; report scanned for credentials before publishing |
| Waits | 3 fixed sleeps, `page.url()` checks | web-first assertions only |
| Structure | none | infrastructure / business / tests layers, fixtures, page objects |
| CI | artifact only (login required), `cancel-in-progress` | queued runs, type-check, public report on GitHub Pages stamped with run + SHA |

All ten inherited failures were deterministic test defects (wrong path, auth scheme, field name, expected value, selector),
except one sidebar entry that does not exist in the competition workspace. Details and evidence: `docs/DEFECTS_AND_CHANGES.md`.

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
    http/api-client.ts       APIRequestContext transport: base URL, auth header, JSON parsing
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

## Known limitations

- The inherited git history still contains the original `.env` and trace files; history was not rewritten to keep
  provenance. The organizers have been asked to rotate those credentials.
- Tests run against the live, shared competition workspace; one inherited test relies on institution `/entities/4`.
- "EDD Dossiers" is listed in the product changelog but not offered in this workspace, so it is not covered.

## AI usage

Built with Claude Code (model Claude Fable 5.1) under the organizers' AI-transparency rule. The log of the main prompts,
what the AI produced, what the human decided, and which files were created or changed with AI is in
[docs/AI_USAGE.md](docs/AI_USAGE.md). In short: AI drafted the audit, the layered refactor, the CI workflow and the
documentation; every change was reviewed and the root causes were verified against the live product before fixing.
