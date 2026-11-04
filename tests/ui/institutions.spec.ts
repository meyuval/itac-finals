import { test, expect } from '../../src/business/fixtures';

test.describe('UI: Institutions', () => {
  // inherited: ui 9 institutions
  test('search isolates UK Export Finance and opens its institution page', async ({ loggedInApp }) => {
    const institutions = loggedInApp.institutions;
    await institutions.goto();
    await expect(institutions.heading).toHaveText('Institutions');
    await expect(institutions.kindFilter).toBeVisible();
    await expect(institutions.countryFilter).toBeVisible();

    await institutions.search('UKEF');
    await expect(institutions.institutionLink(4)).toContainText('UK Export Finance');
    await expect(institutions.institutionLinks).toHaveCount(1);

    await institutions.institutionLink(4).click();
    await expect(loggedInApp.page).toHaveURL(/\/entities\/4$/);
    await expect(loggedInApp.page).toHaveTitle('Institutions · Stonewake');
    await expect(institutions.heading).toBeVisible();
  });
});
