import type { Locator, Page } from '@playwright/test';

/** Deal Book: the landing page after sign-in (`/`). Deal rows link to `/deals/<id>`. */
export class DealBookPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly selectedTab: Locator;
  readonly sectorFilter: Locator;
  readonly searchBox: Locator;
  readonly dealLinks: Locator;
  readonly noMatchesMessage: Locator;
  readonly briefingHeading: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.selectedTab = this.main.getByRole('tab', { selected: true });
    this.sectorFilter = this.main.getByRole('combobox', { name: 'All sectors' });
    this.searchBox = this.main.getByRole('textbox', { name: 'Search deals' });
    this.dealLinks = this.main.locator('a[href^="/deals/"]');
    this.noMatchesMessage = this.main.getByText('No matching deals');
    this.briefingHeading = this.main.getByRole('heading', { level: 2, name: 'Briefing' });
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
}
