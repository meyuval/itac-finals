import { test, expect } from '../../src/business/fixtures';
import { PORTFOLIO_TILES, STATUS_LABELS } from '../../src/business/pages/portfolio.page';

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

  test('UI-PF-02 status strip equals the API summary', async ({ loggedInApp, api }) => {
    const portfolio = loggedInApp.portfolio;
    await portfolio.goto();
    await expect(portfolio.summaryLine).toBeVisible();

    // Read the API right before asserting so both sides describe the same moment.
    const summary = await api.portfolioSummary();
    expect(summary.status).toBe(200);
    for (const status of PORTFOLIO_TILES) {
      await expect.poll(() => portfolio.tileCount(status), { message: `tile ${status}` }).toBe(summary.body.statuses[status]);
    }
    await expect
      .poll(() => portfolio.summaryCounts(), { message: 'summary line' })
      .toEqual({ activeExposures: summary.body.active_exposures, statusChanges30d: summary.body.status_changes_30d });

    // The book lists every exposure on one page (no pagination control was found live), so the
    // row count must equal the API total; guard that the total fits one API page first.
    const book = await api.portfolio({ limit: 100 });
    expect(book.status).toBe(200);
    expect(book.body.total).toBeLessThanOrEqual(100);
    await expect(portfolio.rows).toHaveCount(book.body.total);
  });

  test('UI-PF-04 row values are consistent with their status', async ({ loggedInApp }) => {
    const portfolio = loggedInApp.portfolio;
    await portfolio.goto();
    await expect(portfolio.rows.first()).toBeVisible();
    const count = await portfolio.rows.count();
    expect(count).toBeGreaterThan(0);

    const documented: string[] = Object.values(STATUS_LABELS);
    for (let i = 0; i < count; i++) {
      const row = portfolio.rows.nth(i);
      const status = (await (await portfolio.cell(row, 'Status')).innerText()).trim();
      const scoreCell = await portfolio.cell(row, 'Score');
      expect(documented, `row ${i} status`).toContain(status);
      if (status === STATUS_LABELS.insufficient) {
        // Verified live: an unscored cell renders no visible text and carries "Not scored"
        // as its accessible name (aria-label and title).
        await expect(scoreCell, `row ${i} score for ${status}`).toHaveAccessibleName('Not scored');
      }
      if ([STATUS_LABELS.green, STATUS_LABELS.amber, STATUS_LABELS.red].includes(status)) {
        await expect(scoreCell, `row ${i} score for ${status}`).toHaveText(/^\d+(\.\d+)?$/);
      }
    }
  });

  test('UI-PF-05 the first status change explains its cause like the API', async ({ loggedInApp, api }) => {
    const portfolio = loggedInApp.portfolio;
    await portfolio.goto();
    await expect(portfolio.statusChanges.first()).toBeVisible();

    // The UI list holds changes and additions, newest first, exactly like the API list
    // (verified live: entry 1 is transition id 509 in both), so the API's first row is entry 1.
    const transitions = await api.portfolioTransitions({ limit: 1 });
    expect(transitions.status).toBe(200);
    const [first] = transitions.body.items;
    expect(first, 'API returns at least one transition').toBeDefined();

    const entry = portfolio.statusChanges.first();
    await expect(entry.getByRole('link', { name: first.label, exact: true })).toBeVisible();
    await expect(entry).toContainText(STATUS_LABELS[first.to_status]);

    const panel = await portfolio.openWhy(0);
    await expect(portfolio.whyToggle(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel).not.toHaveText(/^\s*$/);
    if (!first.cause.available) {
      // Documented in credit-reviews.md: "the change says Cause not available and claims nothing else".
      await expect(panel).toContainText('Cause not available');
    }
  });
});
