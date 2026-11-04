import type { Locator, Page } from '@playwright/test';

/** Institutions list (`/entities`) and institution detail (`/entities/<id>`). */
export class InstitutionsPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly kindFilter: Locator;
  readonly countryFilter: Locator;
  readonly searchBox: Locator;
  readonly institutionLinks: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.kindFilter = this.main.getByLabel('Kind');
    this.countryFilter = this.main.getByLabel('Country');
    this.searchBox = this.main.getByPlaceholder('Search institutions…');
    this.institutionLinks = this.main.locator('a[href^="/entities/"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/entities');
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  institutionLink(id: number | string): Locator {
    return this.main.locator(`a[href="/entities/${id}"]`);
  }
}
