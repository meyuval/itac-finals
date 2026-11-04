# API security

The security posture of the Stonewake API, on one page. In short, the API can only read, only your workspace, only over TLS, and only with keys you created and can revoke at any moment.

## Access

- API access is off by default for every workspace and enabled by arrangement.
- Keys are created by a workspace admin, shown once, stored only as a one-way hash, and revocable instantly.
- Keys work only on `/v1` and the MCP server. Every other endpoint refuses a key exactly as it refuses an invalid one, so a key never reaches the dashboard's own endpoints or key management.
- Every read of workspace data authenticates; there are no anonymous reads.

## Surface

- The API is read-only. No endpoint creates, changes, or deletes workspace data, and API keys cannot manage keys, including themselves.
- The API serves data about natural persons, as official registers and the official sanctions lists state it and with its citations, only in workspaces where person data is switched on, never in the sandbox, and never as a score, rating or ranking.
- Rate limits and daily quotas bound every key's traffic.

## Isolation and data handling

- A key reads exactly one workspace. Tenant isolation is enforced at multiple independent layers, from request scoping down to the database.
- Key creation, revocation and last use are recorded; every key-authenticated request passes rate and quota controls.
- The database, the API, the audit trail, the MCP server, the dashboard, the documentation and the website run on a dedicated server in Finland. A provider established in the United States delivers the web pages of the dashboard, the documentation and the website over its global delivery network. Sign in runs through an authentication service provider that keeps the sign in accounts in the United Kingdom.
- The database is backed up every night to separate storage in Finland, and each backup is encrypted before it leaves the server.
- Where each provider processes data on each route, and where the provider of the sign in accounts is established, is stated under [Data handling](/data-handling).
- We store your workspace records on our infrastructure and do not train models on them; search queries, fetched public text and the text sent to AI providers for drafting, including the subject of a screening, are processed by search and AI providers under the terms in the privacy policy, sections 7 and 8.
- Stonewake trains no model on your data, and the terms of our language model provider bar it from training models on customer content. Every other provider that receives text from us, for text embeddings, as a fallback or for search, handles it under its own terms, and the AI controls page shows your administrators what the published terms of each provider say about training.
- Your bank and an auditor it mandates may audit our processing, inspections included, under clause 10 of the data processing agreement, and for a bank under DORA its clause 12.1 extends that right to the bank's competent authorities and resolution authorities.
- TLS everywhere. The API is served over HTTPS only.

## Where the data comes from

The research base is public data. It covers official company registers and gazettes, court and insolvency publications, regulatory filings (SEC EDGAR, for example), the LEI system (GLEIF), public procurement records, official statistics, licensed reference datasets, and reputable press. Responses that carry findings carry their source citations, and `GET /v1/reference/datasets` lists the reference datasets behind the country data with their licence and attribution lines. The obligations that travel with this data are stated under [Terms of use](/terms-of-use).

## The role of AI

- `/v1` serves stored, citation-backed data. Responses are deterministic reads of stored data, and no model runs at request time.
- Some stored content is drafted with AI assistance. Screening findings include drafts grounded in the cited sources and intended for review by your analysts. The deal summary is not drafted by a model; its three lines are generated from the cited findings by fixed rules. A deal briefing, where a deal carries one, is drafted by a model from the text of the deal's cited sources. Its numbers written in digits and its names are checked against that text before it is stored and shown.
- Scores apply to organizations and countries, never to natural persons. Like the read only surface, this holds by design, and no endpoint serves a person level score.
- Stonewake is a research and monitoring tool that supports human decisions. It takes no decision, executes no action, and is not an automated decision system.

## Retention and offboarding

- Workspace data is retained while your arrangement is active.
- When the arrangement ends, you can export your reports and data during a wind down period of 30 days (Terms of Service, clause 12.3). The product's exports are the PDF reports on deals, counterparties, companies, countries, screenings and dossiers, the committee packs, the Excel workbooks of the Deal Book, the countries and research runs, the audit log as CSV and, while API access is on, every record `/v1` serves. The product holds no single export of the whole workspace. Return and deletion follow clause 9 of the data processing agreement, so workspace data is deleted after the wind down and Stonewake confirms the deletion in text form.
- The entries of the append-only audit trail are retained after the arrangement ends. They hold identifiers (event types, timestamps, the acting user and the objects acted on, among them the email address of a member an administrator invited or removed or who first signed in through single sign on) and no screening content, except feedback reports, which keep their text and the reporter's email address until both are removed from entries older than 180 days.
- The binding detail is in your customer agreement and the [Terms of Service](https://stonewake.ai/terms).

## Reporting a security issue

Report suspected vulnerabilities, and anything that looks like an incident affecting your workspace, to [contact@stonewake.ai](mailto:contact@stonewake.ai) with "Security" in the subject. Include what is needed to reproduce; never include live keys or workspace data in a report. Scope and safe harbour are on the [security disclosure](/security-disclosure) page.

Questions beyond this page go to contact@stonewake.ai.
