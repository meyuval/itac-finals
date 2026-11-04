import { test, expect } from '../../src/business/fixtures';

test.describe('UI: Deal Book', () => {
  // inherited: ui 7 deal book search
  test('search narrows the deal list and a deal opens with its briefing', async ({ loggedInApp }) => {
    const dealBook = loggedInApp.dealBook;
    await expect(dealBook.sectorFilter).toBeVisible();
    await expect(dealBook.selectedTab).toHaveText('Deals');

    const firstDeal = dealBook.dealLinks.first();
    await expect(firstDeal).toBeVisible();
    const href = await firstDeal.getAttribute('href');
    expect(href).toMatch(/^\/deals\/[^/]+$/);

    await dealBook.search('zzzzqqxx');
    await expect(dealBook.noMatchesMessage).toBeVisible();
    await expect(dealBook.dealLinks).toHaveCount(0);

    await dealBook.search('');
    await expect(firstDeal).toBeVisible();
    await dealBook.dealLink(href!).click();
    await expect(loggedInApp.page).toHaveURL(new RegExp(`${href}$`));
    await expect(dealBook.briefingHeading).toBeVisible();
  });
});
