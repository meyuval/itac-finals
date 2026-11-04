# Errors and rate limits

## Error bodies

Every refusal from the API carries one structured `error` object with a stable machine readable code, under `/v1` and on every other route alike, apart from a 413 that arrives without a body and the two sign in endpoints of the MCP server, `/oauth/authorize` and `/oauth/token`, which answer in the forms OAuth 2.0 sets (RFC 6749), a page for the person signing in and an `error` code as text.

```json
{ "error": { "code": "not_found", "message": "Resource not found." } }
```

Each code carries one fixed message, never one per call site, so a refusal does not reveal why a particular request was turned away. The one code with two messages is `quota_unavailable`, whose message names which of the two counts could not be verified. The codes served today are `unauthenticated` (401), `forbidden` (403), `not_found` (404), `method_not_allowed` (405), `content_too_large` (413), `validation_failed` (422), `rate_limited` and `daily_quota_exceeded` (429), `internal_error` (500), and `quota_unavailable`, `server_busy` and `service_unavailable` (503).

Each code and the message it carries.

| Code | Status | Message |
| --- | --- | --- |
| `unauthenticated` | `401` | `Missing or invalid credentials.` |
| `forbidden` | `403` | `The credential does not allow this request.` |
| `not_found` | `404` | `Resource not found.` |
| `method_not_allowed` | `405` | `Method not allowed.` |
| `content_too_large` | `413` | `The request body is too large.` |
| `validation_failed` | `422` | `The request failed validation.` |
| `rate_limited` | `429` | `Rate limit exceeded. Retry after the number of seconds in Retry-After.` |
| `daily_quota_exceeded` | `429` | `Daily quota exceeded. The quota resets at UTC midnight.` |
| `internal_error` | `500` | `The request failed.` |
| `quota_unavailable` | `503` | `The daily quota could not be verified. The request was refused.` or `The rate limit could not be verified. The request was refused.` |
| `server_busy` | `503` | `The server is busy. Retry after the number of seconds in Retry-After.` |
| `service_unavailable` | `503` | `The service is unavailable. Retry later.` |

