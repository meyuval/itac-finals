# MCP

Stonewake serves a Model Context Protocol (MCP) endpoint, so AI assistants and agents can read your workspace directly. Ask about the portfolio, one counterparty's risk, or how a score is produced, and the assistant calls the tools below itself.

```text
Endpoint: https://mcp.stonewake.ai/
```

The endpoint speaks MCP over streamable HTTP. Every request is self contained. There is no session to open and nothing to keep alive, so hosted assistants and local clients connect the same way. It serves the MCP revision `2026-07-28`, which needs no handshake, and the earlier revisions that open with `initialize`.

## Authentication

The same API keys authenticate MCP and the REST API. Send your `swk_live_` key as a Bearer token on every MCP request (see [Authentication](/authentication)). MCP reads the `Authorization` header exactly as the REST API does. Two things work without a key, listing the tools and the documentation search tool. Every tool that reads workspace data requires one.

MCP calls count against the same per-key rate limit and workspace daily quota as direct API calls; see [Errors and rate limits](/errors). Calls that read no workspace data, such as `initialize`, `tools/list` and the documentation search, are counted per client address instead, 60 a minute from one address, and a key sent with them changes nothing.

## The tools

Thirty-eight read only tools. All but `search_stonewake_docs` read workspace data and require a key.

**Portfolio and scoring**

- `portfolio_overview`, status counts across the monitored book, the active exposure count, recent status changes, and the count of overdue credit reviews; pass `transitions_since`, an ISO 8601 date-time with a UTC offset such as `2026-10-01T00:00:00Z`, to also list the individual transitions since a moment, each with the signals that moved it and the register record behind the lead one, paged with `limit` and `offset`, and either alone lists the newest transitions of any date.
- `portfolio_book`, the monitored book itself, one row per exposure with its status, score, top signals with citations, and standing credit review, most severe first; paged, and `include_inactive` adds exposures no longer actively monitored.
- `portfolio_import_preview` previews adding a book of companies from CSV text; every row is matched by its register identifier alone and answers its outcome and reason, paged with `limit` and `offset`. Nothing is written; see [Book import](/book-import).
- `portfolio_reviews_due` lists the credit reviews that need attention today, the overdue ones and those falling due within the next two weeks, soonest first, with the count of exposures never reviewed. See [Credit reviews](/credit-reviews).
- `exposure_review_history` reads one exposure's credit review history by its `exposure_id`, newest first, so the first item is the standing review. Paged with `limit` and `offset`. Owners and reviewers are not served.
- `entity_risk_profile`, your team's current risk view of one company by its `node_id`, with every scored or abstained signal and its citations, plus the class its checks route on and whether your team set it or a register rule derived it.
- `scoring_rubric`, the scoring configuration behind your team's status bands and scores, plus the team's stored rubric versions.
- `sanctions_person_candidates` reads the review candidates for the natural persons that public registers link to the companies on your team's book, compared by name and by the list's own aliases with the natural persons on the six official sanctions lists. A candidate is review material and never a match. Each names the list, the designation reference, the listed names, what matched and what narrowed, and the official file, and its status is `open` or `confirmed` (an analyst confirmed it in the dashboard, where decisions are made). The result also names each list in `lists` with its reading, `Checked` or `Not checked`, and counts the ones not checked in `lists_not_checked` and the register persons that were compared in `persons_compared`, so an empty page says only that no open or confirmed candidate exists among the register persons compared, and it says nothing while `lists_not_checked` is above 0. Rejected candidates are not served, and a person whom no connected register links to your book is not compared. Paged with `limit` and `offset`. Only in workspaces where person data is switched on, and elsewhere it answers not found.

**Company**

