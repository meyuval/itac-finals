import { test, expect } from '../../src/business/fixtures';

test.describe('UI: Countries', () => {
  // inherited: ui 8 countries
  test('search finds Germany, the country page shows risk and sources, unknown codes 404', async ({ loggedInApp }) => {
    const countries = loggedInApp.countries;
    await countries.goto();
    await expect(countries.heading).toHaveText('Countries');

    await countries.search('Germany');
    await countries.countryLink('DEU').click();
    await expect(loggedInApp.page).toHaveURL(/\/countries\/DEU$/);
    await expect(countries.heading).toHaveText('Germany');
    await expect(countries.countryRiskHeading).toBeVisible();
    await expect(countries.dataSourcesHeading).toBeVisible();

    await countries.goto();
    await countries.search('Zzzzqq');
    await expect(countries.noMatchesMessage).toBeVisible();
    await expect(countries.countryLinks).toHaveCount(0);

    await countries.gotoCountry('ZZZ');
    await expect(loggedInApp.page).toHaveTitle('Page not found · Stonewake');
  });

  // new: the dashboard and the API describe the same country
  test('country name shown in the dashboard matches the API record', async ({ loggedInApp, api }) => {
    const record = await api.country('DEU');
    expect(record.status).toBe(200);

    await loggedInApp.countries.gotoCountry('DEU');
    await expect(loggedInApp.countries.heading).toHaveText(record.body.name);
    await expect(loggedInApp.countries.countryRiskHeading).toBeVisible();
    await expect(loggedInApp.countries.main).toContainText(String(record.body.risk.score));
  });
});
