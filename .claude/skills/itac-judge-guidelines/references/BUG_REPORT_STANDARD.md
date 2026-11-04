# Bug report standard (SpiraTest) — RECOMMENDED, not an official ITAC rule

**Status:** recommended practice. Taken from judge feedback in a *different* competition (ISTC 2026, `qa-competition-tester` skill, imported 4 Nov 2026). In that competition, poor bug reports triggered a hard cap on the quality score. ITAC judges have not published bug-report criteria. Their official requirement is only that product bugs are reported in SpiraTest (M8), and "reporting and deliverables quality" is a scoring category. Follow SpiraTest's real fields, which you only see at the event, over this template.

## Before filing: is it really a product bug?

Report only **confirmed SUT/product defects** in SpiraTest. Before filing, rule out an automation cause:

1. **Preconditions were actually met:** correct account, role or plan, the required data existed, a clean state, and nothing left over from an earlier test (modals, sessions, data).
2. **It reproduces manually** in a normal browser. A failure that happens only in automation is an automation issue until proven otherwise.
3. **There's a basis for calling it a bug:** product spec, task statement, a UX/HTTP standard, or a judge statement. "It's inconvenient" is not enough.

If any of these can't be verified, **don't file it**. Log it as "unknown / under investigation" in the defect log instead.

## Every bug must have

| # | Rule | Lesson from earlier judge feedback |
|---|---|---|
| 1 | **Evidence:** a Jam.dev link (screenshot or video) with console and network logs | Only 46% of bugs had evidence, which triggered a quality cap |
| 2 | **Video for interaction bugs** ("nothing happens after clicking"). A screenshot is not enough | Penalized |
| 3 | **At least 3 deterministic steps**, as a plain numbered list in the Steps field, never JSON or escaped text, never buried in the Description | Penalized; only 43% of bugs had them |
| 4 | **Internal consistency:** Title, Description, Expected and Actual must agree (e.g. don't write "500 instead of 404" in one field and "expected 422" in another) | Penalized |
| 5 | **Diagnostic info:** the exact error text, console message or HTTP status | Penalized |
| 6 | **Frequency:** 100% reproducible, intermittent (x of y tries), or once | Penalized |
| 7 | **Environment in its own fields:** browser and version, OS, device, SUT URL or build | Penalized |
| 8 | **Severity with a rationale:** impact on the user or business | — |

## Steps template

```
1. [Precondition] Logged in as a new user (registered with test+<timestamp>@example.com, email confirmed).
2. [Action] Open Cart, set quantity of "Item A" to 0, click "Update".
3. [Expected] The item is removed and the total becomes $0.00 (spec section 4.2).
4. [Actual] The item stays at quantity 0, the total is still $19.99, and the console shows "TypeError: ...".
```

## Severity guide (adapt to SpiraTest's own scale)

- **Critical:** a core flow is completely broken, data loss, security or auth bypass, payment manipulation, server 500 on a core flow.
- **High:** missing validation, a broken redirect, a silent error, a permission not enforced.
- **Medium:** UI inconsistency, a wrong HTTP status, an unclear error message, broken responsive layout.
- **Low:** typos, cosmetic glitches.

## Link it into the deliverables

Each filed bug goes into the defect log (M7) with its SpiraTest ID, Jam link, the related automated test if there is one, and whether the test now asserts the correct behavior or documents the defect. **Never** make a test green by asserting the buggy behavior or skipping it silently. Disclose any expected-failure or quarantine handling.
