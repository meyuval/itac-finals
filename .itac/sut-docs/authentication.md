# Authentication

Every request to the Stonewake API carries an API key as a Bearer token in the `Authorization` header.

```bash
curl https://api.stonewake.ai/v1/portfolio \
  -H "Authorization: Bearer swk_live_EXAMPLExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

The key above is a placeholder. Real keys are the prefix `swk_live_` followed by 40 random characters.

The scheme `Bearer` is read in any letter case, so `bearer` and `BEARER` work too. A space separates it from the key, and further spaces or tabs before the key and any spaces or tabs after it are ignored. No other character is trimmed, so any other character before, inside or after the key makes it a different key, which is refused like a wrong key. A tab in place of that space, the scheme without a key, or another scheme sends no key at all. The [MCP](/mcp) server reads the header the same way.

## How keys work

- Keys are created by a workspace admin in the dashboard under Workspace settings, or over the API. See [Keys and access management](/keys).
- The full key is shown exactly once, at creation. It is stored as a one-way hash and cannot be retrieved again. If a key is lost, create a new one.
- Keys are scoped to your workspace. A key can only read data that belongs to the workspace it was created in, and its books (deals, portfolio, screenings) are those of the one team it was issued for. See [Identity and team scope](/v1#identity-and-team-scope).
- Keys work only on the REST API under `/v1` and on the [MCP](/mcp) server. Any other endpoint, including the dashboard's own endpoints and key management, refuses a key with `401`, exactly as it refuses an invalid key.
- Keys are read-only. A key cannot change anything in your workspace, and it cannot manage keys, including itself.
- Keys are revocable instantly. Revocation takes effect on the key's next request.
- Keys can carry an optional expiry, set when a key is created over the API. A key created without one, which includes every key created in the dashboard, stays valid until it is revoked.

## The 401 posture

A `/v1` request whose credential is missing or not accepted receives one and the same response, whatever the reason.

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "Missing or invalid credentials."
  }
}
```

A missing header, a malformed key, a wrong key, a revoked key, an expired key, and a key from a workspace whose API access has lapsed are indistinguishable in the response. The API does not reveal why a credential was refused, or whether it ever existed. If a previously working key starts receiving 401, check its status in the dashboard.

## Handling rules

Treat API keys like passwords.

- Never put a key in a URL or query string. It travels in the `Authorization` header only.
- Never ship a key in client-side code or anything a browser downloads. Calls belong on your server side.
- Keep keys out of source control and logs. Store them in a secrets manager or an environment variable.
- Rotate on suspicion. If a key may have been exposed, create a replacement and revoke the old key immediately.
