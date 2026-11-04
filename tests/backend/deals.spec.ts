import { test, expect } from '../../src/business/fixtures';
import type { Deal, ErrorEnvelope } from '../../src/business/models/api';
import type { StonewakeApi } from '../../src/business/api/stonewake-api';
import { isPdf, isZip } from '../../src/infrastructure/files/magic-bytes';

/** A well-formed deal id (12 lowercase hex characters) that names no deal. */
const UNKNOWN_DEAL_ID = '000000000000';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Reads the first deal of the default book; every test here builds on a live row, never a fixed id. */
async function firstDeal(api: StonewakeApi): Promise<Deal> {
  const page = await api.deals({ limit: 5 });
  expect(page.status).toBe(200);
  expect(page.body.items.length, 'the deal book must hold at least one deal').toBeGreaterThan(0);
  return page.body.items[0];
}

test.describe('API: deals (Deal Book)', () => {
  test('API-DL-01 default list is a typed envelope scoped to our team', async ({ api }) => {
    const me = await api.me();
    expect(me.status).toBe(200);
    const ourTeam = me.body.team_scope.teams[0]?.id;
    expect(ourTeam, 'GET /v1/me names the team the key reads').toBeTruthy();

    const page = await api.deals();
    expect(page.status).toBe(200);
    expect(Array.isArray(page.body.items)).toBe(true);
    expect(page.body.items.length).toBeGreaterThan(0);
    expect(page.body.limit).toBe(50);
    expect(page.body.offset).toBe(0);
    expect(Number.isInteger(page.body.total)).toBe(true);
    expect(page.body.total).toBeGreaterThanOrEqual(page.body.items.length);
    expect(page.body.items.length).toBeLessThanOrEqual(page.body.limit);

    for (const deal of page.body.items) {
      expect(deal.deal_id).toMatch(/^[0-9a-f]{12}$/);
      expect(typeof deal.name).toBe('string');
      if (deal.relevance_score !== null) {
        expect(deal.relevance_score, deal.deal_id).toBeGreaterThanOrEqual(0);
        expect(deal.relevance_score, deal.deal_id).toBeLessThanOrEqual(100);
      }
      expect(deal.countries.length, `${deal.deal_id} countries vs countries_iso3`).toBe(deal.countries_iso3.length);
      expect(deal.team_id, deal.deal_id).toBe(ourTeam);
    }
  });

  test('API-DL-02 filters narrow the list and reject unknown values', async ({ api }) => {
    const unfiltered = await api.deals({ limit: 5 });
    expect(unfiltered.status).toBe(200);
    expect(unfiltered.body.items.length).toBeGreaterThan(0);
    const sample = unfiltered.body.items[0];

    const filters: Array<{ key: 'stage' | 'sector'; value: string | null }> = [
      { key: 'stage', value: sample.stage },
      { key: 'sector', value: sample.sector },
    ];
    for (const { key, value } of filters) {
      expect(value, `first deal carries a ${key}`).toBeTruthy();
      const filtered = await api.deals({ [key]: value as string, limit: 100 });
      expect(filtered.status, `${key}=${value}`).toBe(200);
      expect(filtered.body.items.length, `${key}=${value} keeps the sampled deal's group`).toBeGreaterThan(0);
      for (const deal of filtered.body.items) {
        expect(deal[key], `${deal.deal_id} under ${key}=${value}`).toBe(value);
      }
      expect(filtered.body.total).toBeLessThanOrEqual(unfiltered.body.total);
    }

    // Free-text search keeps rows showing the word as a whole word, and q_matched names where.
    const word = sample.name.split(/[^A-Za-z]+/).find((token) => token.length >= 3);
    expect(word, `a word of at least 3 letters in "${sample.name}"`).toBeTruthy();
    const term = word as string;
    const searched = await api.deals({ q: term, limit: 100 });
    expect(searched.status, `q=${term}`).toBe(200);
    expect(searched.body.items.length, `q=${term} finds at least the sampled deal`).toBeGreaterThan(0);
    expect(searched.body.total).toBeLessThanOrEqual(unfiltered.body.total);
    expect(searched.body.items.map((deal) => deal.deal_id), `q=${term} keeps the sampled deal`).toContain(sample.deal_id);
    const wholeWord = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(term)}($|[^\\p{L}\\p{N}])`, 'iu');
    for (const deal of searched.body.items) {
      const match = deal.q_matched?.find((entry) => entry.term.toLowerCase() === term.toLowerCase());
      expect(match, `${deal.deal_id} says why q=${term} kept it`).toBeDefined();
      const field = match?.field;
      if (field === 'name' || field === 'summary' || field === 'buyer') {
        expect(deal[field] ?? '', `${deal.deal_id} ${field} holds "${term}"`).toMatch(wholeWord);
      }
    }

    const bogus = await api.deals({ stage: 'bogus' });
    expect(bogus.status).toBe(422);
    const error = bogus.body as unknown as ErrorEnvelope;
    expect(error.error.code).toBe('validation_failed');
    expect(error.detail?.[0]?.loc).toContain('stage');
  });

  test('API-DL-05 detail agrees with the list item and errors are documented', async ({ api }) => {
    const listed = await firstDeal(api);

    const detail = await api.deal(listed.deal_id);
    expect(detail.status).toBe(200);
    expect(detail.body.deal_id).toBe(listed.deal_id);
    expect(detail.body.name).toBe(listed.name);
    expect(detail.body.stage).toBe(listed.stage);
    expect(detail.body.relevance_score).toBe(listed.relevance_score);
    expect(detail.body.contract_value_usd).toBe(listed.contract_value_usd);
    expect(Array.isArray(detail.body.timeline)).toBe(true);

    const trimmed = await api.deal(listed.deal_id, { timeline_limit: 1 });
    expect(trimmed.status).toBe(200);
    expect(trimmed.body.timeline.length).toBeLessThanOrEqual(1);

    const missing = await api.deal(UNKNOWN_DEAL_ID);
    expect(missing.status).toBe(404);
    expect((missing.body as unknown as ErrorEnvelope).error.code).toBe('not_found');
  });

  test('API-DL-06 deal documents download as real PDF and PPTX', async ({ api, anonApi }) => {
    test.setTimeout(90_000);
    const listed = await firstDeal(api);

    for (const doc of ['report.pdf', 'pack.pdf'] as const) {
      const pdf = await api.dealDocument(listed.deal_id, doc);
      expect(pdf.status, doc).toBe(200);
      expect(pdf.headers['content-type'], doc).toContain('application/pdf');
      expect(isPdf(pdf.body), `${doc} starts with %PDF`).toBe(true);
    }

    const deck = await api.dealDocument(listed.deal_id, 'deck.pptx');
    expect(deck.status).toBe(200);
    expect(isZip(deck.body), 'deck.pptx is a ZIP container').toBe(true);

    const missing = await api.dealDocument(UNKNOWN_DEAL_ID, 'report.pdf');
    expect(missing.status).toBe(404);

    const anonymous = await anonApi.dealDocument(listed.deal_id, 'report.pdf');
    expect(anonymous.status).toBe(401);
  });
});
