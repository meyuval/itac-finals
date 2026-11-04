# Parts of the project created or changed with AI

Related: [AI_PROMPTS_LOG.md](AI_PROMPTS_LOG.md) (the prompts behind each change) · [AI_USAGE.md](AI_USAGE.md) (tools and decision rationale).

**Short version:** Claude Code wrote all the code in this repository after the inherited project (`b4f92c9`, merged as `591c836`). The human:
- directed the work and set the priorities,
- questioned and audited the results (for example the traceability audit at 19:03 and the content-change audit at 19:05),
- rejected or corrected AI proposals where needed (for example the 18:33 re-run proposal and the Jam capture scope),
- approved changes by plan, result and spot check, not line by line.

Line review was replaced by objective checks: `npm run typecheck`, local zero-retry runs, GitHub Actions runs, and live checks of every root cause against the product.

**What AI did not create:**
- ChatGPT only improved prompt wording and Gemini only transcribed the opening session and Luca's product review. Neither touched any file in the repository.
- The inherited tests (`b4f92c9`) were written by the original author, not by us.

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
| `210c7a3` docs | S1: links moved to `meyuval/itac-finals`, ledger, Finalist 5 check | User instruction 19:52 |
| `6abf104` test(ui) | Architecture-review session: `src/business/fixtures/index.ts` (one sign-in per worker), `tests/ui/auth.spec.ts` | Isolated run 50/50, retries 0; five green CI runs #1–#5 |
| `d104959`, `d58b82f` ci+test | S1: `.github/workflows/playwright.yml` (Pages deploy, report link), stricter assertions in `tests/backend/{deals,portfolio}.spec.ts`, `tests/ui/auth.spec.ts` | api 24/24 locally, retries 0; disclosed as post-certification in `.itac/FIVE_GREEN.md` |
| `3d54d98` docs | S1: `.itac/FIVE_GREEN.md`, `README.md`, `docs/STP.md` | — |
| `docs/report/` (STP + STR v1–v4, builder scripts, charts) | S1: `build_stp_str.py`, `charts.py`, generated DOCX/PDF | User reviews the PDF |
| `docs/VIDEO_OUTLINE.md` | S1: speaking script for the summary video | The user records it |
| `docs/AI_PROMPTS_LOG.md`, `docs/AI_CHANGED_AREAS.md` | S1, 20:47, split out of `docs/AI_USAGE.md` | — |
