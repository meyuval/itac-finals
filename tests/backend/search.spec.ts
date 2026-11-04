import { test, expect } from '../../src/business/fixtures';
import { API_LIMITS } from '../../src/business/api/stonewake-api';
import type { ErrorEnvelope } from '../../src/business/models/api';

test.describe('API: search', () => {
  // inherited: api 10 search
  test('search returns scored hits, an empty list for nonsense, and validates its inputs', async ({ api }) => {
    const hits = await api.search({ q: 'bank', limit: 3 });
    expect(hits.status).toBe(200);
    expect(hits.body.query).toBe('bank');
    expect(hits.body.hits.length).toBeGreaterThanOrEqual(1);
    expect(hits.body.hits.length).toBeLessThanOrEqual(3);
    for (const hit of hits.body.hits) {
      expect(typeof hit.node_id).toBe('number');
      expect(typeof hit.label).toBe('string');
      expect(hit.score).toBeGreaterThanOrEqual(0);
      expect(hit.score).toBeLessThanOrEqual(1);
    }

    const nonsense = await api.search({ q: 'zzzzqqqxxxyy' });
    expect(nonsense.status).toBe(200);
    expect(nonsense.body.hits).toEqual([]);

    const missingQuery = await api.search();
    expect(missingQuery.status).toBe(422);

    const tooShort = await api.search({ q: 'a' });
    expect(tooShort.status).toBe(422);
    expect((tooShort.body as unknown as ErrorEnvelope).detail?.[0]?.msg).toBe(
      `String should have at least ${API_LIMITS.searchMinQueryLength} characters`,
    );

    const tooMany = await api.search({ q: 'bank', limit: 99_999 });
    expect(tooMany.status).toBe(422);
    expect((tooMany.body as unknown as ErrorEnvelope).detail?.[0]?.msg).toBe(
      `Input should be less than or equal to ${API_LIMITS.searchMax}`,
    );
  });
});
