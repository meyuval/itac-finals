# AI usage — official rule and how to comply

**Source:** organizer final-round email (section "שימוש ב-AI"), screenshot shared by the user on 4 Nov 2026, 15:35. Same email as the 20 Oct final-round instructions (see [JUDGES_SOURCE_OF_TRUTH.md](JUDGES_SOURCE_OF_TRUTH.md)).

## Official text (Hebrew, verbatim)

> מותר להשתמש במהלך הגמר בכלי AI ו-LLM, כולל לדוגמה:
> Copilot, ChatGPT, Claude, Cursor וכלים דומים.
> אנחנו לא מגבילים את השימוש ב-AI, אבל כן דורשים שקיפות.
> ב-README של הפרויקט תצטרכו לציין:
> - באילו כלים השתמשתם
> - יומן או תיעוד של הפרומפטים המרכזיים
> - אילו חלקים בפרויקט נוצרו או שונו בעזרת AI
>
> השופטים לא מחפשים לראות מי הצליח לייצר הכי הרבה קוד באמצעות AI. הדגש הוא על שיקול דעת הנדסי, איכות הפתרון והיכולת שלכם להסביר את ההחלטות שקיבלתם.
> שימוש ב-AI לא מוריד ניקוד כל עוד הוא מתועד בצורה ברורה.

## Meaning (English)

- **Allowed:** any AI tool or LLM (Copilot, ChatGPT, Claude, Cursor, and similar), with no usage limit.
- **Required in the project README:**
  1. which AI tools were used
  2. a log or record of the main prompts
  3. which parts of the project were created or changed with AI
- **Scoring:** AI use costs no points *as long as it is clearly documented*. Judges score **engineering judgment, solution quality, and the ability to explain decisions**, not how much code AI produced.

## How to comply (checklist, gates M10 and supports M3/M9)

- [ ] Keep `docs/AI_USAGE.md` **as you go**, during the work. Never reconstruct or invent it afterwards. If the inherited project already has a README or docs convention, follow that instead.
- [ ] The README has a short "AI usage" section that names the tools and **links** to `docs/AI_USAGE.md`. The README must contain the three required items itself, at least in summary.
- [ ] Tools list: name each tool actually used (e.g. Claude Code with model Claude Opus 5.5, plus any MCP servers or plugins that acted on the project: Playwright MCP, Context7, Spira MCP). Do not list tools that weren't used.
- [ ] Prompt log: for each main prompt, record the time, a short summary or the actual wording of the prompt, what the AI did, and what the human decided (accepted, changed, rejected). Keep the user's real wording; never fabricate transcripts.
- [ ] AI-touched areas: list files, folders or commits created or changed with AI (e.g. "`tests/checkout.spec.ts`: locators rewritten by AI, reviewed by the user").
- [ ] **Decision rationale** (the judges' stated focus): for each significant change, write *why* (root cause, alternatives considered, trade-off). This also feeds the STP, the change log and the video script.
- [ ] Human ownership: the user must be able to explain every change. Flag any AI change that the user hasn't reviewed.
- [ ] No secrets, tokens or credentials in prompts that are logged publicly. Remove them before committing.

## Suggested `docs/AI_USAGE.md` layout

```markdown
# AI usage

## Tools
| Tool | Used for |
|---|---|

## Main prompts (chronological)
| Time | Prompt (summary or wording) | What AI did | Human decision |
|---|---|---|---|

## Parts created or changed with AI
| Path / commit | Created or changed | Human review |
|---|---|---|

## Key decisions and rationale
- <change>: <why, alternatives, trade-off>
```

## Pre-event log entries to carry over (4 Nov 2026)

- ~15:16: Claude Code rehearsed the CI pipeline in a throwaway repo, `meyuval/itac-practice-pipeline` (2 TodoMVC tests, GitHub Actions + Pages report, 5 green runs on SHA `777c116`). This was preparation, not part of the submission. Mention it only if useful.
- ~15:35: the user shared this AI-usage section of the organizer email, and Claude captured it in this file.
