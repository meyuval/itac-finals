# Credit reviews and status changes

Portfolio monitoring moves an exposure between Green, Amber, Red and No score yet when the evidence changes. This page explains what a status change tells you, which changes wait for an acknowledgement, and how your team records its own credit review of an exposure. Everything below is served in the dashboard, over the [API](/v1) and to AI assistants over [MCP](/mcp).

## The statuses

An exposure reads one of six statuses, named the same way in the dashboard, in the reports and in this documentation. The API and MCP serve the value in brackets as `status`.

- **Green**, **Amber** and **Red** (`green`, `amber`, `red`), the assessed credit status.
- **No score yet** (`insufficient`), assessed, but too little of what the connected sources can serve for the company was observed to score it. When no annual accounts are on record for the company, the company page and the committee pack say so, and the API and MCP serve `no_status_reason` as `no_accounts`, because the accounts carry most of the weight of a corporate status.
- **Not yet assessed** (`not_assessed`), the exposure has no assessment yet.
- **Sole trader** (`sole_trader`), a natural person's business by its register's own evidence. It is never scored, and its identity and its credit review stay.

## Why a status moved

Every status change names its cause. The cause is derived from the two assessments the change compares, both kept as permanent history, by a fixed rule and without any model.

- The **drivers** are the signals whose change moved the status, each with its band before and after and the citation ids of the evidence standing behind its new state. When the status worsened, the drivers are the signals that turned more adverse or triggered an override, plus the signals that stopped scoring green, since removing reassuring evidence raises the score. When the status improved, the mirror image applies. A move into No score yet names the signals that could no longer be observed. When every driver stopped scoring, the change says how many did, for example 7 signals stopped scoring. When the lead driver kept its band and only its override changed, the change says what the override now does, for example Bankruptcy / insolvency proceedings now forces Red.
- The **register record** behind the lead driver is named with its register and its reference, when a record stands behind it. A signal that moved because evidence is now absent cites nothing, and the change says so instead of inventing a source.
- **Scoring rules changed** is stated first when the scoring engine differs between the two assessments, or the rubric does. The standard rubric and a rubric your team saved count as different rubrics; a No score yet assessment scores nothing and so is never compared by rubric. The move may then come from the rulebook rather than from the borrower.

At most five drivers are named per change and the rest are counted. The two assessment ids are served with the cause, so every claim can be checked against the full signal breakdown. When either assessment cannot be read, the change says **Cause not available** and claims nothing else.

## Additions are not changes

The first assessment of an exposure, made when it joins the book, is shown as **Added to the book** with its first status and, for an Amber or Red first status, the signals that set it. An addition is not a change. It never waits for an acknowledgement and it is not counted among the status changes of the last 30 days, although the count of all transitions of the last 30 days keeps including it.

## Leaving the book

An analyst takes a company off the book from its page with **Remove from book** and a reason, **Added by mistake** or **Exposure ended**. When two records of one company that the book held are joined into one company, the second entry leaves the book with the reason **Same company as another entry**, and the company stays in the book once. The status changes feed then shows **Removed from the book** with the status the company stood at, and behind the row's disclosure who removed it and why. A company added again reads **Added back to the book**. These entries are the book's history, not status changes, so they never wait for an acknowledgement and never raise an alert. The company's earlier assessments, status changes and reviews stay on record, and adding it again continues the same entry.

## Acknowledging changes

An analyst acknowledges a status change once it has been looked at, one at a time or all open changes shown on the page with one action. Only real changes of your own team that are still open are stamped; an admin may acknowledge across teams. Every acknowledgement writes its own audit entry, whichever way it was made.

## The review record

Each exposure carries its own credit review record from the day it joins the book. On that day the member who added the company owns the first review, which falls due one year later, and the record reads **Added to the book** (`added` on the API) until an analyst records a review. Every review after that is set by an analyst.

- **Disposition**, one of Reviewed, no action; Watch list; Intensified care; Escalated to credit. The watch list and the escalation to the credit decision makers follow EBA GL/2020/06 paragraphs 270, 272 and 275; intensified care follows MaRisk BTO 1.2.4.
- **Note**, free text up to 2,000 characters.
- **Owner**, a current member of your workspace who could record the review themselves, which is an analyst or compliance member of the exposure's team, or a workspace administrator. The picker offers exactly these members by name; a member whose account was removed is no longer offered and is refused.
- **Next review date**, between today and one year from today, since MaRisk BTO 1.2.2 asks for a credit risk assessment at least once a year.

A new review becomes the exposure's standing review and the earlier ones stay on file. The history is append only. Nothing is ever edited or deleted, and a correction is a newer review. Viewers read every review of their book and record none.

## Reviews due

A review is overdue when the standing review's next review date has passed. The portfolio page lists overdue reviews and reviews falling due within the next two weeks, soonest first, and counts the exposures never reviewed, an exposure whose only record is the one of the day it joined among them. The list reads the same team as the rest of the portfolio page, and when every team is shown each row names its team. Dates are compared in UTC.

## Where each part is served

- Dashboard. The status changes feed shows each cause in one line and offers the acknowledgements; the company page carries the review record and its history; the portfolio page lists the reviews due.
- API. `GET /v1/portfolio/transitions` carries each `cause`; `GET /v1/portfolio` carries each exposure's standing `review` and `review_overdue`; `GET /v1/portfolio/summary` counts `transitions_30d`, `status_changes_30d` and `reviews_overdue`; `GET /v1/portfolio/{exposure_id}/reviews` serves the history, where the record of the day an exposure joined reads `added`; `GET /v1/portfolio/reviews-due` lists the reviews due. Owners and reviewers are member identities and stay in the dashboard.
- MCP. `portfolio_overview` returns the causes with its transitions and the overdue count; `portfolio_book` returns each exposure's standing review; `exposure_review_history` returns one exposure's history; `portfolio_reviews_due` lists the reviews due.
- Committee pack. The credit monitoring section prints the standing review with its disposition, owner and next review date, and each recent status change with its cause.
