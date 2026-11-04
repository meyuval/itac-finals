import { test as base, expect, type BrowserContext } from '@playwright/test';
import { loadConfig, type Config } from '../../infrastructure/config/env';
import { ApiClient } from '../../infrastructure/http/api-client';
import { StonewakeApi } from '../api/stonewake-api';
import { WebApp } from '../app/web-app';

/** Cookies and origin storage of a browser context, as returned by `BrowserContext.storageState()`. */
export type SessionState = Awaited<ReturnType<BrowserContext['storageState']>>;

export interface WorkerFixtures {
  /** Validated configuration, loaded once per worker. */
  config: Config;
  /**
   * The worker's signed-in session, captured once by a real password sign-in.
   * Held in memory only: it is never written to disk, so it cannot leak into reports or artifacts.
   */
  workerSession: SessionState;
}

export interface TestFixtures {
  /** API facade authenticated with the workspace API key. */
  api: StonewakeApi;
  /** API facade with no credentials, for auth-boundary tests. */
  anonApi: StonewakeApi;
  /** Dashboard entry point on a fresh, signed-out page. */
  app: WebApp;
  /** Dashboard entry point on the worker's signed-in session, opened on the Deal Book. */
  loggedInApp: WebApp;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  config: [
    async ({}, use) => {
      await use(loadConfig());
    },
    { scope: 'worker' },
  ],

  api: async ({ request, config }, use) => {
    await use(new StonewakeApi(new ApiClient(request, config.apiUrl, `Bearer ${config.apiKey}`)));
  },

  anonApi: async ({ request, config }, use) => {
    await use(new StonewakeApi(new ApiClient(request, config.apiUrl)));
  },

  app: async ({ page }, use) => {
    await use(new WebApp(page));
  },

  /*
   * One password sign-in per worker instead of one per test. Verified live on 4 Nov 2026:
   * - the session is a single Supabase auth cookie; localStorage only remembers the terms tick;
   * - sign-out is local: signing out one session leaves other sessions and copies of a session valid;
   * - access tokens live 3600 s, far longer than a worker (the full UI run takes about 2.5 minutes).
   *   If a worker ever ran close to that, every test copying the same refresh token would refresh it,
   *   which Supabase may treat as token reuse.
   * Tests that sign out must sign in on their own (`app`), never on this shared session.
   */
  workerSession: [
    async ({ browser, config }, use) => {
      const context = await browser.newContext({ baseURL: config.appUrl });
      let session: SessionState;
      try {
        const app = new WebApp(await context.newPage());
        await app.login.goto();
        await app.login.signIn(config.email, config.password);
        await expect(app.page).toHaveURL(/\/$/);
        await expect(app.shell.pageHeading).toHaveText('Deal Book');
        session = await context.storageState();
      } finally {
        await context.close();
      }
      await use(session);
    },
    { scope: 'worker' },
  ],

  // Uses the built-in `context`, so trace, screenshot, device and baseURL settings still apply to every test.
  loggedInApp: async ({ app, context, workerSession }, use) => {
    await context.addCookies(workerSession.cookies);
    await app.dealBook.goto();
    await expect(app.page).toHaveURL(/\/$/);
    await expect(app.shell.pageHeading).toHaveText('Deal Book');
    await use(app);
  },
});

export { expect };
