# Summary video script (about 3 minutes)

Speaker notes for the human recording. Every number below was read from the linked evidence on 4 Nov 2026 at 20:20.

## 1. Where the project was when I started (30 s)
SHOW: https://github.com/AlexKomanov/stonewake-final-repo, then `.itac/baseline/local-baseline-591c836.txt`.
SAY: "I inherited 20 Playwright tests, 10 API and 10 UI. On unchanged code, with zero retries, 10 passed and 10 failed.
The author's own last run failed the same ten, so this was deterministic breakage, not random flakiness. The repo also
committed `node_modules`, reports, and a `.env` with live credentials. CI only uploaded an artifact."

## 2. The issues I found (40 s)
SHOW: `docs/DEFECTS_AND_CHANGES.md` section 2.
SAY: "I checked each failure against the live API or the DOM before changing anything. Nine were test bugs: wrong health
path, `Token` instead of `Bearer`, reading `data` instead of `items`, Germany expected as GE, a stale search limit,
an `#email` id that doesn't exist, clicking a hidden checkbox, `/deal/` instead of `/deals/`, and a wrong tile test id.
The tenth was a real product issue. The EDD Dossiers page exists but has no sidebar link. Under all that were fixed
sleeps, seven copies of the login code, XPath selectors, and hard-coded secrets."

## 3. What I changed (40 s)
SHOW: the `src/` tree, `tests/backend` and `tests/ui`, `playwright.config.ts`, `.github/workflows/playwright.yml`.
SAY: "I split the code into layers. Infrastructure holds config and HTTP. Business holds typed API models, page objects
and fixtures. Tests are grouped by domain, and each inherited test is mapped with an `// inherited:` comment, so no
intent was lost. Locators are role and label based. The config uses retries 0, forbidOnly, and two projects. CI runs
typecheck, the tests, a credential scan of the report, and a public GitHub Pages report. Coverage went from 20 to 50
tests, chosen by risk: auth, pagination, rate limits, deal book, downloads, and UI-to-API parity."

## 4. How stability improved (40 s)
SHOW: `.itac/FIVE_GREEN.md` / `.itac/baseline/certification-runs.tsv`, then https://meyuval.github.io/itac-finals/
and one run page with its run number and SHA.
SAY: "Five consecutive GitHub Actions runs, numbers 1 to 5, on one frozen commit, 6abf104. Each run had 50 passed,
0 failed, 0 flaky, 0 skipped, with zero retries. Each run started only after the previous one finished, and none failed
in between. The before state was 10 of 20 failing."

## 5. Why it is more reliable now (30 s)
SAY: "There are no sleeps, retries, skips, or weakened assertions. Every wait is a web-first assertion. A negative
control showed a fixed assertion still fails on wrong data. Secrets are injected, never committed, and the report is
scanned before it's published. Product bugs went to SpiraTest as IN:81, IN:82 and IN:83 instead of being worked around
in tests. All AI usage is logged in `docs/AI_USAGE.md`."