Traffic refusals (the ceilings below) carry the same envelope plus a `retry_after_seconds` field.

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded. Retry after the number of seconds in Retry-After.",
    "retry_after_seconds": 21
  }
}
```

Branch on `error.code`, never on message text. Codes are stable. New codes may be added over time, and existing codes are not renamed.

A 422 request-validation refusal carries the envelope with code `validation_failed` and also names the offending parameter or field in `detail`. Each of its entries carries `type`, `loc` and `msg`, never the value you sent. Whatever the request holds, the body stays within a fixed size of at most 32,768 bytes. It lists the first 10 entries in the order the request was checked, and when there are more, one further entry of type `too_many_errors` with an empty `loc` counts them in its `msg`, such as `1990 more entries are not listed.` A name in `loc` longer than 64 bytes in the body and a `msg` longer than 2,048 bytes are cut and end in `...`. A query parameter the endpoint does not read is refused this way too, with type `extra_forbidden`, one entry for each such parameter with the parameter in `loc`, and a `msg` that names the parameters the endpoint reads, so a misspelt filter never answers a wider list. A parameter that takes one value, sent twice, is refused with type `value_error` naming it, whichever value comes first; a parameter that takes a list, such as `stage`, repeats as before. A path or query value that carries a NUL character, which no stored value can hold, is refused this way too, and so is a `file_name` that carries one on `POST /v1/tenders/portals/upload`.

The other entries you meet name the rule they apply.

| Type | Meaning |
| --- | --- |
| `literal_error` | A closed value outside its list, such as an unknown `stage`, a `country_code` that is no ISO 3166-1 alpha-3 code in upper case, or an `edge_types` entry that names no edge type. Closed values are read in the letter case the OpenAPI document lists, so `Financing` or `deu` is refused like an unknown value, and `msg` names the allowed values or the rule. |
| `finite_number` | A number that is not finite, such as `1e400`, `inf` or `nan`, in a query value or in a JSON body. |
| `timezone_aware` | A date-time without a UTC offset, such as `since` on `GET /v1/portfolio/transitions`. Send `Z` or an offset such as `+01:00`. |
| `too_many_errors` | The entries beyond the first 10, counted in `msg`. Its `loc` is empty. |
| `value_error` | A rule of the endpoint itself, which `msg` states, such as an export window whose end is before its start, a tender upload mapping without a title column, or a `group` that is no group of the node's events. Such a `msg` never repeats a value you sent. |

An id that names nothing, in the path or as a filter such as `profile_id` on `GET /v1/tenders/matches`, answers `404` with code `not_found`, never an empty page.

The same bounds hold for every other refusal that names what a request sent. A text `detail` is cut at 2,048 bytes, and an MCP tool call refused for arguments its tool does not declare names the first 10 of them and counts the rest.

The dashboard's own routes, the management endpoints under `/org/api-keys` among them, carry the same envelope. There the message is the sentence the dashboard shows, and the same sentence also comes as `detail`, kept for clients written before the envelope.

```json
{ "error": { "code": "not_found", "message": "API key not found." }, "detail": "API key not found." }
```

## Status codes

| Status | Meaning |
| --- | --- |
| `200` | The request succeeded. |
| `401` | The credential was missing or not accepted. One body for every refusal cause; see [Authentication](/authentication). |
| `403` | The action is not available to your workspace. Creating a key without API access enabled answers 403; see [Keys and access management](/keys). |
| `404` | The resource does not exist in your workspace. The API does not distinguish between a resource that does not exist and one that belongs to another workspace. |
| `405` | The method is not supported. `/v1` endpoints accept GET only, except `POST /v1/citations/resolve`, `POST /v1/portfolio/import` and `POST /v1/tenders/portals/upload`. |
| `413` | The request body is too large. A request body carries at most 1,000,000 bytes, a book import at most 2,000,000. This refusal can arrive without a body. |
| `422` | The request failed validation, code `validation_failed`. `detail` names the parameter or field. |
| `429` | A traffic ceiling was reached; see below. |
| `500` | The request failed on our side, code `internal_error`. The body never carries an internal detail. Retry with backoff. |
| `503` | The request could not be served safely; retry later. See `quota_unavailable` and `server_busy` below. |

## Rate limits

Two ceilings apply to every request an API key authenticates.

- A per key rate limit over a one minute window.
- A per workspace daily quota across all the workspace's keys, which resets at midnight UTC.

Every `/v1` response states the ceilings in the `RateLimit-Policy` header below, so a client can read them before it holds a key. The header is the authority, and the values in the examples on this page are examples.

A workspace can hold ceilings of its own instead of the defaults, agreed with Stonewake, for example for a load test. They apply to every key of the workspace from its next request on, and the `RateLimit-Policy` of a response to one of its keys states them, while a response to a request without a key states the defaults.

A signed in person meets ceilings of their own instead, on every request their session makes in the dashboard and under `/v1`, counted per person in each calendar minute. They allow at most 2,190 reads (`GET` and `HEAD`) and 60 writes (any other method). On the five PDF downloads and on `GET /v1/audit-log.csv` a person's requests, reads included, also count against a ceiling of 60 a minute. The `RateLimit-Policy` header names the ceilings of a key only, and a response to a person carries no `RateLimit` state. Under `/v1` a request over a ceiling is refused with a `429` with code `rate_limited`, `Retry-After` and `retry_after_seconds`, and one whose minute cannot be counted with a `503` with code `quota_unavailable`, as for a key.

Requests without a credential are counted per client address in each calendar minute. The schema at `/openapi.json` and the explorer under `/docs` serve one address at least 1,200 requests a minute and refuse a flood beyond that. The MCP server takes 60 calls a minute from one address that read no workspace data, such as `initialize`, `tools/list` and `search_stonewake_docs`, while a call of a tool that reads workspace data, made with a key, counts against that key alone. A request over such a ceiling is refused with a `429` and `Retry-After`, by the API with code `rate_limited` and `detail` reading `Rate limit exceeded; slow down.`, by the MCP server with the JSON-RPC error code `-32029` and `retry_after_seconds` in `error.data`.

### Response headers

The API publishes the IETF RateLimit header fields (`draft-ietf-httpapi-ratelimit-headers`, Structured Fields syntax) next to the older `X-RateLimit-*` headers. Header names are case-insensitive.

Every `/v1` REST response carries the policy, whether or not the request was authenticated (401, 403, 404 and 429 refusals included).

| Header | Meaning |
| --- | --- |
| `RateLimit-Policy` | The ceilings that apply, one item per ceiling. `q` is the quota in requests, `w` the window in seconds. The `key-minute` item is the per-key rate limit; the `workspace-day` item is the per-workspace daily quota, whose window is the UTC calendar day. |

```text
RateLimit-Policy: "key-minute";q=120;w=60, "workspace-day";q=50000;w=86400
```

Every `/v1` REST response to a request an API key authenticates additionally carries the state of the minute window, traffic refusals included.

| Header | Meaning |
| --- | --- |
| `RateLimit` | The live state of the `key-minute` policy, where `r` is the number of requests left in the current window, `t` the number of seconds until the window resets. |
| `X-RateLimit-Limit` | The per-minute ceiling for this key. |
| `X-RateLimit-Remaining` | Requests left in the current window; equal to `r`. |
| `X-RateLimit-Reset` | When the current window resets, as a Unix timestamp in seconds; `t` seconds from the response. |

```text
RateLimit: "key-minute";r=87;t=42
```

429 responses additionally carry a `Retry-After` header, in seconds. On a `rate_limited` 429 it equals `t`; on a `daily_quota_exceeded` 429 it counts to midnight UTC and takes precedence over `t`.

MCP responses do not carry these headers. A rate limited MCP tool call comes back as a tool result carrying `retry_after_seconds` inside the result body instead; see [MCP](/mcp). A call over the MCP server's own ceiling for calls that read no workspace data, described above, answers HTTP `429` with `Retry-After`.

### 429 with code `rate_limited`

A minute ceiling was exceeded, the rate limit of a key or a signed in person's own ceiling. The window is short; wait for `Retry-After` seconds and retry.

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded. Retry after the number of seconds in Retry-After.",
    "retry_after_seconds": 21
  }
}
```

