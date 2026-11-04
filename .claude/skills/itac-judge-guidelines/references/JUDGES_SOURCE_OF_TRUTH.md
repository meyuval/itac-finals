# ITAC 2026 final — source of truth and interpretation

**Primary authoritative source**: Final-round organizer email dated 20 Oct 2026 (uploaded PDF titled "גמר ITAC 2026 - מידע והנחיות למתמודדים.pdf", pages 1–4). The supplied WhatsApp screenshot repeats the final instructions. **Historical secondary source**: preliminary-round email dated 15 Sep 2026, which describes Jam.dev and SpiraTest usage in preliminaries; do not transplant the preliminaries' schedule or submission form into the final.

## Official event details (not engineering inferences)

- Final: **Wednesday 4 November 2026**; BDO Academy, Menachem Begin 48, Tel Aviv.
- 16:00 arrival/interviews; 17:20 enter room; 17:25 receive links/materials; 17:30–17:50 project/task/instructions; 17:50–18:00 Q&A; **18:00–21:00 work**; at **21:00 exact** submissions and bug-reporting system close. **Submission form (NEWER, 4 Nov 17:25 email from ITAC, "הכירו את Stonewake"): https://forms.gle/TuATq3R2cu8hL8yY9** — this supersedes the 20 Oct form link https://forms.gle/5Gzxy1XheLwrFkxu6; if both are open, use the 4 Nov one and ask the judges which is authoritative. Email and late submissions are not accepted.
- Prize event: Tuesday 10 Nov 2026 at 15:00; arrive 14:00 for filming/interviews. This is informational, not a same-day submission task.

## Official engineering challenge

- An **existing, outdated, unreliable automation project** and a **real UI product** will be provided, not a blank project. Inspect, stabilize, refactor for maintainability, improve code quality/readability, extend coverage, and present a clear trustworthy process/report.
- **Five consecutive green runs** are a major success criterion. The exact environment and whether they must all be in GitHub Actions are *not specified* in the organizer PDF.
- Standard stack: **TypeScript, Playwright, GitHub, GitHub Actions**.

## Official submission items

1. **Three links:** GitHub repository, GitHub Actions run, execution report. The stated goal is that judges can get **from the code to the run to the report simply and clearly**, so the README should link to the run and the report, and the report should identify its run and commit. Judges must be able to view **every link without logging in**; a private repo or a report that requires a login cannot be judged. Verify in an incognito/logged-out browser.
2. **Updated STP** / test strategy and structured documentation of defects found and changes made. **Product bugs** are reported in **SpiraTest**.
3. **Short summary video** covering initial state, problems, changes, stability improvements, and why the result is more trustworthy.
4. **README transparency on AI use:** tools used; principal prompts/journal; project parts created or modified with AI. AI is allowed with no usage limit and does not reduce scoring if properly documented. Judges focus on engineering judgment, solution quality and the ability to explain decisions, not on the amount of AI-generated code. Full text and compliance checklist: [AI_USAGE_RULES.md](AI_USAGE_RULES.md).
5. All artifacts must be submitted through the official form by 21:00.

## Official assessment criteria

- Planning/documentation
- Automation infrastructure structure
- Quality/readability of code
- Test stability
- Maintainability
- Reporting and deliverables quality

No numerical weights or ranking among these categories were supplied.

## Official bonus opportunities

- Docker for testing environment
- Visual testing
- Slack or Jira integration
- Test/selector self-healing
- Relevant thoughtful questions to judges during competition

Bonus points are cumulative; no point allocations were given.

## Official preflight recommendations / dependencies

- Laptop and charger; Node.js LTS; editor; Playwright and browsers installed; Git/GitHub authenticated; GitHub Actions executable; GitHub Pages report publishable; Jam.dev account; SpiraTest access; AI tool accounts/tokens configured independently.
- They recommend practicing a TypeScript + Playwright project executed via Actions with a published report. *(Done 4 Nov 2026 in `meyuval/itac-practice-pipeline`: 5/5 green on one SHA, and the Pages report is publicly reachable. Lessons: Pages shows only the latest deploy, and runs that queue in the same concurrency group get cancelled, so dispatch them one after another.)*
- Preliminary-round instructions used **Jam.dev for screenshots/videos** and **SpiraTest for defect reporting**; final-round email separately requires access to these services. Do not share preliminary sign-in credentials or hardcode secrets.
- From the preliminary email (15 Sep 2026): the **Jam.dev MCP may be used** alongside the browser extension. SpiraTest login uses the contestant's **email as username**. The password is in that PDF; never copy it into the repo, README, logs or this skill. The final email says SpiraTest login problems had to be reported by 3 Nov 2026. In this Claude Code session, Jam and Inflectra Spira MCP servers are connected; verify that the user can actually log in before relying on them.

## System under test (4 Nov 2026 17:25 email from ITAC — official)

- SUT = **Stonewake** (app at https://app.stonewake.ai/login, API https://api.stonewake.ai, MCP https://mcp.stonewake.ai/, docs https://docs.stonewake.ai). Full SUT brief: `.itac/SUT_BRIEF.md` in the project.
- Judges' recommended six starting flows (not a limit): Deal Book (search/filter, open deal with summary+sources, export); Screenings (run background check, read result with sources); Network & Institutions (company profile, financing, ownership chain); Countries (risk score and indicators); Monitoring & Portfolio (add company to watch, receive updates); reading the same data via API and MCP (both read-only).
- Everything else in the product is in scope, including performance and security tests on the day.
- Live product, separate per-competition workspaces full of test data. Each contestant gets a personal account via invitation email from Stonewake to the registration address; check spam, otherwise ask the judges. Product questions go via the judges to the Stonewake team.

## Source verification log

- 4 Nov 2026 17:35: read the 4 Nov 17:25 ITAC email (PDF "Gmail - הכירו את Stonewake, המוצר הנבדק בגמר itac.pdf"). It names the SUT, the six flows and a **new submission form URL**; it does not change times, deliverables or criteria.

- 4 Nov 2026 ~15:50: re-read the final PDF (`גמר ITAC 2026 - מידע והנחיות למתמודדים.pdf`, 20 Oct), the WhatsApp repost (screenshot 13:56) and the preliminary PDF (15 Sep). Everything above matches. The WhatsApp repost adds nothing new and points back to the 20 Oct email as the detailed source.
- **Focus for the final:** stabilize, refactor and extend an *inherited automation project*, then prove it (five green runs, public links, STP, defects, video, AI transparency). Finding product bugs is part of the job (SpiraTest) but is not the main task. Material imported from other or earlier competitions (`BUG_REPORT_STANDARD.md`, `COVERAGE_AND_STP_CHECKLIST.md`: ISTC 2026 and the preliminary style of bug hunting) is secondary and must not pull time away from stability and evidence.

## Recommendations — explicitly NOT official extra requirements

- Prove five consecutive green results through **five separate complete GitHub Actions executions at one frozen commit SHA**; publish run URLs and report scope. This is strong auditability practice, not stated as a requirement.
- Prefer zero retries for certification or explicitly disclose retries so that green means real reliability.
- Finish public-link preparation early, maintain an evidence ledger, and reserve 20–30 minutes for video/link/form submission.
- Do not mask errors with test skips, assertion weakening, ignored CI failures, or silent partial-suite runs; maintain professional engineering integrity.

**When new instructions arrive in the 17:30 briefing or Q&A, update the current requirements ledger with the exact change and source.**
