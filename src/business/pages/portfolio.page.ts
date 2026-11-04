import type { Locator, Page } from '@playwright/test';
import type { PortfolioStatus } from '../models/api';

/** Status tiles on the Portfolio page. Note the product uses `tile-not_assessed` (underscore). */
export const PORTFOLIO_TILES = ['red', 'amber', 'green', 'insufficient', 'not_assessed'] as const;
export type PortfolioTile = (typeof PORTFOLIO_TILES)[number];

/** Book table columns the tests read; the index is resolved from the header row at runtime. */
export type PortfolioColumn = 'Company' | 'Status' | 'Score' | 'Last change';

/** The six documented status names (`.itac/sut-docs/portfolio.md`) keyed by the API value. */
export const STATUS_LABELS: Record<PortfolioStatus, string> = {
  green: 'Green',
  amber: 'Amber',
  red: 'Red',
  insufficient: 'No score yet',
  not_assessed: 'Not yet assessed',
  sole_trader: 'Sole trader',
};

/** Portfolio (monitored book) at `/portfolio`. Rows link to `/entities/n<id>`. */
export class PortfolioPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly monitoredRowLinks: Locator;
  /** "N active exposures · M status changes in 30 days". */
  readonly summaryLine: Locator;
  readonly table: Locator;
  readonly columnHeaders: Locator;
  /** Body rows of the book table (one per exposure). */
  readonly rows: Locator;
  /** Entries of the "Status changes" list, newest first (changes and additions). */
  readonly statusChanges: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.monitoredRowLinks = this.main.locator('tbody a[href^="/entities/n"]');
    this.summaryLine = this.main.getByText(/^\d+ active exposures? · \d+ status changes? in 30 days$/);
    this.table = this.main.getByRole('table');
    this.columnHeaders = this.table.getByRole('columnheader');
    // The first rowgroup is the header; body rows are those holding cells.
    this.rows = this.table.getByRole('row').filter({ has: page.getByRole('cell') });
    // CSS/XPath: the list has no role or testid; its entries are the child divs of the
    // bordered box that follows the "Status changes" label row.
    this.statusChanges = this.main
      .getByText('Status changes', { exact: true })
      .locator('xpath=../following-sibling::div[1]/div');
  }

  async goto(): Promise<void> {
    await this.page.goto('/portfolio');
  }

  tile(status: PortfolioTile): Locator {
    return this.page.getByTestId(`tile-${status}`);
  }

  /** Integer shown in a status tile. */
  async tileCount(status: PortfolioTile): Promise<number> {
    const text = (await this.tile(status).getByRole('paragraph').innerText()).trim();
    return parseIntStrict(text, `tile-${status}`);
  }

  /** Parses the summary line into its two counts. */
  async summaryCounts(): Promise<{ activeExposures: number; statusChanges30d: number }> {
    const text = (await this.summaryLine.innerText()).trim();
    const match = /^(\d+) active exposures? · (\d+) status changes? in 30 days$/.exec(text);
    if (!match) throw new Error(`Unexpected summary line: "${text}"`);
    return { activeExposures: Number(match[1]), statusChanges30d: Number(match[2]) };
  }

  /** Cell of `row` under the header named `column`. */
  async cell(row: Locator, column: PortfolioColumn): Promise<Locator> {
    // allTextContents, not allInnerTexts: the headers are uppercased by CSS only.
    const headers = (await this.columnHeaders.allTextContents()).map((h) => h.trim());
    const index = headers.indexOf(column);
    if (index < 0) throw new Error(`Column "${column}" not found in [${headers.join(', ')}]`);
    return row.getByRole('cell').nth(index);
  }

  /** "Why the status changed" toggle of status-change entry `index` (0-based). */
  whyToggle(index: number): Locator {
    return this.statusChanges.nth(index).getByRole('button', { name: 'Why the status changed' });
  }

  /** Opens the cause of entry `index` and returns its panel (the element named by aria-controls). */
  async openWhy(index: number): Promise<Locator> {
    const toggle = this.whyToggle(index);
    await toggle.click();
    const panelId = await toggle.getAttribute('aria-controls');
    if (!panelId) throw new Error(`Entry ${index}: toggle has no aria-controls`);
    // CSS id selector: the panel is referenced only by the toggle's aria-controls.
    return this.page.locator(`[id="${panelId}"]`);
  }
}

function parseIntStrict(text: string, what: string): number {
  if (!/^\d+$/.test(text)) throw new Error(`${what}: expected an integer, got "${text}"`);
  return Number(text);
}
