import type { Locator, Page } from '@playwright/test';

/** Columns of the Deal Book table that tests read by header name. */
export type DealBookColumn = 'Deal' | 'Financing window' | 'Value' | 'Score';

/** N from pager text "a to b of N"; throws on anything else. */
export function parsePagerTotal(raw: string): number {
  const match = /^\s*\d+ to \d+ of ([\d,]+)\s*$/.exec(raw);
  if (!match) throw new Error(`Unrecognised pager text: "${raw}"`);
  return Number(match[1].replace(/,/g, ''));
}

/** Deal Book: the landing page after sign-in (`/`). Deal rows link to `/deals/<id>`. */
export class DealBookPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly selectedTab: Locator;
  readonly sectorFilter: Locator;
  readonly windowFilter: Locator;
  readonly searchBox: Locator;
  readonly dealLinks: Locator;
  readonly noMatchesMessage: Locator;
  readonly briefingHeading: Locator;
  readonly table: Locator;
  readonly headerCells: Locator;
  /** Body rows of the deal table (the header row has no data cells). */
  readonly rows: Locator;
  /** Pager text such as "1 to 50 of 146". */
  readonly pager: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.selectedTab = this.main.getByRole('tab', { selected: true });
    this.sectorFilter = this.main.getByRole('combobox', { name: 'All sectors' });
    this.windowFilter = this.main.getByRole('combobox', { name: 'All windows' });
    this.searchBox = this.main.getByRole('textbox', { name: 'Search deals' });
    this.dealLinks = this.main.locator('a[href^="/deals/"]');
    this.noMatchesMessage = this.main.getByText('No matching deals');
    this.briefingHeading = this.main.getByRole('heading', { level: 2, name: 'Briefing' });
    this.table = this.main.getByRole('table');
    this.headerCells = this.table.getByRole('columnheader');
    this.rows = this.table.getByRole('row').filter({ has: page.getByRole('cell') }).filter({ hasNot: page.getByRole('columnheader') });
    this.pager = this.main.getByText(/^\d+ to \d+ of \d+$/);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  dealLink(href: string): Locator {
    return this.main.locator(`a[href="${href}"]`);
  }

  /** N from the pager text "a to b of N". */
  async pagerTotal(): Promise<number> {
    return parsePagerTotal(await this.pager.innerText());
  }

  /**
   * Deals the current list holds, read without waiting for a pager. Checked live: the pager is only
   * rendered when the list spans more than one page, so a single-page result is counted by its rows.
   */
  async listedTotal(): Promise<number> {
    const pagerTexts = await this.pager.allInnerTexts();
    if (pagerTexts.length > 0) return parsePagerTotal(pagerTexts[0]);
    return this.rows.count();
  }

  /** The cell of `row` under the header named `column`; the index is read from the header row. */
  cell(row: Locator, column: DealBookColumn): Locator {
    return row.getByRole('cell').nth(this.columnIndexSync(column));
  }

  /** Resolves header indexes (textContent: the headers are uppercased by CSS); call before `cell()`. */
  async resolveColumns(): Promise<void> {
    const names = (await this.headerCells.allTextContents()).map((t) => t.trim());
    this.columnIndexes = new Map(names.map((n, i) => [n, i]));
  }

  /**
   * The deal name in a row's Deal cell, without the country and sector line under it.
   * CSS: the name is a span carrying its full text as `title`; it has no role or test id of its own.
   */
  dealName(row: Locator): Locator {
    return this.cell(row, 'Deal').locator('span[title]');
  }

  private columnIndexes: Map<string, number> | undefined;

  private columnIndexSync(column: DealBookColumn): number {
    if (!this.columnIndexes) throw new Error('Call resolveColumns() before cell()');
    const index = this.columnIndexes.get(column);
    if (index === undefined) throw new Error(`Column "${column}" not in header: ${[...this.columnIndexes.keys()].join(', ')}`);
    return index;
  }
}
