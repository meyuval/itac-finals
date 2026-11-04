# Keys and access management

API access is enabled per workspace by Stonewake, as part of your arrangement. Once enabled, workspace admins manage keys themselves. To arrange access for your workspace, contact your Stonewake representative or write to contact@stonewake.ai.

## In the dashboard

A workspace admin can create, inspect, and revoke the workspace's keys in the dashboard under Workspace settings, or over the API (the next section). The full key is displayed once, at creation. What remains visible afterwards is each key's name, its display prefix (the first characters of the key, for matching a key you hold against the list), and its usage metadata.

## Over the API

The same operations exist as endpoints under `/org/api-keys`. These are management endpoints. They authenticate with a workspace admin's session credential, the same identity the dashboard uses, not with an API key. API keys work only on `/v1` and the MCP server, so a key sent here is refused with `401` and cannot manage keys.

### Create a key

`POST /org/api-keys`

```json
{
  "name": "reporting-pipeline",
  "expires_at": "2027-01-01T00:00:00Z",
  "team_id": "9d09b3e5e187"
}
```

`name` is required, 1 to 120 characters. `expires_at` is optional; when present it must carry a timezone and lie in the future, otherwise the request is refused with 422. Without it the key stays valid until it is revoked; keys created in the dashboard carry no expiry. `team_id` is optional and names the one team of your workspace the key reads, as the dashboard's key form offers them; omitted, the key reads the default team. A team id that is not one of your workspace's teams is refused with 422. How team scope works is described under [Identity and team scope](/v1#identity-and-team-scope). On success the response is `201`.

```json
{
  "secret": "swk_live_EXAMPLExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "key": {
    "id": "6e9c8a2f-6d1c-4a0b-9d5e-3f2a1b0c9d8e",
    "name": "reporting-pipeline",
    "key_prefix": "swk_live_EXA",
    "role": "viewer",
    "scopes": ["read"],
    "team_id": "9d09b3e5e187",
    "team_name": "Export Finance",
    "created_by": "admin@example.com",
    "created_at": "2026-08-13T09:30:00Z",
    "last_used_at": null,
    "expires_at": "2027-01-01T00:00:00Z",
    "revoked_at": null
  }
}
```

`secret` is the full key and appears only in this response. Store it immediately; it is not retrievable afterwards.

A key created with an expiry shows it in the dashboard's key list and in `GET /v1/me`, beside its role and scopes.

`audit_export` is optional. With `true` the key also gets the `audit` scope and may read your workspace's audit log at `GET /v1/audit-log.csv` and through the MCP tool `audit_log_export` (see [API reference](/v1#audit-log)). The key stays a read only key of its team for everything else. In the dashboard the key form offers the same choice. Give the audit scope only to the system that collects your audit trail, for example your SIEM.

`report_downloads` is optional. With `true` the key also gets the `reports` scope and may download the report and committee pack PDFs of what it reads (see [API reference](/v1#documents)), for example into a SharePoint library (see [SharePoint](/sharepoint)). The key stays a read only key of its team for everything else. In the dashboard the key form offers the same choice as Can also download reports and packs as PDF.

If API access is not enabled for the workspace, creation is refused with `403`.

```json
{
  "error": {
    "code": "forbidden",
    "message": "API access is not enabled for your workspace. Contact your Stonewake representative."
  },
  "detail": "API access is not enabled for your workspace. Contact your Stonewake representative."
}
```

A key reads the team it was issued for as long as that team exists. If the team is deleted, the key reads nothing and is never moved to another team. Every `/v1` request it makes, and every MCP tool call with it that reads your workspace, is refused with `403` and the `forbidden` error code (see [Errors and rate limits](/errors)).

The key list then shows that key with `team_name` set to `null`. Revoke it and create a new key for one of the current teams.

### List keys

`GET /org/api-keys` responds `200` with the workspace's keys, newest first, and the workspace's API access status.

```json
{
  "api_access_active": true,
  "api_access_expires_at": "2026-11-13T00:00:00Z",
  "keys": [
    {
      "id": "6e9c8a2f-6d1c-4a0b-9d5e-3f2a1b0c9d8e",
      "name": "reporting-pipeline",
      "key_prefix": "swk_live_EXA",
      "role": "viewer",
      "scopes": ["read"],
      "team_id": "9d09b3e5e187",
      "team_name": "Export Finance",
      "created_by": "admin@example.com",
      "created_at": "2026-08-13T09:30:00Z",
      "last_used_at": "2026-08-13T11:02:41Z",
      "expires_at": "2027-01-01T00:00:00Z",
      "revoked_at": null
    }
  ]
}
```

Revoked keys stay in the list. Keys are never deleted, so the list is a complete history. `api_access_expires_at` is populated only while access is active and carries an end date; otherwise it is `null`. Listing works even when the workspace's API access has lapsed, so you can always see your keys.

### Revoke a key

`POST /org/api-keys/{key_id}/revoke` responds `200` with the key's metadata, `revoked_at` now set.

- Revocation is immediate, and the key is refused from its next request onwards.
- Revoking an already revoked key changes nothing; the original `revoked_at` is kept.
- An unknown key id responds `404` with `{ "error": { "code": "not_found", "message": "API key not found." }, "detail": "API key not found." }`. A key id belonging to another workspace answers the same 404; the API does not confirm the existence of anything outside your workspace.
- Revocation works regardless of the workspace's API access status. You can always kill a key.

### Key object fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | The key's identifier, used in the revoke path. |
| `name` | string | The label given at creation. |
| `key_prefix` | string | The first characters of the full key, for matching. |
| `role` | string | Always `viewer` in this version. |
| `scopes` | array | `["read"]`, with `"audit"` added for a key created with `audit_export` and `"reports"` added for a key created with `report_downloads`. These two scopes are the ones that are checked. `audit` lets the key also read `GET /v1/audit-log.csv`, and `reports` lets it download the PDF documents under [Documents](/v1#documents). Everything else a key can reach is set by the `/v1` boundary. |
| `team_id` | string | The one team the key reads. A key issued before a team could be chosen shows the default team, which is what it reads. |
| `team_name` | string or null | That team's name; `null` once the team has been deleted, when the key is refused. |
| `created_by` | string | The admin who created the key. |
| `created_at` | timestamp | When the key was created. |
| `last_used_at` | timestamp or null | When the key last authenticated a request. Refreshed periodically, so it can lag recent use by a short interval. |
| `expires_at` | timestamp or null | The optional expiry set at creation; `null` means the key does not expire. |
| `revoked_at` | timestamp or null | When the key was revoked, if it was. |
