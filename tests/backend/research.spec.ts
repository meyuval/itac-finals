import { test, expect } from '../../src/business/fixtures';
import type { ErrorEnvelope, PageOf } from '../../src/business/models/api';

/** Envelope invariants that hold whether or not the workspace has rows. */
function expectValidEnvelope(page: PageOf<unknown>, limit: number): void {
  expect(Array.isArray(page.items)).toBe(true);
  expect(page.limit).toBe(limit);
  expect(page.offset).toBe(0);
  expect(Number.isInteger(page.total)).toBe(true);
  expect(page.total).toBeGreaterThanOrEqual(0);
  expect(page.items.length).toBeLessThanOrEqual(limit);
  expect(page.total).toBeGreaterThanOrEqual(page.items.length);
  // At offset 0 the page holds min(total, limit) rows: an empty page means total is 0 and vice versa.
  expect(page.items.length).toBe(Math.min(page.total, limit));
}

function expectValidationFailed(body: unknown, field: string): void {
  const envelope = body as ErrorEnvelope;
  expect(envelope.error.code).toBe('validation_failed');
  expect(envelope.detail?.[0]?.loc).toEqual(['query', field]);
}

test.describe('API: research (screenings and monitoring)', () => {
  test('API-SC-01 screenings list is a valid envelope with documented errors', async ({ api }) => {
    const limit = 5;
    const list = await api.screenings({ limit });
    expect(list.status).toBe(200);
    expectValidEnvelope(list.body, limit);
    for (const item of list.body.items) {
      expect(typeof item.id).toBe('number');
      expect(typeof item.subject_type).toBe('string');
      expect(['entity', 'country', 'person']).toContain(item.subject_type);
      expect(typeof item.subject_name).toBe('string');
      expect(typeof item.status).toBe('string');
    }

    // openapi.json: subject_type enum is entity | country | person.
    const bogus = await api.screenings({ subject_type: 'bogus' });
    expect(bogus.status).toBe(422);
    expectValidationFailed(bogus.body, 'subject_type');

    const missing = await api.raw('/v1/screenings/999999');
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'not_found', message: 'Resource not found.' } });
  });

  test('API-MON-01 monitoring targets is a valid envelope', async ({ api }) => {
    const limit = 10;
    const list = await api.monitoringTargets({ limit });
    expect(list.status).toBe(200);
    expectValidEnvelope(list.body, limit);

    // openapi.json: limit is an integer from 1 to 100.
    const tooSmall = await api.monitoringTargets({ limit: 0 });
    expect(tooSmall.status).toBe(422);
    expectValidationFailed(tooSmall.body, 'limit');

    const tooLarge = await api.monitoringTargets({ limit: 101 });
    expect(tooLarge.status).toBe(422);
    expectValidationFailed(tooLarge.body, 'limit');

    const atMax = await api.monitoringTargets({ limit: 100 });
    expect(atMax.status).toBe(200);
    expectValidEnvelope(atMax.body, 100);
    expect(atMax.body.total).toBe(list.body.total);
  });
});
