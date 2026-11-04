# AI usage (ITAC 2026 final, 4 Nov 2026)

Kept during the work, not reconstructed afterwards. Times are Asia/Jerusalem. Prompts are the user's real wording; typos kept. No credentials appear in prompts or outputs logged here.

## Tools
| Tool | Used for |
|---|---|
| Claude Code (CLI) with model Claude Fable 5.1 | All AI work: repo setup, code audit, documentation drafts |
| Project skill `itac-judge-guidelines` (written by the user before the event) | Acceptance criteria and evidence ledger (`.itac/JUDGE_STATUS.md`) |
| Superpowers plugin (skills for TDD, debugging, verification) | Methodology guardrails |
| Security-guidance plugin (automated review inside Claude Code) | Flagged the hardcoded credentials in the inherited specs |
| Claude Code `Workflow` (multi-agent orchestration, 10 subagents) | Baseline audit of the inherited repo: 5 auditors + 5 adversarial verifiers |
| GitHub CLI (`gh`) driven by Claude | Creating the fork `meyuval/stonewake-final-repo` |
| Playwright MCP (earlier session) | Probing the public Stonewake surfaces before the repo arrived |
| Playwright MCP (test-plan session, 18:19–18:25) | Signed in as Finalist 5 and captured accessibility snapshots of Deal Book, a deal page, Portfolio, Screenings, Countries, Monitoring for the plan's locator notes |
| curl + Python (driven by Claude, 18:17) | Read-only probes of `/health`, `/v1/me`, portfolio, deals, countries, search, screenings, monitoring, watches with the finalist key |

## Main prompts (chronological)
| Time | Prompt (summary or wording) | What AI did | Human decision |
|---|---|---|---|
| ~15:16 | (pre-event) rehearse a Playwright CI + GitHub Pages report pipeline | Built throwaway repo `meyuval/itac-practice-pipeline`, 5 green runs | Preparation only, not part of the submission |
| ~15:35 | (pre-event) user shared the organizer's AI-usage rule | Captured it in the judge skill's `AI_USAGE_RULES.md` | Accepted |
| 17:25–17:45 | (earlier session, wording not preserved) read the ITAC email, probe Stonewake site/API/MCP/docs, draft an STP | Wrote `.itac/SUT_BRIEF.md`, `.itac/sut-docs/*`, `docs/STP.md` v0.1 | Accepted as drafts, unknowns marked |
| ~18:03 | "i got the repo, fork the repo github.com/AlexKomanov/stonewake-final-repo in my local repo" | Added `upstream` remote, merged `b4f92c9` into local `main` (merge `591c836`), kept original history; reported that `.env`, `node_modules`, reports are tracked and that `.env` holds live credentials | Accepted; nothing pushed |
| ~18:08 | (automated security review, not a user prompt) | Flagged the API key, email and password hardcoded in `tests/api.spec.ts` and `tests/ui.spec.ts` | Logged in the ledger; fix deferred to the first cleanup commit |
| ~18:10 | "research the project structure, code quality, depdendency injection probkems. identify quick improvments and map areas that needs to be addressed or improved /deep-research" | Launched a 10-agent audit workflow (structure, code quality, fixtures/DI, stability, CI). Meanwhile read the inherited README, which requires a GitHub fork, and created `meyuval/stonewake-final-repo` with `gh repo fork` | Fork accepted as the submission repo; audit results pending |
| ~18:20 | "give me a prompt summary for judges" | Created this file | — |
| 18:19 | (test-plan session) three PDFs attached (opening transcript, ITAC Stonewake email, logins) + "i'm attaching the full product requirements. in real world i wouldnt give you my credentials but since this is a demo, you can find my credentials in the pdf file under finalist5 … The url for the app is app.stonewake.ai. Design a test plan - do not implement anything yet. Output should be html file that i can review. Focus on both UI and API tests" | Read the PDFs, the inherited specs, baseline logs and offline docs; probed the API read-only; signed in with Playwright MCP and snapshotted six pages; wrote `docs/test-plan.html` (56 UI + 49 API scenario rows, root causes of the 10 inherited failures, parity layer, five-green protocol, timeline) and one ledger line | Pending user review; nothing implemented |
| 18:37 | "audit the prompts for judges" | Audited this file against `AI_USAGE_RULES.md` and the actual state of both working folders; appended the test-plan session's own entries (this row and the two above) | Findings reported in chat |
| 18:10 | (test-run session) "try executing the tests and give me a status for pass / failed" | Ran the refactored suite in `stonewake-final-repo/` (32/33 passed, 1 dispose ENOENT) and the inherited baseline at the root (10/20, after `npm ci` because the committed `node_modules` was partial); logged both runs and updated the ledger | Status reported in chat; no code changed |
| ~18:16 | (test-run session) "can you verify if there are any false positive / false negative?" | Read all 33 refactored tests and the 20 inherited tests; probed the live API with curl and the live DOM with a Playwright script (read-only); classified all 10 inherited failures as test defects, found no vacuous passes, reran the portfolio API spec 12 times (dispose error not reproduced, cause left as unknown) | Findings reported in chat; ledger updated |
| ~18:33 | (test-run session) "execute again to verify no flaky tests" | Proposed five consecutive full runs with a source-tree checksum | **Rejected by the user before it ran** (nothing executed) |
| 18:40 | (test-run session) "audit prompts" | Audited this file against `AI_USAGE_RULES.md`, scanned the docs for credentials, appended this session's rows | Findings reported in chat |

