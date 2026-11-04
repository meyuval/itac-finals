## ITAC judge compliance (always applicable)
For every ITAC 2026 task, consult `/itac-judge-guidelines` before making judge-relevant decisions and before declaring completion. Treat the organizer's final requirements as acceptance criteria. Do not invent evidence, hide failing tests, or claim the submission/video/SpiraTest/public links were verified without proof. Keep an evidence ledger and protect the 21:00 deadline. This is a governance/acceptance skill; use other skills for implementation. Escalate conflicts with newer instructions from the judges.

# Development Workflow

- Superpowers is the sole authority for development
  methodology, planning, TDD, debugging, and code review.
- Do not initiate competing planning or development workflows.
- Use Context7 when current external API documentation
  or version-specific behavior needs verification.
- Use language servers for navigation and diagnostics.
- Use Playwright MCP for browser interaction and UI validation.
- Use Security Guidance for security findings.
  Do not let security checks replace functional verification.
- Apply the `playwright-typescript` and `typescript-best-practices`
  skills as coding standards when writing or reviewing Playwright and
  TypeScript code. They supplement Superpowers' methodology; they do not
  replace it. Their example `retries: 2` CI setting does not apply to
  qualifying five-green runs (judge guidelines govern retries).
- Follow project conventions and existing test frameworks.
- Do not refactor unrelated code without explicit permission.
- Run relevant tests before reporting completion.

# Precedence

- The ITAC judge guidelines (`/itac-judge-guidelines`) always take
  priority over everything else in this file, including Superpowers,
  plugins, and other skills. Only newer explicit instructions from the
  judges override them.