### 429 with code `daily_quota_exceeded`

The workspace's daily quota was exhausted. `Retry-After` counts to midnight UTC, when the quota resets.

```json
{
  "error": {
    "code": "daily_quota_exceeded",
    "message": "Daily quota exceeded. The quota resets at UTC midnight.",
    "retry_after_seconds": 14580
  }
}
```

### 503 with code `quota_unavailable`

Usage accounting (the daily quota, or the per minute window the API's processes share) could not be reached, so the request was refused rather than served unmetered. There is no `Retry-After`; retry with backoff. The message names which of the two could not be verified.

```json
{
  "error": {
    "code": "quota_unavailable",
    "message": "The daily quota could not be verified. The request was refused."
  }
}
```

### 503 with code `server_busy`

Too many reads of very large companies or too many document renders were running at once, so this request was refused before any data was sent. `GET /v1/nodes/{node_id}` answers it for a company with a very large record book, and the five PDF downloads answer it while every render slot is taken. Every cause carries the same message, `The server is busy. Retry after the number of seconds in Retry-After.` Wait for `Retry-After` seconds and retry. A very large company's records can also be paged with `GET /v1/nodes/{node_id}/records`; see the [API reference](/v1).

A request whose database statement runs past the server's time limit for one statement is stopped. If nothing of the answer was sent yet, it answers the same refusal with `Retry-After` 15. A download that is already streaming ends early instead, without that refusal. Retry it once after the wait. If it is refused again, narrow it, for example with a smaller page or a shorter period.

```json
{
  "error": {
    "code": "server_busy",
    "message": "The server is busy. Retry after the number of seconds in Retry-After.",
    "retry_after_seconds": 3
  }
}
```

## Retry guidance

- On 429, wait for the number of seconds in `Retry-After`, then retry.
- On 503 with `server_busy`, wait for the number of seconds in `Retry-After`, then retry. On any other 503, retry with exponential backoff and a bounded number of attempts.
- Pace steady workloads against `RateLimit` (`r` requests left, `t` seconds to the reset) rather than reacting to refusals.
