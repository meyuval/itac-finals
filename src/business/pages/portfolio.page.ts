import type { Locator, Page } from '@playwright/test';

/** Status tiles on the Portfolio page. Note the product uses `tile-not_assessed` (underscore). */
export const PORTFOLIO_TILES = ['red', 'amber', 'green', 'insufficient', 'not_assessed'] as const;
export type PortfolioTile = (typeof PORTFOLIO_TILES)[number];

/** Portfolio (monitored book) at `/portfolio`. Rows link to `/entities/n<id>`. */
export class PortfolioPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly monitoredRowLinks: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.monitoredRowLinks = this.main.locator('tbody a[href^="/entities/n"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/portfolio');
  }

  tile(status: PortfolioTile): Locator {
    return this.page.getByTestId(`tile-${status}`);
  }
}
