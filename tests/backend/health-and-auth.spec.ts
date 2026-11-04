import { test, expect } from '../../src/business/fixtures';
import type { ErrorEnvelope } from '../../src/business/models/api';

const UNAUTHENTICATED: ErrorEnvelope = {
  error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' },
};

test.describe('API: health and authentication boundary', () => {
  // inherited: api 1 health
  test('public health endpoint reports the running app', async ({ anonApi }) => {
    const { status, body } = await anonApi.health();
    expect(status).toBe(200);
    expect(Object.keys(body).sort()).toEqual(['app', 'environment', 'status', 'version']);
    expect(body.status).toBe('ok');
    expect(body.app).toBe('stonewake');
    expect(typeof body.version).toBe('string');
    expect(typeof body.environment).toBe('string');
  });

  // inherited: api 2 me
  test('API key identity exposes credential, role, team scope and rate-limit headers', async ({ api }) => {
    const { status, body, headers } = await api.me();
    expect(status).toBe(200);
    expect(body.credential).toBe('api_key');
    expect(body.role).toMatch(/^[a-z_]+$/);
    expect(typeof body.team_scope.all_teams).toBe('boolean');
    expect(Array.isArray(body.team_scope.teams)).toBe(true);
    if (!body.team_scope.all_teams) {
      expect(body.team_scope.teams.length).toBeGreaterThan(0);
      for (const team of body.team_scope.teams) {
        expect(typeof team.id).toBe('string');
        expect(typeof team.name).toBe('string');
      }
    }
    expect(headers['x-ratelimit-limit']).toMatch(/^\d+$/);
    expect(headers['x-ratelimit-remaining']).toMatch(/^\d+$/);
  });

  // new: the documented per-key rate-limit contract is observable across calls
  test('rate-limit remaining decreases between two consecutive keyed calls', async ({ api }) => {
    const first = await api.me();
    const second = await api.me();
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const limit = Number(first.headers['x-ratelimit-limit']);
    const remainingFirst = Number(first.headers['x-ratelimit-remaining']);
    const remainingSecond = Number(second.headers['x-ratelimit-remaining']);
    expect(limit).toBeGreaterThan(0);
    expect(remainingFirst).toBeLessThanOrEqual(limit);
    expect(remainingSecond).toBeLessThan(remainingFirst);
  });

  // inherited: api 3 no token
  test('every protected route rejects a missing credential with a uniform 401', async ({ anonApi }) => {
    const responses = await Promise.all([
      anonApi.me(),
      anonApi.portfolio(),
      anonApi.countries(),
      anonApi.entities(),
      anonApi.resolveCitations(),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.body).toEqual(UNAUTHENTICATED);
    }
  });

  // inherited: api 4 bad keys
  test('malformed and unknown credentials are rejected with the same 401 body', async ({ anonApi, request, config }) => {
    const badHeaders = [
      'Bearer swk_live_invalid000000000000000000000000',
      'Bearer not-a-key',
      'Basic abc',
    ];
    for (const authorization of badHeaders) {
      const response = await request.get(`${config.apiUrl}/v1/me`, { headers: { Authorization: authorization } });
      expect(response.status(), authorization).toBe(401);
      expect(await response.json()).toEqual(UNAUTHENTICATED);
    }
    const portfolio = await request.get(`${config.apiUrl}/v1/portfolio`, {
      headers: { Authorization: badHeaders[0] },
    });
    expect(portfolio.status()).toBe(401);
    expect((await anonApi.me()).status).toBe(401);
  });
});
