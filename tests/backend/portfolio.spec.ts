import { test, expect } from '../../src/business/fixtures';
import { API_LIMITS } from '../../src/business/api/stonewake-api';
import { PORTFOLIO_STATUSES, type ErrorEnvelope } from '../../src/business/models/api';

test.describe('API: portfolio (monitored book)', () => {
  // inherited: api 5 portfolio list
  test('list is paginated, typed and validates the limit bound', async ({ api }) => {
    const page = await api.portfolio({ limit: 2 });
    expect(page.status).toBe(200);
    expect(Array.isArray(page.body.items)).toBe(true);
    expect(page.body.total, 'the book must hold at least one exposure').toBeGreaterThan(0);
    expect(page.body.items).toHaveLength(Math.min(2, page.body.total));
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
    expect(first.body.total, 'the book needs at least two rows to test paging').toBeGreaterThanOrEqual(2);
    expect(first.body.items).toHaveLength(1);
    expect(second.body.items).toHaveLength(1);
    expect(first.body.items[0].id).not.toBe(second.body.items[0].id);
    expect(both.body.items.map((item) => item.id)).toEqual([first.body.items[0].id, second.body.items[0].id]);
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

  // new: transitions feed ordering, cause shape and the timezone-aware since filter
  test('API-PF-06 transitions are newest first and honour the since filter', async ({ api }) => {
    const feed = await api.portfolioTransitions({ limit: 50 });
    expect(feed.status).toBe(200);
    expect(feed.body.items.length).toBeGreaterThan(0);
    const times = feed.body.items.map((item) => Date.parse(item.occurred_at));
    for (let i = 0; i < times.length; i++) {
      expect(Number.isNaN(times[i]), feed.body.items[i].occurred_at).toBe(false);
      if (i > 0) {
        expect(times[i], `transition ${feed.body.items[i].id}`).toBeLessThanOrEqual(times[i - 1]);
      }
    }
    for (const item of feed.body.items) {
      expect(['added', 'change']).toContain(item.cause.kind);
      expect(typeof item.cause.available).toBe('boolean');
    }

    // The cutoff is taken from the feed itself, so the filter must drop the older rows: a server that
    // ignored `since` would return the whole feed and fail the exact total below.
    expect(feed.body.total, 'the whole feed fits in one page').toBeLessThanOrEqual(50);
    const sorted = [...times].sort((a, b) => a - b);
    const since = new Date(sorted[Math.floor(sorted.length / 2)]).toISOString();
    const expected = times.filter((t) => t >= Date.parse(since)).length;
    expect(expected).toBeGreaterThan(0);
    expect(expected, 'the cutoff must exclude some rows').toBeLessThan(feed.body.total);
    const filtered = await api.portfolioTransitions({ limit: 50, since });
    expect(filtered.status).toBe(200);
    expect(filtered.body.total, `transitions since ${since}`).toBe(expected);
    for (const item of filtered.body.items) {
      expect(Date.parse(item.occurred_at), `transition ${item.id}`).toBeGreaterThanOrEqual(Date.parse(since));
    }

    const naive = await api.portfolioTransitions({ since: '2026-10-01T00:00:00' });
    expect(naive.status).toBe(422);
    const detail = (naive.body as unknown as ErrorEnvelope).detail;
    expect(detail?.[0]?.type).toBe('timezone_aware');
    expect(detail?.[0]?.loc).toEqual(['query', 'since']);
  });
});
