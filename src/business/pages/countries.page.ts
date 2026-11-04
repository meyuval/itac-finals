import type { Locator, Page } from '@playwright/test';

/** Countries list (`/countries`) and country detail (`/countries/<ISO3>`). */
export class CountriesPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly countryLinks: Locator;
  readonly noMatchesMessage: Locator;
  readonly countryRiskHeading: Locator;
  readonly dataSourcesHeading: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.searchBox = page.getByLabel('Search countries');
    this.countryLinks = this.main.locator('table a[href^="/countries/"]');
    this.noMatchesMessage = this.main.getByText('No matching countries');
    this.countryRiskHeading = this.main.getByRole('heading', { level: 2, name: 'Country risk' });
    this.dataSourcesHeading = this.main.getByRole('heading', { level: 2, name: 'Data sources' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/countries');
  }

  async gotoCountry(iso3: string): Promise<void> {
    await this.page.goto(`/countries/${iso3}`);
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  countryLink(iso3: string): Locator {
    return this.main.locator(`a[href="/countries/${iso3}"]`);
  }
}
