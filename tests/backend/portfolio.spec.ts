import { test, expect } from '../../src/business/fixtures';
import { API_LIMITS } from '../../src/business/api/stonewake-api';
import { PORTFOLIO_STATUSES, type ErrorEnvelope } from '../../src/business/models/api';

test.describe('API: portfolio (monitored book)', () => {
  // inherited: api 5 portfolio list
  test('list is paginated, typed and validates the limit bound', async ({ api }) => {
    const page = await api.portfolio({ limit: 2 });
    expect(page.status).toBe(200);
    expect(Array.isArray(page.body.items)).toBe(true);
    expect(page.body.items.length).toBeLessThanOrEqual(2);
    expect(page.body.limit).toBe(2);
    expect(page.body.offset).toBe(0);
    expect(Number.isInteger(page.body.total)).toBe(true);
    for (const item of page.body.items) {
      expect(typeof item.id).toBe('number');
      expect(typeof item.label).toBe('string');
      expect(typeof item.active).toBe('boolean');
      expect(PORTFOLIO_STATUSES).toContain(item.status);
      expect(item.completeness).toBeGreaterThanOrEqual(0);
      expect(item.completeness).toBeLessThanOrEqual(1);
    }

    const maxPage = await api.portfolio({ limit: API_LIMITS.portfolioMax });
    expect(maxPage.status).toBe(200);
    expect(maxPage.body.limit).toBe(API_LIMITS.portfolioMax);

    for (const limit of [-1, 'abc']) {
      const invalid = await api.portfolio({ limit });
      expect(invalid.status, `limit=${limit}`).toBe(422);
    }
    const tooLarge = await api.portfolio({ limit: 100_000 });
    expect(tooLarge.status).toBe(422);
    const detail = (tooLarge.body as unknown as ErrorEnvelope).detail;
    expect(detail?.[0]?.msg).toBe(`Input should be less than or equal to ${API_LIMITS.portfolioMax}`);
  });

  // new: offset pagination walks the book without overlap or gaps
  test('offset pagination returns disjoint consecutive pages that agree with the total', async ({ api }) => {
    const first = await api.portfolio({ limit: 1, offset: 0 });
    const second = await api.portfolio({ limit: 1, offset: 1 });
    const both = await api.portfolio({ limit: 2, offset: 0 });
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(both.status).toBe(200);
    expect(both.body.total).toBe(first.body.total);
    expect(second.body.offset).toBe(1);
    if (first.body.total >= 2) {
      expect(first.body.items).toHaveLength(1);
      expect(second.body.items).toHaveLength(1);
      expect(first.body.items[0].id).not.toBe(second.body.items[0].id);
      expect(both.body.items.map((item) => item.id)).toEqual([first.body.items[0].id, second.body.items[0].id]);
    } else {
      expect(both.body.items.length).toBe(first.body.total);
    }
  });

  // inherited: api 6 portfolio summary
  test('summary status buckets add up to the active exposures reported by the list', async ({ api }) => {
    const summary = await api.portfolioSummary();
    expect(summary.status).toBe(200);
    expect(Object.keys(summary.body.statuses).sort()).toEqual([...PORTFOLIO_STATUSES].sort());
    let sum = 0;
    for (const count of Object.values(summary.body.statuses)) {
      expect(Number.isInteger(count)).toBe(true);
      sum += count;
    }
    expect(Number.isInteger(summary.body.active_exposures)).toBe(true);
    expect(Number.isInteger(summary.body.reviews_overdue)).toBe(true);
    expect(sum).toBe(summary.body.active_exposures);

    const list = await api.portfolio({ limit: 1 });
    expect(list.status).toBe(200);
    expect(list.body.total).toBe(summary.body.active_exposures);
  });
});
