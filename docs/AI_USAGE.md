# AI usage (ITAC 2026 final, 4 Nov 2026)

Kept during the work, not reconstructed afterwards. Times are Asia/Jerusalem (±3 min where marked "~"). Prompts are
the user's real wording, typos kept; rows marked "(summary)" paraphrase a prompt whose wording was not preserved.
No credential values appear in this file (scanned 19:45 against the three live secrets; the only `swk_live_` strings
in the repo docs are the vendor's `swk_live_EXAMPLE…` placeholders and the deliberately invalid key used by a test).

Three Claude Code sessions worked on this repository in parallel on 4 Nov; the **Session** column says which:

| Session | Role |
|---|---|
| S1 "stabilize" | fork, baseline, root-cause fixes, layered refactor, CI + public report, certification runs, documentation (this file's owner) |
| S2 "test-plan / coverage" | test plan (`docs/test-plan.html`), SpiraTest IN:81 with Jam.dev evidence, then 30 new tests via seven subagents |
| S3 "test-run" | independent execution and false-positive/false-negative review of an earlier refactor draft in the nested clone (that draft was not submitted) |

## Tools
| Tool | Used for |
|---|---|
| Claude Code (CLI) with model Claude Fable 5.1 (S1, S2, S3) | All AI work: repo setup, audit, fixes, refactor, CI, documentation |
| Claude Code subagents, Claude Opus 5.5, seven in parallel (S2) | Implementing the 30 new tests, one subagent per test group, each owning separate files |
| Claude Code `Workflow` orchestration, 10 subagents (S1) | Baseline audit of the inherited repo: 5 auditors + 5 adversarial verifiers; all 75 findings confirmed |
| Project skill `itac-judge-guidelines` (written by the user before the event) | Acceptance criteria M1–M11 and the evidence ledger (`.itac/JUDGE_STATUS.md`) |
| Superpowers plugin (planning, TDD, verification skills) | Methodology guardrails; S2's plan in `docs/superpowers/plans/2026-11-04-p1-coverage.md` |
| Security-guidance plugin (automated review inside Claude Code) | Flagged the hardcoded credentials in the inherited specs and the unpinned third-party action in the workflow |
| GitHub CLI (`gh`) driven by Claude (S1) | Creating the fork, enabling Actions and Pages, dispatching and watching the certification runs |
| Spira MCP (S1, S2) | Filing and enriching SpiraTest incidents IN:81, IN:82, IN:83 |
| Jam MCP + headed Playwright script (S2) | Recording the IN:81 reproduction with the credential masked |
| Playwright MCP (S2, 18:19–18:25; earlier pre-repo session) | Live accessibility snapshots used for locator decisions; probing the public surfaces before the repo arrived |
| Standalone Playwright and curl/Python scripts driven by Claude (S1, S3) | Read-only live checks of API shapes, DOM facts and page timings before changing any test |

## Main prompts (chronological)
| Time | Session | Prompt (wording or summary) | What AI did | Human decision |
|---|---|---|---|---|
| ~15:16 | pre-event | (summary) rehearse a Playwright CI + GitHub Pages report pipeline | Built throwaway repo `meyuval/itac-practice-pipeline`, 5 green runs | Preparation only, not part of the submission |
| ~15:35 | pre-event | (summary) user shared the organizer's AI-usage rule | Captured it in the judge skill's `AI_USAGE_RULES.md` | Accepted |
| 17:25–17:45 | pre-repo | (summary, wording not preserved) read the ITAC email, probe Stonewake site/API/MCP/docs, draft an STP | Wrote `.itac/SUT_BRIEF.md`, `.itac/sut-docs/*`, `docs/STP.md` v0.1 | Accepted as drafts, unknowns marked |
| ~18:03 | S1 | "i got the repo, fork the repo github.com/AlexKomanov/stonewake-final-repo in my local repo" | Added `upstream` remote, merged `b4f92c9` into local `main` (merge `591c836`), kept original history; reported that `.env`, `node_modules` and reports are tracked and that `.env` holds live credentials | No objection; nothing pushed |
| ~18:08 | S1 | (automated security review, not a user prompt) | Flagged the API key, email and password hardcoded in `tests/api.spec.ts` and `tests/ui.spec.ts` | Logged in the ledger; fixed in the first cleanup commit |
| 18:10 | S3 | "try executing the tests and give me a status for pass / failed" | Ran the refactored suite in `stonewake-final-repo/` (32/33 passed, 1 dispose ENOENT) and the inherited baseline at the root (10/20, after `npm ci` because the committed `node_modules` was partial); logged both runs and updated the ledger | Status reported in chat; no code changed |
| ~18:10 | S1 | "research the project structure, code quality, depdendency injection probkems. identify quick improvments and map areas that needs to be addressed or improved /deep-research" | Launched a 10-agent audit workflow (structure, code quality, fixtures/DI, stability, CI). Meanwhile read the inherited README, which requires a GitHub fork, and created `meyuval/stonewake-final-repo` with `gh repo fork` | Fork accepted as the submission repo |
| ~18:16 | S3 | "can you verify if there are any false positive / false negative?" | Read all 33 refactored tests and the 20 inherited tests; probed the live API with curl and the live DOM with a Playwright script (read-only); classified all 10 inherited failures as test defects, found no vacuous passes, reran the portfolio API spec 12 times (dispose error not reproduced, cause left as unknown) | Findings reported in chat; ledger updated |
| 18:19 | S2 | three PDFs attached (opening transcript, ITAC Stonewake email, logins) + "i'm attaching the full product requirements. in real world i wouldnt give you my credentials but since this is a demo, you can find my credentials in the pdf file under finalist5 … The url for the app is app.stonewake.ai. Design a test plan - do not implement anything yet. Output should be html file that i can review. Focus on both UI and API tests" | Read the PDFs, the inherited specs, baseline logs and offline docs; probed the API read-only; signed in with Playwright MCP and snapshotted six pages; wrote `docs/test-plan.html` (56 UI + 49 API scenario rows, root causes of the 10 inherited failures, parity layer, five-green protocol, timeline) and one ledger line | Pending user review; nothing implemented |
| ~18:20 | S1 | "give me a prompt summary for judges" | Created this file | — |
| ~18:25 | S1 | `/plan`, then `/plan "C:\…\Act as a principal automation engineer and AI coding expert.md"`, then `/plan according to the attached prompt in the md file …`, then "exit plan mode" | Read the brief (stabilise, layered architecture, five zero-retry green runs), the 10-agent audit (75 findings, all confirmed by verifiers), verified the five API root causes live with curl, wrote the plan (`~/.claude/plans/dapper-growing-pie.md`: phases, time budget, freeze at 19:50) | **Plan approved by the user** (ExitPlanMode); implementation started |
| 18:30–18:55 | S1 | (execution of the approved plan, no new user prompt) | Hygiene commit `a11c340`; in-place fixes `1404939` (20/20 local); negative control (DE→GE fails api 9); layered refactor + 3 new tests `fba6c87` (23/23 local, twice); CI workflow with public Pages report; fork pushed; Actions and Pages enabled; CI runs #1–#2 green | Not line-reviewed by the user; verified by typecheck, local runs and CI; later audited on request (19:03, 19:05) |
| ~18:33 | S3 | "execute again to verify no flaky tests" | Proposed five consecutive full runs with a source-tree checksum | **Rejected by the user before it ran** (nothing executed) |
| 18:37 | S2 | "audit the prompts for judges" | Audited this file against `AI_USAGE_RULES.md` and the actual state of both working folders; appended the test-plan session's own entries | Findings reported in chat |
| 18:40 | S3 | "audit prompts" | Audited this file against `AI_USAGE_RULES.md`, scanned the docs for credentials, appended this session's rows | Findings reported in chat |
| 18:43 | S2 | "you mentioned earlier you may have found a product bug - verify it. if its a bug - record it via jam.dev and open a bug on spiratest" | Re-checked the suspected API mojibake by raw bytes: not a bug (own probe decoded with the console code page). Ran a 30-case read-only validation sweep; found `/org/api-keys` 401 bodies contradicting the documented uniform-refusal contract; reproduced across credential variants; filed SpiraTest IN:81 through the Spira MCP with steps, expected, actual, frequency, severity rationale. Jam MCP cannot record (no connected domain), so the recording was handed to the user. Corrected `docs/test-plan.html`, the defect log and the ledger | Superseded by the next row |
| 18:48 | S2 | "you do the recording, you have their mcp" (+ screenshot of the Jam MCP tool list; + "you're recording the whole screen including my interactions with you in the cmd. you only need to record the open tab and stay focused on it") | Created a Jam recording link, wrote a Playwright script (scratchpad, not in the repo) that opens the Swagger explorer and the recorder in a headed Chromium and performs the three calls with the key masked on screen. Attempt 1 captured the whole screen (tab-title flag did not match) and was not persisted; attempt 2 used tab-only capture by exact title. Jam https://jam.dev/c/ec59a5c7-7b62-4431-ad46-8dbd12b42303 titled, described and attached to IN:81 via the Spira MCP | User corrected the capture scope mid-run; accepted. Attempt 2 was then deleted by Claude because the explorer's curl panel showed the key on video; attempt 3 hides that panel and is the one attached |
| ~18:50 | S1 | (automated security review, not a user prompt) | Flagged unpinned third-party action, job-level secrets, unused `id-token` permission | Fixed in commit `b25fb71` |
| ~19:00 | S1 | (execution continues) | Pushed docs commit `f0a9705`; ran five sequential certification runs on it (#3–#7 green, 23 tests); filed SpiraTest IN:82 (tile test-id inconsistency); wrote `docs/VIDEO_OUTLINE.md` | Reported in chat |
| ~19:03 | S1 | "verify all tests from original fork still exists after the new refactor and that no test was dropped" | Script traced all 20 inherited tests to `// inherited:` markers and compared assertion counts; table added to `docs/DEFECTS_AND_CHANGES.md` §3 | Findings reported in chat |
| ~19:05 | S1 | "make sure the intended content change is audited" | Live check found `/dossiers` and `/signals` exist without sidebar links (my earlier "module not offered" classification was wrong and was corrected); added a URL-based test restoring the inherited destination; filed SpiraTest IN:83; documented the api 2 `typeof` removal as subsumed by the regex assertion; re-certified on `e0fd863` (runs #8–#12 green, 24 tests) | Findings reported in chat |
| 19:10 | S2 | "are you attaching the jam dev links to the spiratest bugs? there is a field named: Link to Jam.Dev video" | Verified IN:81 has the field; found IN:82/IN:83 with empty custom fields; filled their structured fields via the Spira MCP from their own descriptions and a live re-check; three automated Jam recording attempts for 82/83 failed at capture start and were abandoned to protect the deadline | Jam links for IN:82/IN:83 left for the user to record with the extension |
| ~19:16 | S1 | user forwarded the organizer's product update ("Quick update, social monitoring is now visible inside "Monitoring" … two tabs, "Research" and "Sentiment" … "Monitor a name" …") and `stonewake-at-a-glance.pdf` | Verified live (tabs, `?view=sentiment`, "Names you monitor", the Monitor-a-name form: name field, Type select, Monitor this name / Browse catalog); added `MonitoringPage` + a read-only test; copied the PDF to `.itac/sut-docs/`; write flow (add/remove a name) left for later coverage | No objection raised |
| ~19:20 | S1 ↔ S2 | (coordination between sessions, no user prompt) | S1 found S2 editing `src/` and `tests/` concurrently; agreed by message: S2 owns code and the single push at the 20:10 freeze, S1 owns docs, evidence and the five certification runs after the push | Logged |
| 19:39 | S2 → S1 | (freeze message) | S2 pushed `a8f194f` with 50 tests (24 api, 26 chromium), two local zero-retry runs green, implemented by seven parallel subagents from `docs/superpowers/plans/2026-11-04-p1-coverage.md`; S1 started the five-run certification | Started |
| 19:41 | S2 → S1 | (hold message) the user told S2 to switch the suite to the Finalist 5 credentials | S1 stopped the certification loop before any dispatch; only the push-triggered run #13 exists and is treated as non-qualifying; the new five-run streak starts after the secrets change | Held, awaiting S2's go |
| ~19:45 | S1 | "audit the prompts" | Audited this file: rows were out of order and unattributed across three sessions, two "Parts" entries were stale, code commits were marked "Reviewed" although the user had not line-reviewed them, and S2's three code commits were missing. Rewrote the file in chronological order with a Session column, honest review labels, all commits, and a credential scan | Findings reported in chat |

## Parts created or changed with AI
All code in the fork was written by AI; the human directed, questioned, audited and approved at the level of plans,
results and spot checks, not line by line. Verification that stood in for line review: `npm run typecheck`, local
zero-retry runs, GitHub Actions runs, the traceability audit (19:03) and the content-change audit (19:05).

| Path / commit | Created or changed | Human review / verification |
|---|---|---|
| `591c836` merge of upstream `b4f92c9` | S1, plain `git merge`, no code edits | Discussed in chat |
| `a11c340` chore | S1: `.gitignore`, `.env.example`, `tsconfig.json`, `package.json` scripts, untracking of 400 generated/secret files | Verified by baseline run |
| `1404939` fix(tests) | S1 edited the inherited `tests/api.spec.ts`, `tests/ui.spec.ts` (ten root causes, sleeps removed) | Each fix verified against the live product (curl, DOM snapshots); negative control |
| `fba6c87` refactor | S1 wrote `src/**` (config, ApiClient, models, StonewakeApi, page objects, WebApp, fixtures), `tests/backend/**`, `tests/ui/**`, `playwright.config.ts`, `.github/workflows/playwright.yml`, `scripts/ci/build-report-site.mjs`, `docs/DEFECTS_AND_CHANGES.md` | 23/23 locally and in CI; traceability audit 19:03 |
| `b25fb71` ci/docs | S1 hardened the workflow (pinned action, scoped secrets) and wrote `README.md` | CI run #2 |
| `f0a9705`, `941600c`, `fa566f8` docs | S1: `docs/STP.md` v1.0, this file, `docs/VIDEO_OUTLINE.md`, `.itac/FIVE_GREEN.md`, ledger | User read summaries in chat |
| `e0fd863` test(ui) | S1 added the EDD Dossiers/Signals URL test and `monitoring.page.ts` + `tests/ui/monitoring.spec.ts` (committed by S2 in `a8f194f`) | Requested by the user's audit question; 5 green CI runs |
| `b1ceb75` feat(api) | S2: `ApiClient.getBinary`, `src/infrastructure/files/magic-bytes.ts`, deals/transitions/nodes/screenings/monitoring API methods and models | Typecheck; S2 review of subagent output |
| `6193245` test(api) | S2 via subagents: `tests/backend/{deals,research}.spec.ts` and additions to health-and-auth, portfolio, countries, entities specs | Two local zero-retry runs 50/50 |
| `a8f194f` test(ui) | S2 via subagents: `tests/ui/{deal-book-coverage,company}.spec.ts`, additions to portfolio and countries specs and their page objects, `deal.page.ts`, `company.page.ts` | Two local zero-retry runs 50/50; certification pending |
| `docs/test-plan.html` | S2 (18:30), test plan with scenario IDs used by the new tests | Awaiting user review |
| `docs/superpowers/plans/2026-11-04-p1-coverage.md` | S2, implementation plan for the new coverage | — |
| `.itac/JUDGE_STATUS.md`, `.itac/SUT_BRIEF.md`, `.itac/sut-docs/`, `.itac/baseline/*` | S1, S2, S3 working notes and raw run logs | Working evidence |
| Earlier refactor draft in the nested clone `stonewake-final-repo/` (33 tests, reviewed by S3) | A parallel session's draft; **not submitted**, superseded by `fba6c87` in the fork | S3 review found no vacuous passes |

## Key decisions and rationale
- **Keep the inherited history instead of re-creating the project.** The judges require starting from the provided project; the merge commit and the GitHub fork both prove provenance.
- **Create a real GitHub fork.** The inherited README instructs contestants to fork and work in the fork, so the fork (not the user's `itac-finals` repo) is the submission target.
- **Do not push until secrets are out of the code.** The inherited repo commits `.env` and hardcodes the same key/password in the specs. The values are already public upstream; rotation is the organizers' call and is requested.
- **No history rewrite.** Rewriting would destroy provenance of the inherited project.
- **Audit before editing, fix in place before moving code.** Each of the ten failures was classified (nine test defects, one unlinked product page) and corrected in the original files first (`1404939`) so the refactor diff does not hide what was wrong.
- **Per-test sign-in instead of shared storageState.** The sign-out scenario ends the session; isolated contexts avoid order dependence.
- **Test plan before code (S2).** Chromium only and retries 0 for certification; parity checks between UI and API as the main new coverage; writes in the workspace are allowed only with cleanup, and the one write scenario (UI-PF-06) was then left out because it would disturb the parallel parity counts.
- **Restore intent rather than drop it.** When the audit showed `/dossiers` exists, the inherited destination was covered by URL and the missing link was filed (IN:83) instead of deleting the step.
- **Certification is tied to code and credentials.** Switching the suite to the Finalist 5 account invalidates runs made with the inherited account, so the five-run streak restarts after the secret change, and the earlier certifications are kept as superseded records.
- **Two sessions, one push.** To avoid a broken `main`, S2 owns code commits and the single freeze push; S1 owns documentation, evidence and the certification runs.
