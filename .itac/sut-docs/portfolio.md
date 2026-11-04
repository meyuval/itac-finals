# Portfolio

The portfolio is your team's monitored book of companies, the credit monitoring part of Stonewake. Each status is recomputed from cited register records, never estimated. This page explains what the portfolio page shows. [Credit reviews and status changes](/credit-reviews) explains why a status moves and how your team records its review, and [Book import](/book-import) explains how a whole book is loaded at once.

## Statuses

Every exposure reads one of six statuses, Green, Amber, Red, No score yet, Not yet assessed and Sole trader, named the same way everywhere. [Credit reviews and status changes](/credit-reviews#the-statuses) says what each means and which value the API serves for it.

## The page

- **The counts** at the top read the active exposures in each status, then in one line the status changes of the last 30 days, the reviews overdue and the sole traders that are not scored. Open sanctions name matches of persons linked to the book stay in view until they are reviewed.
- **The book** lists one row per exposure with its company, status, score, what needs attention and its last change. Beside the status, never part of it, a row shows the company's latest complete screening.
- **Status changes** lists each change with its cause, and **Reviews due** lists the reviews overdue or falling due within two weeks and counts the exposures with no credit review on record.
- **Add a company to the monitored book** finds a company and adds it (edit access). Its register records are then watched and scored on every recompute. A company the book already holds under its other register record, such as its SEC filer record beside its LEI record, is not added twice. The add says which company the book holds, and the two records are joined into one company by Stonewake's own identity rule.

A company page opens from its row, with the full signal breakdown behind the score, the review record and the register records the status stands on. **Download deck** there produces the company's credit monitoring slides, which `GET /v1/nodes/{node_id}/risk-deck.pptx` also serves, and **Start EDD dossier** opens the [EDD dossier workbench](/dossiers) for that company.

## Over the API and MCP

`GET /v1/portfolio`, `GET /v1/portfolio/summary` and `GET /v1/portfolio/transitions` serve the same book, counts and changes, described in the [API reference](/v1#portfolio). Over [MCP](/mcp), `portfolio_overview` and `portfolio_book` return them to AI assistants.
