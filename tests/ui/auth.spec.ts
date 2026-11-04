import { test, expect } from '../../src/business/fixtures';

const WRONG_PASSWORD_MESSAGE = 'That email and password do not match. Check both and try again.';

test.describe('UI: authentication', () => {
  // inherited: ui 1 login ok
  test('password sign-in lands on the Deal Book with the module sidebar', async ({ app, config }) => {
    await app.goto('/');
    await expect(app.page).toHaveURL(/\/login/);
    await expect(app.page).toHaveTitle('Sign in · Stonewake');
    await expect(app.login.heading).toBeVisible();

    await app.login.signIn(config.email, config.password);

    await expect(app.page).toHaveURL(/\/$/);
    await expect(app.page).toHaveTitle('Deal Book · Stonewake');
    await expect(app.shell.pageHeading).toHaveText('Deal Book');
    await expect(app.shell.sidebar).toContainText('Team');
    await expect(app.shell.moduleLink('Deal Book')).toBeVisible();
    await expect(app.shell.moduleLink('Portfolio')).toBeVisible();
    await expect(app.shell.moduleLink('Countries')).toBeVisible();
    await expect(app.shell.signOutButton).toBeVisible();
  });

  // inherited: ui 2 wrong password
  test('wrong password keeps the user on the sign-in page with a clear message', async ({ app, config }) => {
    await app.login.goto();
    await app.login.signIn(config.email, 'definitely-wrong-password-123');

    await expect(app.login.errorMessage(WRONG_PASSWORD_MESSAGE)).toBeVisible();
    await expect(app.page).toHaveURL(/\/login$/);
    await expect(app.login.heading).toBeVisible();
    await expect(app.shell.sidebar).toHaveCount(0);
  });

  // inherited: ui 3 terms checkbox
  test('sign-in stays disabled until the evaluation terms are accepted', async ({ app, config }) => {
    await app.login.goto();
    await expect(app.login.signInButton).toBeDisabled();

    await app.login.fillCredentials(config.email, config.password);
    await expect(app.login.signInButton).toBeDisabled();

    await app.login.acceptTerms();
    await expect(app.login.termsCheckbox).toBeChecked();
    await expect(app.login.signInButton).toBeEnabled();

    await app.login.acceptTerms();
    await expect(app.login.termsCheckbox).not.toBeChecked();
    await expect(app.login.signInButton).toBeDisabled();

    await expect(app.login.termsOfServiceLink).toHaveAttribute('href', 'https://stonewake.ai/terms');
  });

  // inherited: ui 4 not logged in redirect
  test('protected routes redirect an anonymous visitor to sign-in', async ({ app }) => {
    for (const route of ['/', '/portfolio', '/countries/DEU', '/entities']) {
      await app.goto(route);
      await expect(app.page, route).toHaveURL(/\/login$/);
      await expect(app.login.heading, route).toBeVisible();
    }
    await expect(app.shell.sidebar).toHaveCount(0);
  });

  // inherited: ui 5 logout
  // Signs in on its own session: signing out the worker's shared session would sign out the tests after it.
  test('sign-out ends the session and protected routes redirect again', async ({ app, config }) => {
    await app.login.goto();
    await app.login.signIn(config.email, config.password);
    await expect(app.page).toHaveURL(/\/$/);
    await expect(app.shell.pageHeading).toHaveText('Deal Book');

    await app.shell.signOut();
    await expect(app.page).toHaveURL(/\/login$/);
    await expect(app.login.heading).toBeVisible();

    await app.goto('/portfolio');
    await expect(app.page).toHaveURL(/\/login$/);
    await expect(app.login.heading).toBeVisible();
  });
});