## Parts created or changed with AI
| Path / commit | Created or changed | Human review |
|---|---|---|
| `591c836` merge commit on `main` | Created by AI (plain `git merge`, no code edits) | Reviewed by the user in chat |
| `.gitignore` (uncommitted) | AI appended two local-only ignore rules to the inherited file | Pending |
| `.itac/JUDGE_STATUS.md`, `.itac/SUT_BRIEF.md`, `.itac/sut-docs/` | Created by AI | Working notes, reviewed as used |
| `docs/STP.md` v0.1 | Drafted by AI from public docs | To be revised against the real project |
| `docs/AI_USAGE.md` | Created by AI | This file |
| `.itac/baseline/run3-baseline.log`, `stonewake-final-repo/.itac/runs/refactored-run1.log`, `.itac/JUDGE_STATUS.md` (three rows) | Created by AI (test-run session): raw run logs and ledger entries | Working evidence, no code |
| `docs/test-plan.html` | Created by AI (test-plan session, 18:30) | Awaiting user review |
| `stonewake-final-repo/src/**`, `tests/**`, `playwright.config.ts`, `package.json`, `.github/workflows/playwright.yml`, `.env.example`, `.gitignore`, `docs/DEFECTS_AND_CHANGES.md` (uncommitted, fork folder) | Refactored suite created by AI in a parallel session (33 tests; original `tests/api.spec.ts` and `tests/ui.spec.ts` removed in favour of split specs) | **Not yet recorded by the session that wrote it; prompts and human review missing** |
| `tests/*.spec.ts`, `playwright.config.ts`, `.github/workflows/playwright.yml` | Unchanged so far (inherited as-is) | — |

## Key decisions and rationale
- **Keep the inherited history instead of re-creating the project.** The judges require starting from the provided project; the merge commit and the GitHub fork both prove provenance.
- **Create a real GitHub fork.** The inherited README instructs contestants to fork and work in the fork, so the fork (not the user's `itac-finals` repo) is the submission target.
- **Do not push until secrets are out of the code.** The inherited repo commits `.env` and hardcodes the same key/password in the specs. Pushing to the public fork before moving them to environment variables and GitHub secrets would republish them. The values are already public upstream; rotation is the organizers' call and will be raised with the judges.
- **Audit before editing.** The baseline already fails 10 of 20 tests. Several failures look like planted automation bugs (wrong auth scheme, wrong response shape, wrong ISO2 for Germany), not product defects, so each is classified before any fix to avoid mislabelling SpiraTest bugs.
- **Test plan before code (test-plan session).** Chromium only and retries 0 for certification; parity checks between UI and API as the main new coverage; the known API encoding bug gets a test that stays red with a note rather than a hidden skip; writes in the itac-5 workspace are allowed only with cleanup in `finally`. Rationale and alternatives are in `docs/test-plan.html` sections 5, 12 and 13.
