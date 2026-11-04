import { test, expect } from '../../src/business/fixtures';
import type { RiskBreakdownRow } from '../../src/business/models/api';

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

  test('UI-CTY-02 band counts add up to the country list and the High risk band filters it', async ({ loggedInApp, api }) => {
    const index = await api.countries();
    expect(index.status).toBe(200);
    const apiCodes = index.body.countries.map((c) => c.iso3).sort();

    const countries = loggedInApp.countries;
    await countries.goto();
    // Every region group renders expanded by default, so all country links are in the table.
    await expect(countries.countryLinks).toHaveCount(apiCodes.length);
    expect((await countries.countryCodes()).sort()).toEqual(apiCodes);

    const bands = ['High risk', 'Elevated', 'Moderate', 'Unscored'] as const;
    for (const band of bands) await expect(countries.band(band)).toHaveText(/\d+\s+countries/);
    const counts = await Promise.all(bands.map((band) => countries.bandCount(band)));
    expect(counts.reduce((sum, n) => sum + n, 0)).toBe(apiCodes.length);

    const highRisk = counts[0];
    await countries.band('High risk').click();
    await expect(loggedInApp.page).toHaveURL(/[?&]band=high\b/);
    await expect(countries.countryLinks).toHaveCount(highRisk);

    await countries.band('High risk').click();
    await expect(loggedInApp.page).not.toHaveURL(/[?&]band=/);
    await expect(countries.countryLinks).toHaveCount(apiCodes.length);
  });

  test('UI-CTY-04 Germany score and breakdown match the API', async ({ loggedInApp, api }) => {
    const record = await api.country('DEU');
    expect(record.status).toBe(200);
    const { risk } = record.body;
    // Documented rule (sut-docs/countries.md): the page lists only components with data and prints nothing
    // about the others; the API marks those `missing` with a null contribution and lists them in `gaps`.
    const scored = risk.breakdown.filter(
      (row): row is RiskBreakdownRow & { contribution: number } => !row.missing && row.contribution !== null,
    );
    const unscored = risk.breakdown.filter((row) => row.missing);
    expect(unscored.map((row) => row.component).sort()).toEqual(risk.gaps.map((gap) => gap.component).sort());
    expect(scored).toHaveLength(risk.breakdown.length - risk.gaps.length);

    const countries = loggedInApp.countries;
    await countries.gotoCountry('DEU');
    await expect(countries.countryRiskHeading).toBeVisible();
    await expect(countries.compositeScore).toHaveText(new RegExp(`^\\s*${risk.score}\\s*/\\s*100\\s*$`));
    expect(await countries.readCompositeScore()).toBe(risk.score);

    await expect(countries.breakdownRows).toHaveCount(scored.length);
    for (const row of unscored) await expect(countries.breakdownRow(row.component)).toHaveCount(0);

    await countries.openPointsDisclosure();
    await expect(countries.pointsRows).toHaveCount(scored.length);
    for (const row of scored) {
      const contribution = row.contribution.toFixed(1);
      await expect(countries.breakdownRow(row.component)).toContainText(`+${contribution}`);
      // Weights are printed in the "How the points are counted" arithmetic, not on the summary row.
      const pointsRow = countries.pointsRow(row.component);
      await expect(pointsRow).toContainText(`× ${row.weight} /`);
      await expect(pointsRow).toContainText(new RegExp(`= ${contribution.replace('.', '\\.')}$`));
    }
  });
});
