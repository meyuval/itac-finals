import { test, expect } from '../../src/business/fixtures';
import { PORTFOLIO_TILES } from '../../src/business/pages/portfolio.page';

test.describe('UI: Portfolio', () => {
  // inherited: ui 10 portfolio
  test('status tiles are shown and a monitored row opens its institution page', async ({ loggedInApp }) => {
    const portfolio = loggedInApp.portfolio;
    await portfolio.goto();
    await expect(portfolio.heading).toHaveText('Portfolio');
    for (const status of PORTFOLIO_TILES) {
      await expect(portfolio.tile(status), status).toBeVisible();
    }

    const firstRow = portfolio.monitoredRowLinks.first();
    await expect(firstRow).toBeVisible();
    const name = (await firstRow.innerText()).trim();
    expect(name).not.toBe('');

    await firstRow.click();
    // The row link opens /entities/n<id>?from=portfolio; the query string is part of the product's navigation.
    await expect(loggedInApp.page).toHaveURL(/\/entities\/n\d+(\?.*)?$/);
    await expect(portfolio.heading).toHaveText(name);
  });
});
