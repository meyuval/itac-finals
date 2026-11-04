import type { Locator } from '@playwright/test';
import { test, expect } from '../../src/business/fixtures';
import type { WebApp } from '../../src/business/app/web-app';

/** Opens the first monitored company from the book; returns its row name and Status cell text. */
async function openFirstMonitoredCompany(app: WebApp): Promise<{ name: string; rowStatus: string }> {
  await app.portfolio.goto();
  const link: Locator = app.portfolio.monitoredRowLinks.first();
  await expect(link).toBeVisible();
  const headers = await link.locator('xpath=ancestor::table[1]').locator('thead th').allTextContents();
  const statusIndex = headers.findIndex((h) => h.trim().toLowerCase() === 'status');
  expect(statusIndex, 'Portfolio table has a Status column').toBeGreaterThanOrEqual(0);
  const name = (await link.innerText()).trim();
  const rowStatus = (await link.locator('xpath=ancestor::tr[1]').locator('td').nth(statusIndex).innerText()).trim();
  expect(name).not.toBe('');
  expect(rowStatus).not.toBe('');
  await link.click();
  await expect(app.page).toHaveURL(/\/entities\/n\d+/);
  return { name, rowStatus };
}

test.describe('UI: Company page', () => {
  test('UI-NET-03 company page opened from the book matches its row and the API', async ({ loggedInApp, api }) => {
    const company = loggedInApp.company;
    const { name, rowStatus } = await openFirstMonitoredCompany(loggedInApp);

    await expect(company.heading).toHaveText(name);
    await expect(company.statusBadge).toHaveText(rowStatus);

    const node = await api.node(company.nodeId());
    expect(node.status).toBe(200);
    // Verified live: the heading shows the register label exactly as the API serves it (same case).
    await expect(company.heading).toHaveText(node.body.label);
    await expect(company.section('Ownership chain')).toBeVisible();
  });

  test('UI-NET-04-lite ownership section agrees with the API chain', async ({ loggedInApp, api }) => {
    const company = loggedInApp.company;
    await openFirstMonitoredCompany(loggedInApp);
    const ownership = company.section('Ownership chain');
    await expect(ownership).toBeVisible();

    const chain = await api.nodeOwnershipChain(company.nodeId());
    expect(chain.status).toBe(200);
    const body = chain.body;

    // The UI's default threshold must be the one the API chain was computed with.
    await expect(ownership.getByRole('button', { name: `${body.params.threshold}%`, exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // A path with no hops is a terminal statement (e.g. no source coverage), not an owner.
    const ownerIds = body.paths.flatMap((p) => p.hops.map((h) => h.owner_id));
    if (ownerIds.length > 0) {
      const firstOwner = body.nodes.find((n) => n.node_id === ownerIds[0]);
      expect(firstOwner, 'chain nodes include the first owner').toBeDefined();
      await expect(ownership).toContainText(firstOwner!.label, { ignoreCase: true });
    } else {
      // No owner traced: the card shows the coverage statement keyed by the API's coverage verdict.
      await expect(ownership.getByTestId(`ubo-coverage-${body.coverage.verdict}`)).toBeVisible();
    }
  });
});