- `search_companies` finds a company by name or identifier (an LEI, a registration number, or `scheme:value`); hits carry the `node_id` that the other company tools take. In workspaces where person data is switched on, the natural persons the registers name are found too, after every company, never scored.
- `company_profile`, one registry row's identity from the Stonewake registry of named market participants (export credit agencies, multilaterals, development finance institutions, development banks, government agencies and banks, plus the trade publications deals cite), by `entity_id`.
- `company_overview` reads one company the way the dashboard's Network view shows it, by `node_id`. `identity` lists what the register records held for the company state about its identity (GLEIF, Companies House, a German register extract where one has been read, SEC EDGAR, the Swiss Official Gazette of Commerce and the Marktstammdatenregister's operator entry) in plain words, each fact with the record it cites and that record's `verified_at`, when its register last confirmed it, and `risk` carries its risk status. `risk_state` is `portfolio` when your team holds the company, `assessed` when an assessment was made on the spot for your team, `in_progress` while one is being made, `not_assessed` with a `risk_reason`, or `sole_trader` when the register states a natural person's business, which is never scored. A tool call never starts an assessment. With `locale` set to `de` the whole answer reads German, the field labels and in `risk` each signal's name, value and note as the German dashboard shows them, and the coverage line, while codes stay as served.
- `company_financials`, every financial figure for one company, newest reporting period first, each figure citing its source record (a public register, a public filing repository, or the annual financial report the issuer published on its own website). A figure with `derived` true is not stated in the filing. It was calculated from two figures the same filing states, and its `derivation` says how in plain words. A missing period means nothing was filed, not zero.
- `company_events`, the register event feed of one company, grouped into display rows by significance; related events fold into one rollup row whose `group_key` expands it.
- `company_financing`, the debt surface of one company, with registered charges with bound lenders, listed debt instruments, filed debt positions, derived aggregates, and a maturity wall whose slices expand by `bucket`. The debt position takes short and long term debt and says which one the newest accounts leave out, and instruments FIRDS states as no longer admitted to trading are counted in `terminated_excluded` and listed with `include_matured`.
- `ownership_chain`, the upward ownership chains of one company, composed across registers and cited hop by hop; `threshold` (default 25 percent) and `max_depth` (maximum 8) bound the walk. Natural person owners are named in workspaces where person data is switched on.
- `company_network` returns the register neighborhood of one node, its officers, shareholders and beneficial owners, holdings, branches and other register relations, every edge with the register record that states it. A neighbor's `node_id` expands the same way. Natural persons are served in workspaces where person data is switched on and left out elsewhere. `edge_types` keeps the named types, a comma separated list of the edge types the tool's schema lists, and an unknown or mis cased type is refused before a request leaves. `limit` caps the neighbors at 200.
- `company_public_funding`, public grants and state aid one company received (the EU State aid Transparency Award Module, Kohesio and the Financial Transparency System), each award cited and bound by an identifier, never by a name alone, with totals per year and per programme that never add figures of a different basis or currency. The tool reads only awards to organisations.
- `company_sector_context`, official German statistics beside one German company, the corporate insolvency and enterprise figures Destatis publishes for its WZ 2008 section and its Bundesland, each with its table code, period, retrieval time, source link and the licence attribution line to show with it. Pass `nace` to name the sector, because no German register states it, and `locale` de for German labels (English by default, the table's own German beside each in the `*_source` fields); `missing` says in plain sentences what is not held. Context only, never part of a score or status.
- `company_records` pages the register records behind one company as citations, newest first, at most 25 at a time. Every page states the company's record count and each register's count, and `connector_id`, one of the register ids the tool's schema lists, pages one register alone; any other value is refused before a request leaves. A company listed in a securities register can hold over 100,000 records, and the tool never returns more than one page.
- `company_regional_context` returns official regional statistics beside one German company, the VGR der Länder tables of the Kreis (GDP, gross value added by industry, employment, population) and the Zensus 2022 housing figures of the Gemeinde and the Kreis (rents, vacancy, building age) its seat lies in, and the Regionalatlas indicators of the Kreis (population movement, business registrations and insolvencies, unemployment, disposable income), the monthly labour market figures of the Bundesagentur für Arbeit for the Kreis (registered unemployed and underemployment, the newest 13 months) and the Regionaldatenbank Deutschland tables of the Gemeinde and the Kreis (corporate insolvencies by WZ 2008 section, the Hebesätze of Grundsteuer and Gewerbesteuer). The seat is the register seat; only when no register extract states one is it the seat a German insolvency notice states, and `region.seat_label` then says so with the notice date. Every figure carries its table, period, retrieval time, source link and the attribution line to show with it. `region` says how the seat was joined to its official key, by an exact name match only, or why no region is determined. Context only, never part of a score or status.

**Intelligence**

- `screening_lookup` reads the screenings of your team over organizations and countries, as a filterable list or as one run in full by `screening_id` with the official lists comparison, verdicts, findings, and sources. In workspaces where person data is switched on it also reads the screenings of natural persons, as the official lists comparison and their grounded findings with their sources, never with a verdict, an assessment, a drafted summary or a score.
- `deal_book` reads your team's deal book, every row naming its team, as a list ordered by ranking window first, or by one column in either direction when `sort` and `direction` ask for it, filterable by the facets of `GET /v1/deals`, `region` and `team` included, `country_code` as ISO 3166-1 alpha-3 codes in upper case such as `DEU`, and a facet value the book cannot hold, a non finite `min_value_usd` included, is refused before a request leaves (the rows a desk holds back by default, financing set, cancelled, older than the stale window of 12 months by default, without movement for 12 months, in a market outside a real estate mandate, a real estate row with no private borrower for the desk (a public body's own scheme, a housing association or social housing scheme, a contractor alone, an owner occupier), own bank, domestic or valued below the team's value floor, are off the page unless `include_hidden` is true, the page naming the two age rules in months in `stale_months` and `movement_months`), each row carrying its window, band word, confirmed state, stated event date, whether your own bank is in, angle and ask, and its latest update, while the field `has_unseen_update` is `null` for an API key, which records no opens (the sort `latest_update` orders by that update alone); or one deal in full by `deal_id` with parties, cited timeline (`timeline_limit` entries, default 50, at most 200), the deal summary (three lines generated from the cited findings by fixed rules, not by a model, each with its citations), the briefing, an object with `text`, `drafted_at`, `drafted_by` and `sources` that an AI model drafts as a quick summary of the deal's cited sources, its numbers written in digits and its names checked against their text, or null (it is null before a briefing was drafted, while briefings are switched off, after the deal's sources changed, when no sentence passed the check, and when nothing was left once a clause asking the reader to confirm, verify, check or review anything was removed), and economics.
- `deal_binding_queue` reads the parties on your team's live deals that are not yet matched to a company in a register, followed deals first, each with its deal, its team and its candidate companies with their LEI and register numbers. `deal_id` narrows it to one deal. Paged with `limit` and `offset`. Matching a party happens in the dashboard. Parties on deals from the shared deal pool are matched by Stonewake and not listed. `pool_unbound` counts them and `pool_note` says so.
- The deal duplicates tool was retired on 18 October 2026, and a call by that name answers the error for an unknown tool. Stonewake finds and resolves duplicate deals itself, and no person is asked; once the evidence shows two rows are one transaction, the folded row names the deal it joined in `merged_into` and leaves the book. A pair the evidence does not settle yet stays as two rows until it does, and each team keeps its own row of a project, so a book read across teams can list one project once for each team, every row naming its team in `team_name`. An assistant counting projects across teams reads the names and countries of the rows, never the row count alone.
- `country_profile`, country intelligence, as the index of covered countries or as one country in depth by `iso3` with its cited risk breakdown, memberships, and your team's deals there. The index holds more countries than one answer carries, so it is read in parts with `offset`.
- `developments`, dated, cited developments from your team's research runs, every row naming its team, as a paged feed or as one whole run by `run_id` with its grounded findings, quotes, and sources. Another team's `run_id` answers not found, exactly like an unknown one. A run about a natural person is served only in workspaces where person data is switched on, and its rows carry no relevance score.

**Tenders**

- `tender_matches` lists the public procurement notices your team's tender profiles matched, newest first, one per procedure, each explaining every criterion its profile sets and citing the notice with its page on TED. Filter by `status` or `profile_id`, page with `limit` and `offset`, pass `match_id` alone to read one match, or `deal_id` alone for the matches added to that deal of the Deal Book. No match serves the winners, and a buyer whose legal type may name a natural person is withheld. A match can also cite a notice of your team's own portal lane in `portal_notice`, an export your bank uploaded or an alert of one of its portal accounts, chosen by a profile or by the portal's own saved search (`decided_by`). `deadline_passed` is true once the notice's tender deadline lies before today on the buyer's calendar, and the match keeps its status. See [Tender profiles and matches](/tenders).
- `tender_profiles` lists your team's live tender profiles with the CPV codes, NUTS regions, value band, keywords and other criteria each one asks for. The tool writes no profile and runs no pass.
- `tender_export_preview` previews a tender portal export for your team's own tender notices, a CSV or XLSX file or the XML of one eForms notice, base64 encoded, with the portal it was exported from in `source_portal`. Every row answers its outcome and reason, paged with `limit` and `offset`, and a file no portal profile recognises asks for a column mapping. Nothing is written; see [Tender portal exports](/tender-export-upload).

**Licensed data**

- `licensed_facts` lists the company values a data provider your bank licenses stated, looked up under your bank's own key into your own workspace, each naming its provider, its source page and when it was read. Only values read under a licence scope that covers your bank's own systems are served. Filter by `node_id` or by a German register with its court, and page with `limit` and `offset`. Looking a company up happens in the dashboard; see [Your own sources](/own-sources).

**Alerts**

- `alert_events` lists your workspace's alert events, newest first, each with its class, severity, the `node_id` and `exposure_id` of its subject, the source it stands on and its dates, never a name, filterable by `event_class` and `severity`. A key reads its own team's events and the workspace wide ones.
- `alert_channels` reads which alert channels deliver in your workspace, each switched off channel with its reason, the answer the settings page shows. See [Teams and webhook alerts](/alerts).
- `alert_deliveries` reads the delivery status of your alerts on every channel, newest first, every attempt with its outcome and error class, and the receipt (a signed webhook's confirmation, or the SMS provider's final report that a message was delivered or not) or the point where a delivery was given up, filterable by `event_id`, `status` and `channel`. A key reads the deliveries of its own team's alerts and the workspace wide ones. See [Teams and webhook alerts](/alerts), [Alerts by SMS](/sms-alerts) and [Alerts by email](/email-alerts).

**News**

- `company_news` lists the companies of your workspace's book and watch list with each one's newest daily news reading of a day read in full, or, with `node_id`, one company's daily readings and the newest 100 articles behind the newest one together with every article its events list, each article cited by its `article_key`, with its address, publisher, date, language and GDELT tone. A reading is `reading`, `too_little_coverage` or `feed_gap`, and only `reading` carries a tone. With `node_id` it also returns the company's serious news events of the same days, each with its type, severity, article, source and language counts, its newest article keys and its news check, whose `status` `confirmed` marks the only events that alert. Any other company answers 404. See [News monitoring](/news-monitoring).

**Social media**

- `company_social` lists the companies of your workspace's book and watch list with each one's newest daily social reading of a day read in full, or, with `node_id`, one company's daily readings and its newest 100 items of the last 30 days, each item cited by its `item_key`, with its platform, link, date, language and the source's sentiment label. Every answer says in `source.enabled` whether a licensed source is switched on; it is off until one is. Any other company answers 404. See [Social monitoring](/social-monitoring).
- `social_sentiment` lists the names your workspace monitors, the one list of Monitoring (companies, organisations, brands, persons and topics), by name, each with its newest daily social reading of a day read in full, or, with `target_id`, one name's daily readings and its newest 100 posts of the last 30 days, each post cited by its `item_key`, with its platform, link, date, language, our reader's sentiment label, the word that matched and whether an organisation, a media outlet or a private person posted it. `node_id` keeps the names matched to one company or person. Each name carries `days`, its posts per day over the 30 days of its reading, and one name's answer adds `platforms`, the same counts per platform. A person's reading is context for your own diligence and never a score; a sole trader's name is never searched and carries none. Every answer says in `source.enabled` whether a search source is switched on, and `paused_until` is set while updates are paused. Any other name answers 404. See [Social monitoring](/social-monitoring).

**Documents**

- `report_downloads` names where to download the PDF documents of one subject for filing into a document library such as SharePoint. `subject` is `deal` (its deal report and committee pack), `counterparty` (its counterparty report and pack, by the registry id) or `company` (its company profile, by the graph node id), and `id` the subject's id. The tool first reads the subject, so an id your key cannot read answers `not_found`, then returns each document's `/v1` path. It generates no document. The documents are fetched with the same key, which needs the reports scope. See [SharePoint](/sharepoint).

**Audit**

- `audit_log_export` reads your workspace's own audit log for a window of days, `from` and `to` as `YYYY-MM-DD`, both included, at most 3653 days, the whole retention, as columns and rows in ledger order with the team each actor acted in, every value an identifier, a count, a code or a time, with sign ins, single sign on provisioning and role changes, member removals and every other recorded action. It needs an API key that an administrator created with the audit scope, and any other key answers `forbidden`. The export itself is recorded in the audit log. Large windows are cut at the output cap, so ask for shorter ones. See [Keys](/keys).

**Documentation**

- `search_stonewake_docs` searches this documentation and is the one tool that needs no API key. A query is 2 to 256 characters long.

Two id spaces cross these tools. `search_companies` hits carry the graph `node_id` that `entity_risk_profile`, `company_overview`, `company_financials`, `company_events`, `company_financing`, `company_public_funding`, `ownership_chain`, `company_network`, `company_records`, `company_sector_context`, and `company_regional_context` take, while `company_profile` takes an `entity_id` from the separate registry id space. Both are whole numbers, so an id from the wrong space can name another record instead of answering `not_found`. Every answer names the record it read, so check that name against the company you meant.

## Connect Claude

In Claude, add a custom connector with the endpoint URL `https://mcp.stonewake.ai/` and your API key. From Claude Code it is one command.

```bash
claude mcp add --transport http stonewake https://mcp.stonewake.ai/ \
  --header "Authorization: Bearer $STONEWAKE_API_KEY"
```

## Connect Cursor

Add the server to `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` for all projects.

```json
{
  "mcpServers": {
    "stonewake": {
      "url": "https://mcp.stonewake.ai/",
      "headers": {
        "Authorization": "Bearer swk_live_EXAMPLExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

The key above is a placeholder; use your own.

## Other MCP clients

Any MCP client that speaks streamable HTTP can connect. Point it at `https://mcp.stonewake.ai/` and have it send `Authorization: Bearer <key>` on every request. Clients of the revision `2026-07-28` send every request with its `_meta` envelope and the `MCP-Protocol-Version`, `Mcp-Method` and `Mcp-Name` headers, and `server/discover` names the versions served, `2026-07-28` and the handshake versions `2025-11-25`, `2025-06-18`, `2025-03-26` and `2024-11-05`. Clients on older MCP revisions that open with `initialize` are answered compatibly, and a request that carries neither the envelope nor a version header, like the probes below, is answered the same way. Nothing else is required, no session id, no local process and no package to install.

A first probe from the command line (the tool listing needs no key).

```bash
curl -s https://mcp.stonewake.ai/ \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Calling a tool is one more JSON-RPC request, `tools/call` with `params` naming the tool and its arguments. With a key, this reads your portfolio summary.

```bash
curl -s https://mcp.stonewake.ai/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer swk_live_EXAMPLExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"portfolio_overview","arguments":{}}}'
```

The key above is a placeholder; use your own.

## Errors

- A tool call whose key is missing or refused answers a JSON-RPC error with the stable code `-32001` and a message pointing at [Authentication](/authentication). The message says when no credential was sent at all; a credential that was sent and refused receives one uniform message that, like the API's 401, does not say why. A key that holds a character outside printable ASCII receives that same answer before any request reaches the API.
- A tool call with an argument its tool does not declare, or with a value outside a declared bound or of the wrong type, answers a JSON-RPC error with the code `-32602` before any request reaches the API, and the message names the argument, or, for arguments the tool does not declare, the first 10 of them and a count of the rest. Values follow JSON Schema, so `3.0` is a whole number.
- Under the revision `2026-07-28` a request without its `_meta` envelope or with a version in it that is not a string answers `-32602`, a request whose `MCP-Protocol-Version`, `Mcp-Method` or `Mcp-Name` header disagrees with its body answers `-32020`, and a protocol version this server does not serve answers `-32022` with the versions it serves in `error.data.supported`. A method the server does not offer answers `-32601`, and an id that is neither a string nor an integer answers `-32600`. A body that is not valid JSON, `NaN` and `Infinity` included, answers `-32700`, and a string that holds a lone surrogate escape such as `\ud800`, which stands for no character, answers `-32602` inside `params` and `-32600` anywhere else. `tools/list` returns every tool in one page and issues no cursor, so a request that sends a `cursor` answers `-32602`.
- Under the revision `2026-07-28` the codes `-32700`, `-32600`, `-32602`, `-32020` and `-32022` come back with HTTP 400 and `-32601` with HTTP 404. Under the earlier revisions only `-32700` and `-32600` come back with HTTP 400. Every other JSON-RPC error comes back with HTTP 200, the status at which the clients of the earlier revisions read it and keep their session.
- Failures of the tool run itself (a 403, 404, or 429 from the API, or the API being unreachable) come back as tool results with `isError` true and a machine-readable JSON body, so an agent can react. A request the API refuses with 422 comes back with the code `invalid_request` and a message naming the refused parameters or fields, such as query.stage or body.source_portal, the first 10 of them and a count of the rest, followed by the route's own reason where it states one in fixed text, such as an export window whose end is before its start, a tender upload mapping that needs a reference or a title column, a NACE code whose section does not match its division, or an events `group` the company does not hold, never a value you sent. A rate-limited result carries `retry_after_seconds` for backoff.
- A call that reads no workspace data, from an address that already made 60 such calls in the current calendar minute, answers HTTP 429 with `Retry-After` and a JSON-RPC error with the code `-32029`, whose `error.data.retry_after_seconds` holds the same wait. A call of a tool that reads workspace data, made with a key, never counts toward it.
- Two refusals come before any tool runs, as plain HTTP statuses. A request that carries an `Origin` header from any site other than `https://mcp.stonewake.ai` or `https://claude.ai` (the origin a custom connector in Claude sends) answers 403, a request without the header is served as usual, and a request body over 2,000,000 bytes answers 413.
- Tool responses wrap Stonewake data between `STONEWAKE_DATA` markers, and the response says that text inside the markers is data, not instructions for the model.
- A tool answer carries at most 50,000 bytes of text. A page of a list that would be longer, a page of `portfolio_import_preview` or `tender_export_preview` rows included, keeps its first rows whole, so the text between the markers stays one JSON document, and its `output_cap` object names the rows served in `items_served` and the offset to read on from in `next_offset`, while `limit`, `offset` and `total` stay as the API answered them, and so do the `counts` of either preview. A `company_network` answer that would be longer keeps the center and its first neighbors whole with the edges between them and says `truncated` true, and its `output_cap` names the neighbors served in `nodes_served`. A `country_profile` answer for one country that would be longer keeps its first deals whole and `deals_total` as the API answered it, and its `output_cap` names the deals served in `deals_served` and points at `deal_book` with `country_code` and `include_hidden` true, which reads every deal of the country. The `country_profile` index of every covered country is longer than that, so it keeps its first countries whole beside `regions` and `unassigned` as the API answered them, and its `output_cap` names the countries served in `countries_served` and the offset to read on from in `next_offset`; `country_profile` with that `offset` serves the index from that country on and names it in `countries_offset`. Any other answer that long is cut where the cap falls and ends with a line that starts `[TRUNCATED:` inside the markers, so ask for less, for example a shorter window or a smaller `timeline_limit`.

## Posture

Connecting an assistant does not widen the surface. The tools are read only views over the same workspace data as the REST API, person data follows the same rule as there (served where person data is switched on for your workspace, never in the sandbox, never scored), and the [Security](/security) and [Terms of use](/terms-of-use) pages cover MCP access exactly as they cover the API.
