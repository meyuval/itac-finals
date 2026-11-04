---
name: playwright-typescript
description: Best practices for writing Playwright end-to-end tests in TypeScript. Use when authoring or reviewing Playwright tests, choosing locators, writing assertions, structuring fixtures/page objects, handling waits, or configuring playwright.config. Includes the community-recommended locator priority order (getByRole first). Keywords - playwright, e2e, locator, getByRole, getByTestId, fixture, page object, web-first assertion, auto-wait, test.
---

# Playwright + TypeScript Best Practices

Guidance for writing resilient, readable Playwright E2E tests in TypeScript. For general TypeScript rules (strict config, `unknown` over `any`, narrowing, etc.) also apply [[typescript-best-practices]] — this skill covers only what is Playwright-specific.

## 1. Locator priority order (most important)

Prefer **user-facing, accessible locators** over implementation details (CSS/XPath). The Playwright community / official docs recommend this order — use the **first one that fits**, falling back down the list only when it doesn't:

1. **`getByRole(role, { name })`** — the default choice. Mirrors how users and assistive tech perceive the page. Covers buttons, links, headings, checkboxes, textboxes, etc.
2. **`getByLabel(text)`** — form controls associated with a `<label>`. Best for inputs.
3. **`getByPlaceholder(text)`** — inputs identified by placeholder (when there's no label).
4. **`getByText(text)`** — non-interactive text content (paragraphs, divs, spans).
5. **`getByAltText(text)`** — images and elements with `alt`.
6. **`getByTitle(text)`** — elements with a `title` attribute.
7. **`getByTestId(id)`** — explicit `data-testid`. Use when nothing user-facing is stable, or for elements with no accessible handle. Reliable but not user-facing.
8. **CSS / XPath (`page.locator('...')`)** — **last resort only.** Brittle, breaks on markup/style changes. Avoid XPath especially.

```ts
// Good — role + accessible name
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('a@b.com');

// Form field without a role-name handle
await page.getByLabel('Password').fill('secret');

// Only when nothing above is available
await page.getByTestId('user-menu').click();

// Avoid
await page.locator('.btn.btn-primary > span:nth-child(2)').click();
```

Rule of thumb: **if a test breaks when CSS classes change, the locator was wrong.** Picking `getByRole` also surfaces accessibility gaps in the app under test.

### Scoping and filtering

- Chain locators to scope: `page.getByRole('listitem').filter({ hasText: 'Product 2' })`.
- Use `.filter({ has, hasText, hasNotText })` instead of brittle indexes.
- Prefer `.and()` / `.or()` over complex CSS.
- Avoid positional selectors like `.nth(0)` / `.first()` unless the position is semantically meaningful.

## 2. Web-first assertions (auto-retrying)

Use `expect(locator)` matchers — they **auto-wait and retry** until the condition holds or times out. Never assert on a resolved value you grabbed manually.

```ts
// Good — retries until visible
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
await expect(page.getByRole('alert')).toHaveText('Saved');

// Bad — reads once, no retry, flaky
expect(await page.getByRole('alert').textContent()).toBe('Saved');
```

Key matchers: `toBeVisible`, `toBeEnabled`, `toBeChecked`, `toHaveText`, `toHaveValue`, `toHaveCount`, `toHaveURL`, `toContainText`.

## 3. Never use manual waits

- **No `page.waitForTimeout(ms)`** in committed tests — it's the #1 source of flakiness. Actions and web-first assertions auto-wait.
- Prefer waiting on **state**, not time: `expect(...).toBeVisible()`, `page.waitForURL()`, `page.waitForResponse()`, `locator.waitFor()`.
- Playwright actions (`click`, `fill`, etc.) already wait for actionability (visible, stable, enabled, receives events).

## 4. Test structure and isolation

- Each test must be **fully independent** — no shared mutable state, any order, parallel-safe.
- Use `test.beforeEach` for common setup (navigation, login); keep it minimal.
- One behavior per test; name tests by behavior: `test('shows error on invalid login', ...)`.
- Group with `test.describe`. Use `test.step()` to document multi-stage flows in the trace/report.
- Avoid conditional logic (`if/else`) and loops that change what's asserted — tests should be deterministic.

## 5. Fixtures over duplication

Prefer Playwright **fixtures** to share setup (auth, seeded data, page objects) with automatic teardown. Type them:

```ts
import { test as base } from '@playwright/test';

type Fixtures = { todoPage: TodoPage };

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
    // teardown after use()
  },
});
export { expect } from '@playwright/test';
```

For login state across tests, use `storageState` (set up once in global setup / a project dependency) rather than logging in per test.

## 6. Page Object Models (typed)

Encapsulate page interactions behind typed classes. Expose intent-level methods and keep locators private.

```ts
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
```

- POMs hold **actions**, not assertions (assert in the test, or expose state-returning methods).
- Type `page`, parameters, and return types explicitly (public boundary).

## 7. Configuration essentials (`playwright.config.ts`)

- Write the config in **TypeScript** (`playwright.config.ts`) for type-checked options.
- Set `use.baseURL` so tests use relative paths (`page.goto('/login')`).
- Enable CI-friendly settings:

```ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

- Use `trace: 'on-first-retry'` — invaluable for debugging flakes without slowing passing runs.
- Use `webServer` to auto-start the app under test when running locally/CI.

## 8. Debugging and authoring aids

- Generate selectors with `npx playwright codegen` — but **review and upgrade** the output to role-based locators.
- `npx playwright test --ui` for the UI mode; `--debug` for the inspector.
- Open traces with `npx playwright show-trace`.

## Review checklist

When reviewing Playwright tests, flag:
- [ ] CSS/XPath locators where a `getByRole`/`getByLabel`/`getByTestId` would work
- [ ] `page.waitForTimeout()` / arbitrary sleeps
- [ ] Non-retrying assertions (`expect(await locator.textContent())...`)
- [ ] `.nth()` / `.first()` / positional selectors used as a crutch
- [ ] Tests that depend on another test's state or run order
- [ ] Repeated login/setup that should be a fixture or `storageState`
- [ ] Assertions living inside page objects
- [ ] Conditionals/loops that make a test non-deterministic
- [ ] Config in `.js` instead of type-checked `.ts`; missing `baseURL` or `trace`
