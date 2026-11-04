# ITAC 2026 final — competition-day runbook (4 Nov 2026)

Recommended plan. The official rules are in [JUDGES_SOURCE_OF_TRUTH.md](JUDGES_SOURCE_OF_TRUTH.md). If the judges say something different at 17:30, their instructions win: write the change down here and in `.itac/JUDGE_STATUS.md`.

## Before 17:25 — ready at your station

- [ ] Laptop charging, on Wi-Fi, clock checked.
- [ ] Terminal open in `C:\Users\Yuval\Desktop\itac-finals` with Claude Code running.
- [ ] `gh auth status` works (account `meyuval`).
- [ ] Chrome: Jam.dev extension logged in, and SpiraTest logged in (username = your email).
- [ ] Screen recorder ready for the video (Windows Game Bar `Win+Alt+R`, OBS or Loom). Test the microphone once.
- [ ] Incognito window available for the link checks.
- [ ] Form open in a tab: https://forms.gle/5Gzxy1XheLwrFkxu6
- [ ] Practice workflow to copy: `meyuval/itac-practice-pipeline/.github/workflows/playwright.yml`.

## 17:25–18:00 — receive materials, listen, ask

- [ ] Save every link and file you receive (product URL, project repo, any credentials) in a local note. **Don't paste credentials into the repo or a public file.**
- [ ] Paste the briefing notes to Claude: *"Briefing notes: … Update the judge rules for anything new."*
- [ ] Q&A (17:50–18:00) — good questions also earn bonus points:
  - "Must the 5 green runs be GitHub Actions runs, and on the same commit?"
  - "Should the 5 runs be the full suite on one browser, or all configured browsers?"
  - "Should we keep the provided repo's history (fork), or may we push it into our own new repo?"
  - "How should a confirmed product bug that a test exposes be handled: a failing test, `test.fail` with a SpiraTest ID, or something else?"
  - "Is there a SpiraTest project or release we should report against?"

## 18:00–18:20 — get the project and measure the baseline (M1)

1. Tell Claude: **"Here is the project: <link>. Get it into a public repo of mine, keeping its history, and run an honest baseline."**
   - If it's on GitHub, the best option is to **fork it** (history is kept, so the baseline is visible). Otherwise push it into `meyuval/itac-finals`; Claude will handle the LICENSE commit already there.
2. Claude runs the original tests unchanged, **2–3 times**, and records the number of tests, passed, failed, flaky and skipped, plus the starting commit, in `.itac/JUDGE_STATUS.md`.
3. Claude sets up the Actions workflow and the Pages report **early**, so the pipeline is proven before the code changes.
4. You check: the repo is public, and Actions and Pages are turned on.

## 18:20–19:30 — stabilize, then refactor (M2, M3)

- Prompt: **"Find the root cause of each failure and flaky test and fix it. Log each cause and fix."**
- Rule: fix the real cause (waiting for the page's actual state, better selectors, test data isolated per test, reliable login). **No** skipping tests, weakening assertions, fixed sleeps or hidden retries.
- When a failure is a **real product bug**: reproduce it by hand, record it in Jam.dev, and file it in SpiraTest right away (see [BUG_REPORT_STANDARD.md](BUG_REPORT_STANDARD.md)). Give the SpiraTest ID to Claude. Don't leave bug filing to the end.
- Refactor modestly: page objects or fixtures, config, removing duplication. Keep what the original tests check.
- Commit in small steps. Claude keeps `docs/AI_USAGE.md` and the change and defect log up to date as you go.

## 19:30–19:50 — add coverage (M4)

- Prompt: **"Add the most valuable missing scenarios, ranked by risk, with real assertions."** See [COVERAGE_AND_STP_CHECKLIST.md](COVERAGE_AND_STP_CHECKLIST.md).
- Quality over quantity. Each new test must pass reliably several times locally before it goes in.

## By about 19:50 — freeze the code and run the five green (M5)

- **Freeze time:** 5 × (one full CI run) + 15 min, counted back from **20:30**. If one run takes 5 minutes → freeze by about 19:50. If it takes 10 minutes → freeze by about 19:30.
- Prompt: **"Freeze. Run 5 sequential GitHub Actions runs on this commit, zero retries, and record the evidence."**
- Runs one after another, never queued together. **A red run breaks the streak**: find the cause, fix it, and start the five again on the new commit.
- While the runs are going, write the documents (next section). Don't change code.

## While CI runs — documents (M6, M7, M10)

Prompt: **"Write the README, STP and defect/change log from the evidence."** You review them.
- README: summary first, how to run the tests, structure, what changed and why, before/after stability, the **3 links**, known limitations, the **AI section** ([AI_USAGE_RULES.md](AI_USAGE_RULES.md)).
- `docs/STP.md`: scope, risks, coverage matrix, environments, data, CI, flakiness controls, entry and exit criteria, residual risks.
- Defect log: SpiraTest IDs + Jam links; automation issues fixed; what is still unknown.
- Committing documents only creates a new commit. Proof of the five green runs stays tied to the frozen code commit; Claude records which commit was certified.

## 20:20–20:40 — video (M9)

Record a short video (about 3–5 minutes) covering:
1. what state the project was in at the start (baseline numbers)
2. which problems you found
3. what you changed
4. how stability improved (five green runs, zero retries)
5. why the project is more trustworthy now

Claude can write the speaking notes; you record and upload. Make sure the video link opens **without logging in**.

## 20:40–20:50 — check the links and submit (M6, M11)

- [ ] In an **incognito** window, open each link: the repo, the specific Actions run, the report (Pages), the video. All open without logging in and show the same project and commit.
- [ ] Every SpiraTest bug is filed and its ID is in the defect log.
- [ ] Fill in the form and **submit by 20:50**. Don't wait until 21:00: the form closes at exactly 21:00.
- [ ] Take a screenshot of the submission confirmation.

## If you're running out of time (priority order)

1. One honest green Actions run with a public report and working links
2. Bugs filed in SpiraTest (the system locks at 21:00)
3. README with the AI section + the video
4. As many consecutive green runs as possible; report the real count, never round up
5. STP and defect log
6. Extra coverage or bonus items (Docker, visual testing, self-healing) only if everything above is done
