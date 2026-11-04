import { test as base, expect } from '@playwright/test';
import { loadConfig, type Config } from '../../infrastructure/config/env';
import { ApiClient } from '../../infrastructure/http/api-client';
import { StonewakeApi } from '../api/stonewake-api';
import { WebApp } from '../app/web-app';

export interface WorkerFixtures {
  /** Validated configuration, loaded once per worker. */
  config: Config;
}

export interface TestFixtures {
  /** API facade authenticated with the workspace API key. */
  api: StonewakeApi;
  /** API facade with no credentials, for auth-boundary tests. */
  anonApi: StonewakeApi;
  /** Dashboard entry point on a fresh, signed-out page. */
  app: WebApp;
  /** Dashboard entry point after a verified password sign-in (lands on Deal Book). */
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

  loggedInApp: async ({ app, config }, use) => {
    await app.login.goto();
    await app.login.signIn(config.email, config.password);
    await expect(app.page).toHaveURL(/\/$/);
    await expect(app.shell.pageHeading).toHaveText('Deal Book');
    await use(app);
  },
});

export { expect };
