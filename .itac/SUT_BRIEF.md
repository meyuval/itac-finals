# Stonewake — system under test brief (ITAC 2026 final)

Source: ITAC email 4 Nov 2026 17:25 ("הכירו את Stonewake") + public docs read 17:33–17:45. No account yet; nothing below about the signed-in UI is verified by hand.

## Surfaces
| Surface | URL | Notes |
|---|---|---|
| Marketing site | https://stonewake.ai | 2-min demo video on home page; Next.js |
| **Dashboard (UI under test)** | https://app.stonewake.ai/login | Email+password form, "Email me a link to sign in instead" (magic link), "Forgot your password?", mandatory checkbox "I agree to the Evaluation Terms and the Terms of Service". Only `data-testid` found on login: `login-forgot`. Auth backend: Supabase (CSP allows `*.supabase.co`). SPA, `noindex`. |
| REST API | https://api.stonewake.ai | OpenAPI 3.1, 77 paths, read-only `/v1`; `/health` is public: `{"status":"ok","app":"stonewake","version":"1.0.0","environment":"production"}` |
| OpenAPI | https://api.stonewake.ai/openapi.json | (email said `aoi.` = typo). Local copy: `.itac/sut-docs/openapi.json` |
| MCP server | https://mcp.stonewake.ai/ | Streamable HTTP, protocol rev 2026-07-28, `tools/list` works without key: **40 tools** (docs page says 38; extras are `search`, `fetch`) |
| Docs | https://docs.stonewake.ai (+ `/llms.txt`, any page as `.md`) | Local copies: `.itac/sut-docs/*.md` |

## Six judge-recommended flows (starting point, not a limit)
1. **Deal Book** — search + filter deals, open a deal with its summary/briefing + sources, export (Excel workbook; deal page: Download report PDF, Download deck PPTX). Tabs include **Following**. Filters: stage/financing window, sector, region; behind "Filters": institution, country, status; "Order" field. Held-back deals count with "show them" toggle. API: `GET /v1/deals`, `/v1/deals/{id}`; MCP `deal_book`.
2. **Screenings** — run a background (adverse media + official lists) check on a company, read result with sources. Requested in dashboard only; API/MCP read: `GET /v1/screenings`, `/v1/screenings/{id}`; MCP `screening_lookup`.
3. **Network & Institutions** — company profile, financing (charges, listed debt, maturity wall), ownership chain (threshold 25%, depth 8), network canvas graph (Min ownership, Current/All history/As of, "How are A and B connected?", Export CSV). API `/v1/nodes/{node_id}/…` (company, financing, ownership-chain, network); MCP `company_overview`, `company_financing`, `ownership_chain`, `company_network`.
4. **Countries** — list with risk 0–100 (higher = riskier), band strip filter, list flags (sanctions/EU AML/FATF), "Not scored" with reason, Export workbook; country page with weighted breakdown (CPI 25, WGI 20, OECD 12, adverse news 13, FATF 10, EU list 5, sanctions 15), Download report. API `/v1/countries`, `/v1/countries/{iso3}`; MCP `country_profile`.
5. **Monitoring & Portfolio** — Portfolio = monitored book (statuses Green/Amber/Red/No score yet/Not yet assessed/Sole trader), "Add a company to the monitored book", status changes feed with causes + acknowledge, reviews due, credit review record (disposition/note/owner/next review date). Monitoring = settings page (frequency hourly/daily/2 days/weekly, Active pause/resume). Following tab in Deal Book = "Follow a name". API `/v1/portfolio*`, `/v1/monitoring/targets`; MCP `portfolio_overview`, `portfolio_book`.
6. **API + MCP reads** — same data, both read-only. Bearer `swk_live_` + 40 chars. Keys are made by a workspace admin under Workspace settings (shown once). Lists: `limit`/`offset` → `{items, limit, offset, total}`.

Everything else is in scope too, incl. performance and security testing on the day.

## Behaviour facts useful for assertions
- Unauthenticated `/v1/*` → 401 `{"error":{"code":"unauthenticated","message":"Missing or invalid credentials."}}`; same body for a bad key (uniform by design).
- Every `/v1` response carries `RateLimit-Policy: "key-minute";q=120;w=60, "workspace-day";q=50000;w=86400`; keyed responses add `RateLimit`, `X-RateLimit-Limit/Remaining/Reset`; 429 adds `Retry-After` and `retry_after_seconds`.
- Error codes: unauthenticated 401, forbidden 403, not_found 404, method_not_allowed 405, content_too_large 413, validation_failed 422 (with `detail[]` of type/loc/msg), rate_limited / daily_quota_exceeded 429, internal_error 500, quota_unavailable / server_busy / service_unavailable 503. Branch on `error.code`.
- Signed-in person limits: 2,190 reads/min, 60 writes/min; PDF downloads and audit CSV 60/min.
- MCP no-data calls (tools/list, docs search): 60/min per IP → 429, JSON-RPC `-32029`. Missing key → `-32001`. Tool output wrapped in `STONEWAKE_DATA` markers, capped at 50,000 bytes with `output_cap`/`next_offset`.
- Person data is **never** served in the sandbox (workspace flag), and a person lookup answers a canonical 404.
- Accessibility page admits: many form fields labelled only by placeholder (so `getByLabel` may fail; prefer `getByRole`/`getByPlaceholder`), network graph is a canvas with no text alternative, no skip link.
- Product changed **today**: 22 changelog entries dated 4 Nov 2026 (Following tab replaces Sentiment tab, Monitoring became a settings page, Countries list dropped coverage %, Deal Book ordering reverted to financing-window-first, EDD Dossiers/Signals/Reports sidebar entries, officers read on first visit, `GET /v1/me` now returns `key`). Expect the inherited tests to be broken by these. Compare failing locators against `.itac/sut-docs/changelog.md` before touching code.

## Accounts and environment
- Live product, separate per-competition workspaces full of test data. Each contestant gets a personal invite from Stonewake to the registration email. **Not received as of 17:37 → check spam, then ask the judges.**
- Submission form (newer, from this email): https://forms.gle/TuATq3R2cu8hL8yY9 (20 Oct email had https://forms.gle/5Gzxy1XheLwrFkxu6).
- Product questions go through the judges to Stonewake's team.

## Do not publish
- Any `swk_live_` key, session cookies, Supabase tokens, workspace names, or the invite email contents. Playwright `storageState` files must be gitignored. Sanitize traces before Pages publish.
