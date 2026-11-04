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
});
