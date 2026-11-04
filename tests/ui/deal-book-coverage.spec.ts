import { readFile } from 'node:fs/promises';
import { test, expect } from '../../src/business/fixtures';
import { isPdf, isZip } from '../../src/infrastructure/files/magic-bytes';

/** Priority order of the default book (deal-book.md, "The order and the filters"). */
const WINDOW_RANK: Record<string, number> = { 'Financing open': 0, 'Early stage': 1, 'Not confirmed': 2 };

test.describe('UI: Deal Book coverage', () => {
  test.beforeEach(async ({ loggedInApp }) => {
    await expect(loggedInApp.dealBook.rows.first()).toBeVisible();
    await loggedInApp.dealBook.resolveColumns();
  });

  test('UI-DB-01 pager total equals the API deal total for our team', async ({ loggedInApp, api }) => {
    // Checked live: the UI default list and the API default list both leave out the held-back deals
    // (deal-book.md, "What is held back"; `include_hidden=true` brings them back), so the default
    // API query without include_hidden is the matching one.
    const res = await api.deals({ limit: 1 });
    expect(res.status).toBe(200);
    await expect.poll(() => loggedInApp.dealBook.pagerTotal()).toBe(res.body.total);
  });

  test('UI-DB-03 search keeps only rows containing every word', async ({ loggedInApp, api }) => {
    const dealBook = loggedInApp.dealBook;
    const firstRow = dealBook.rows.first();
    const name = (await dealBook.dealName(firstRow).innerText()).trim();
    const href = await dealBook.cell(firstRow, 'Deal').getByRole('link').getAttribute('href');
    const words = [...new Set(name.split(/[^\p{L}\p{N}]+/u).filter((w) => /^\p{L}{3,}$/u.test(w)))].slice(0, 2);
    expect(words, `two words of 3+ letters in "${name}"`).toHaveLength(2);
    const query = words.join(' ');

    await dealBook.search(query);
    // The search matches whole words in the deal name, the buyer, the summary, an exporter or an agency
    // (deal-book.md), so a matching row need not show both words in its Deal cell. We assert the
    // documented rule instead: the source deal stays, and the UI result is the API's `q` result.
    const expected = (await api.deals({ q: query, limit: 1 })).body.total;
    await expect.poll(() => dealBook.listedTotal()).toBe(expected);
    expect(await dealBook.rows.count()).toBeGreaterThan(0);
    await expect(dealBook.dealLink(href!)).toBeVisible();
  });

  test('UI-DB-04 financing window filter', async ({ loggedInApp, api }) => {
    const dealBook = loggedInApp.dealBook;
    await expect(dealBook.pager).toBeVisible();
    const unfiltered = await dealBook.pagerTotal();

    // The first page of the default book can be all Financing open rows, so the row check alone
    // could pass before the filter applies; the API count of that window pins the filtered total.
    const openTotal = (await api.deals({ window: 'financing_open', limit: 1 })).body.total;
    await dealBook.windowFilter.selectOption({ label: 'Financing open' });
    await expect.poll(() => dealBook.listedTotal()).toBe(openTotal);
    // Poll the whole page of rows so the assertion retries until the filtered list has rendered.
    await expect
      .poll(async () => {
        const n = await dealBook.rows.count();
        const texts: string[] = [];
        for (let i = 0; i < n; i++) texts.push((await dealBook.cell(dealBook.rows.nth(i), 'Financing window').innerText()).trim());
        return texts.length > 0 && texts.every((t) => t === 'Financing open');
      })
      .toBe(true);
    expect(await dealBook.listedTotal()).toBeLessThanOrEqual(unfiltered);

    await dealBook.windowFilter.selectOption({ label: 'All windows' });
    await expect.poll(() => dealBook.listedTotal()).toBe(unfiltered);
  });

  test('UI-DB-06 default order groups windows and sorts by score', async ({ loggedInApp }) => {
    const dealBook = loggedInApp.dealBook;
    const count = await dealBook.rows.count();
    const seen: { window: string; rank: number; score: number }[] = [];
    for (let i = 0; i < count; i++) {
      const row = dealBook.rows.nth(i);
      const window = (await dealBook.cell(row, 'Financing window').innerText()).trim();
      const rank = WINDOW_RANK[window];
      expect(rank, `row ${i + 1} window "${window}" is one of the default book's three groups`).toBeDefined();
      // The Score cell prints the 0-100 score as digits (deal-book.md, "Score ... from 0 to 100").
      const scoreText = (await dealBook.cell(row, 'Score').innerText()).trim();
      expect(scoreText, `row ${i + 1} score`).toMatch(/^\d{1,3}$/);
      seen.push({ window, rank: rank!, score: Number(scoreText) });
    }
    for (let i = 1; i < seen.length; i++) {
      const [prev, cur] = [seen[i - 1], seen[i]];
      expect(cur.rank, `row ${i + 1} (${cur.window}) after row ${i} (${prev.window})`).toBeGreaterThanOrEqual(prev.rank);
      if (cur.rank === prev.rank) {
        expect(cur.score, `row ${i + 1} score within ${cur.window}`).toBeLessThanOrEqual(prev.score);
      }
    }
  });

  test('UI-DB-09 deal page shows its cited briefing and the row value', async ({ loggedInApp }) => {
    const dealBook = loggedInApp.dealBook;
    const dealPage = loggedInApp.deal;
    // First row on the page whose Value cell prints a figure (an unread value leaves the cell empty).
    const row = dealBook.rows.filter({ has: loggedInApp.page.getByRole('cell', { name: /^\$|^(at least|up to) \$/ }) }).first();
    await expect(row).toBeVisible();
    const name = (await dealBook.dealName(row).innerText()).trim();
    const value = (await dealBook.cell(row, 'Value').innerText()).trim();
    expect(value).not.toBe('');

    await dealBook.cell(row, 'Deal').getByRole('link').click();
    await expect(loggedInApp.page).toHaveURL(/\/deals\/[^/]+$/);
    await expect(dealPage.heading).toHaveText(name);
    for (const section of ['Briefing', 'Updates', 'Parties', 'Score', 'Key facts'] as const) {
      await expect(dealPage.section(section), section).toBeVisible();
    }
    await expect(dealPage.section('Briefing').getByRole('link').first()).toBeVisible();
    await expect(dealPage.section('Key facts')).toContainText(value);
  });

  test('UI-DB-11 report and deck download as PDF and PPTX', async ({ loggedInApp }, testInfo) => {
    test.setTimeout(90_000);
    const dealPage = loggedInApp.deal;
    await loggedInApp.dealBook.dealLinks.first().click();
    await expect(dealPage.heading).toBeVisible();

    for (const [button, ext, check] of [
      [dealPage.downloadReport, '.pdf', isPdf],
      [dealPage.downloadDeck, '.pptx', isZip],
    ] as const) {
      const [download] = await Promise.all([loggedInApp.page.waitForEvent('download', { timeout: 60_000 }), button.click()]);
      const filename = download.suggestedFilename();
      expect(filename.toLowerCase().endsWith(ext), `${filename} ends with ${ext}`).toBe(true);
      const path = testInfo.outputPath(filename);
      await download.saveAs(path);
      const bytes = await readFile(path);
      expect(bytes.length, `${filename} size`).toBeGreaterThan(10_240);
      expect(check(bytes), `${filename} magic bytes`).toBe(true);
    }
  });
});
