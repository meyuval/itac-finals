import { test, expect } from '../../src/business/fixtures';
import type { ErrorEnvelope } from '../../src/business/models/api';

test.describe('API: institutions (entities)', () => {
  // inherited: api 7 entities
  test('list items are typed and the detail route returns the same institution', async ({ api }) => {
    const list = await api.entities({ limit: 2 });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.items)).toBe(true);
    expect(list.body.items.length).toBeGreaterThanOrEqual(1);
    expect(list.body.limit).toBe(2);
    expect(list.body.total).toBeGreaterThan(0);
    for (const item of list.body.items) {
      expect(typeof item.id).toBe('number');
      expect(typeof item.slug).toBe('string');
      expect(typeof item.display_name).toBe('string');
      expect(typeof item.kind).toBe('string');
    }
    const first = list.body.items[0];
    const detail = await api.entity(first.id);
    expect(detail.status).toBe(200);
    expect(detail.body).toEqual(first);
  });

  // inherited: api 8 entity not found
  test('unknown, malformed and unauthenticated lookups fail with the documented codes', async ({ api, anonApi }) => {
    const missing = await api.entity(999_999);
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'not_found', message: 'Resource not found.' } });

    const malformed = await api.entity('abc');
    expect(malformed.status).toBe(422);
    const envelope = malformed.body as unknown as ErrorEnvelope;
    expect(envelope.error.code).toBe('validation_failed');
    expect(envelope.detail?.[0]?.type).toBe('int_parsing');
    expect(envelope.detail?.[0]?.loc).toEqual(['path', 'entity_id']);

    const missingNode = await api.node(999_999_999);
    expect(missingNode.status).toBe(404);

    const anonymous = await anonApi.entity(999_999);
    expect(anonymous.status).toBe(401);
  });

  test('API-EN-04 node routes of a book company agree with the book', async ({ api }) => {
    const book = await api.portfolio({ limit: 1 });
    expect(book.status).toBe(200);
    expect(book.body.items.length).toBe(1);
    const { node_id: nodeId, label } = book.body.items[0];

    const node = await api.node(nodeId);
    expect(node.status).toBe(200);
    expect(node.body.node_id).toBe(nodeId);
    expect(node.body.label).toBe(label);

    const chain = await api.nodeOwnershipChain(nodeId);
    expect(chain.status).toBe(200);
    expect(chain.body.root_id).toBe(nodeId);
    expect(Array.isArray(chain.body.paths)).toBe(true);
    expect(chain.body.paths.length).toBeGreaterThanOrEqual(1);
    for (const path of chain.body.paths) {
      // network.md: "hop by hop with each hop cited"; every path also states why the walk stopped.
      expect(typeof path.terminal.reason).toBe('string');
      expect(path.terminal.reason.length).toBeGreaterThan(0);
      expect(path.terminal.wording.length).toBeGreaterThan(0);
      for (const hop of path.hops) {
        expect(Array.isArray(hop.witnesses)).toBe(true);
        expect(hop.witnesses.length).toBeGreaterThan(0);
        for (const witness of hop.witnesses) {
          expect(typeof witness.record_id).toBe('number');
        }
      }
    }

    const missing = await api.node(999_999_999);
    expect(missing.status).toBe(404);
  });
});
