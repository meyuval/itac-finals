import { test, expect } from '../../src/business/fixtures';

test.describe('API: countries', () => {
  // inherited: api 9 countries
  test('list covers the world, Germany resolves with its codes, region and risk score', async ({ api }) => {
    const list = await api.countries();
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.regions)).toBe(true);
    expect(list.body.countries.length).toBeGreaterThanOrEqual(100);
    for (const country of list.body.countries) {
      expect(country.iso3).toMatch(/^[A-Z]{3}$/);
      expect(typeof country.name).toBe('string');
    }
    const germany = list.body.countries.find((country) => country.iso3 === 'DEU');
    expect(germany).toBeDefined();
    expect(germany?.name).toBe('Germany');

    const detail = await api.country('DEU');
    expect(detail.status).toBe(200);
    expect(detail.body.iso3).toBe('DEU');
    expect(detail.body.iso2).toBe('DE');
    expect(detail.body.name).toBe('Germany');
    expect(detail.body.region).toBe('europe');
    expect(detail.body.risk.score).toBeGreaterThanOrEqual(0);
    expect(detail.body.risk.score).toBeLessThanOrEqual(100);

    const unknown = await api.country('ZZZ');
    expect(unknown.status).toBe(404);
  });

  // new: unscored countries are explained rather than silently zeroed
  test('API-CT-01 every country has an ISO3 code and unscored countries carry a reason', async ({ api }) => {
    const list = await api.countries();
    expect(list.status).toBe(200);
    expect(list.body.countries.length).toBeGreaterThanOrEqual(100);
    for (const country of list.body.countries) {
      expect(country.iso3).toMatch(/^[A-Z]{3}$/);
    }
    const unscored = list.body.countries.filter((country) => country.risk_score === null);
    expect(unscored.length).toBeGreaterThan(0);
    for (const country of unscored) {
      expect(country.risk_reason, country.iso3).toBe('below_coverage_floor');
    }
  });

  // new: the published breakdown is the arithmetic behind the score
  test('API-CT-02 the Germany risk breakdown adds up to its score', async ({ api }) => {
    const germany = await api.country('DEU');
    expect(germany.status).toBe(200);
    const { score, breakdown, gaps } = germany.body.risk;
    expect(breakdown.length).toBeGreaterThan(0);
    let total = 0;
    for (const row of breakdown) {
      expect(typeof row.component).toBe('string');
      expect(typeof row.weight, row.component).toBe('number');
      expect(['assessment', 'lists'], row.component).toContain(row.part);
      expect(typeof row.missing, row.component).toBe('boolean');
      if (row.missing) {
        // a component without data contributes nothing and is listed in the gaps
        expect(row.contribution, row.component).toBeNull();
        expect(gaps.map((gap) => gap.component), row.component).toContain(row.component);
      } else {
        expect(typeof row.contribution, row.component).toBe('number');
        total += row.contribution ?? 0;
      }
      if (row.citation !== null) {
        expect(typeof row.citation.dataset_id, row.component).toBe('string');
      }
    }
    expect(breakdown.some((row) => !row.missing)).toBe(true);
    expect(Math.abs(total - score)).toBeLessThanOrEqual(1);
  });
});
