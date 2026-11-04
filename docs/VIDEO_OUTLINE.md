# Summary video outline (3–4 minutes)

Speaker notes for the human recording. Show the screen for each item; the numbers are real as of the time of writing
and should be read from the linked evidence, not from memory.

## 1. Initial condition (40 s)
- Show https://github.com/AlexKomanov/stonewake-final-repo: two spec files, `node_modules`, `.env` and reports committed.
- Show `.itac/baseline/local-baseline-591c836.txt`: 10 failed / 10 passed on the unchanged code, retries 0.
- Say: "The same ten failed for the author and for me, so this was deterministic breakage, not flakiness."

## 2. Problems discovered (50 s)
- Show `docs/DEFECTS_AND_CHANGES.md` §2: wrong health path, `Token` instead of `Bearer`, `data` vs `items`,
  Germany `iso2 GE`, search limit 50 vs 25, `#email`, hidden checkbox, `/deal/` vs `/deals/`, `tile-not_assessed`,
  and the EDD Dossier entry that does not exist in this workspace.
- Say: "Every root cause was checked against the live API or the DOM before changing a test. Nine were test defects,
  one was a workspace difference."
- Mention the committed credentials and that the organizers were asked to rotate them.

## 3. Changes made (60 s)
- Show the `src/` tree: infrastructure (config, HTTP transport), business (models, API facade, page objects, WebApp,
  fixtures), tests split by domain into `backend/` and `ui/` with `// inherited:` mapping comments.
- Show `playwright.config.ts`: retries 0, forbidOnly, two projects, baseURL from env.
- Show the workflow: typecheck, credential scan, artifact, Pages report; no cancel-in-progress.
- Show the three new tests (rate-limit contract, offset pagination, UI/API country parity).

## 4. How stability improved (40 s)
- Show https://meyuval.github.io/stonewake-final-repo/: the run table, 24 / 0 / 0 / 0 per run.
- Open one run: the banner with run number, commit and result; the list of 24 tests.
- Show `.itac/FIVE_GREEN.md`: five consecutive green Actions runs on the same commit, timestamps and links.

## 5. Why the result is more trustworthy (30 s)
- No sleeps, no retries, no skips; a negative control proved the fixed assertion fails on wrong data.
- Secrets injected, not committed; the report is scanned before publishing.
- Product observations filed in SpiraTest (IN:82 tile test-id, IN:83 unlinked EDD Dossiers/Signals) instead of being patched over in the tests.
- AI usage is logged in `docs/AI_USAGE.md` with the real prompts and the decisions taken.
