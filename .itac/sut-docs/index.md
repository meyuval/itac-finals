# Stonewake API

The Stonewake API provides read-only programmatic access to the intelligence in your Stonewake workspace, namely credit monitoring, entity risk, and counterparty and country intelligence for export finance teams.

Responses are plain JSON over HTTPS. The API is read only by design, and no endpoint creates, changes or deletes anything in your workspace.

```text
Base URL: https://api.stonewake.ai
```

## Who gets access

The API is available to Stonewake customers, by arrangement. Access is enabled per workspace by Stonewake; once enabled, a workspace admin creates and manages API keys in the dashboard. To arrange access for your workspace, contact your Stonewake representative or write to contact@stonewake.ai.

## Built for developers and AI agents

The API is designed to be operated by software, whether that software is written by hand or driven by an AI agent. Responses use stable field names, refusals carry machine-readable error codes rather than prose to parse, and this documentation is itself machine readable, so every page is also served as plain markdown, at its path plus `.md` or by sending `Accept: text/markdown`, and the site root serves [llms.txt](/llms.txt) (a one-line index of every page) and [llms-full.txt](/llms-full.txt) (all pages as one markdown file). The company site works the same way, and every public page on [stonewake.ai](https://stonewake.ai) is also served as markdown, and [stonewake.ai/llms.txt](https://stonewake.ai/llms.txt) says when to use Stonewake and how to call it. If you are wiring up an agent, the [Quickstart](/quickstart) ends with a block you can paste straight into its context, and MCP-capable assistants can skip HTTP entirely and connect over [MCP](/mcp).

## Contents

- [Quickstart](/quickstart), from key to first response in five minutes.
- [Authentication](/authentication), Bearer keys, the `swk_live_` format, and handling rules.
- [Keys and access management](/keys), creating, listing, and revoking keys.
- [API reference](/v1), every live /v1 endpoint, pagination, and response posture.
- [MCP](/mcp) connects Claude, Cursor, or any MCP client to your workspace.
- [Errors and rate limits](/errors), status codes, error bodies, and traffic ceilings.
- [API security](/security), the API's security posture, the role of AI, and how to report a security issue.
- [Terms of use](/terms-of-use), what access may be used for, and the obligations that travel with the data.

## For your IT and security review

- [Security overview](/security-overview), the platform's security posture on one page.
- [Enterprise onboarding](/enterprise-onboarding), workspace, teams, roles, and user lifecycle.
- [Data handling](/data-handling), sources, citations, retention, and legal basis.
- [Single sign on](/sso) is the administrator guide for single sign on per workspace, with the steps for Microsoft Entra ID.
- [Coverage](/coverage) states countries, datasets, sources and registers as read from the live API.
- [Support](/support) says how to reach us and what to expect.
- [Changelog](/changelog) lists the customer visible changes that are live.
