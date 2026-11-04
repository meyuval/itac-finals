# Quickstart

From nothing to a first response in five minutes. You need API access enabled for your workspace (see [Keys and access management](/keys)) and an admin seat in the dashboard.

The fastest path of all is [MCP](/mcp). Paste `https://mcp.stonewake.ai/` plus your key into your AI assistant's connector or MCP settings and start asking questions. The rest of this page is the curl path.

## 1. Create a key

In the dashboard under Workspace settings, or over the API, a workspace admin creates an API key and copies the full key at creation. It is shown once and cannot be retrieved later. Put it in an environment variable.

```bash
export STONEWAKE_API_KEY="swk_live_EXAMPLExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

The value above is a placeholder; use your own key.

## 2. Call the API

Send the key as a Bearer token in the `Authorization` header.

```bash
curl https://api.stonewake.ai/v1/portfolio \
  -H "Authorization: Bearer $STONEWAKE_API_KEY"
```

## 3. Parse the JSON

Every endpoint returns plain JSON, so any JSON tooling works.

```bash
curl -s https://api.stonewake.ai/v1/portfolio \
  -H "Authorization: Bearer $STONEWAKE_API_KEY" | jq .
```

A `401` here means the key was not accepted; the response does not say why, see [Authentication](/authentication). A `403` or `429` is explained under [Errors and rate limits](/errors). The live endpoints are listed in the [API reference](/v1).

## For AI agents

If the agent speaks MCP, connect it to `https://mcp.stonewake.ai/` instead; see [MCP](/mcp). For an agent driving plain HTTP, paste this into its context.

```text
Stonewake API
Base URL: https://api.stonewake.ai
Auth: send an API key on every request as "Authorization: Bearer <key>".
Keys start with swk_live_ and are read-only.
Endpoints: read-only GETs under /v1 (portfolio, entity risk, rubrics,
registry, search, company nodes, financing, ownership, screenings,
deals, research (/v1/monitoring), countries, geography, watches,
runs, tenders and more) plus three POSTs that only read
(/v1/citations/resolve, /v1/portfolio/import,
/v1/tenders/portals/upload), all listed at
https://docs.stonewake.ai/v1.md
List endpoints page with limit/offset and answer
{items, limit, offset, total}.
MCP endpoint (same Bearer key): https://mcp.stonewake.ai/
Docs: https://docs.stonewake.ai
Docs index for machines: https://docs.stonewake.ai/llms.txt
Full docs as one file: https://docs.stonewake.ai/llms-full.txt
Every docs page is also plain markdown: request its path plus ".md",
or send "Accept: text/markdown".
Company site: every public page on https://stonewake.ai answers as
markdown the same two ways, and https://stonewake.ai/llms.txt says
when to use Stonewake and how to call it.
Shortcuts: https://stonewake.ai/docs, /developers, /api-docs, /mcp,
and /openapi.json redirect to these docs, the API reference, the MCP
page, and the OpenAPI schema.
Errors: 4xx bodies are JSON with a stable error.code; 401 means the
credential was refused (no reason is given). Traffic refusals:
rate_limited, daily_quota_exceeded, quota_unavailable.
Rate limits: every /v1 response carries RateLimit-Policy (the
ceilings: q requests per w seconds); keyed responses add RateLimit
(r requests left, t seconds to the reset).
Respect Retry-After on 429 responses.
```
