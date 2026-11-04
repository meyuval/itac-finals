import type { Locator, Page } from '@playwright/test';

export type RiskBand = 'High risk' | 'Elevated' | 'Moderate' | 'Unscored';

/**
 * API `component` id -> label printed on the country page's breakdown rows.
 * Verified live on /countries/DEU (4 Nov 2026); it equals the API row's `label`.
 */
export const BREAKDOWN_LABELS: Readonly<Record<string, string>> = {
  cpi: 'Corruption Perceptions Index',
  wgi: 'Governance indicators (WGI)',
  ratings: 'OECD country risk category',
  news_signal: 'Verified adverse news',
  fatf: 'FATF lists',
  eu_aml: 'EU high risk list',
  sanctions: 'Country sanctions programs (OFAC/EU/UN)',
};

/** Countries list (`/countries`) and country detail (`/countries/<ISO3>`). */
export class CountriesPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly countryLinks: Locator;
  readonly noMatchesMessage: Locator;
  readonly countryRiskHeading: Locator;
  readonly dataSourcesHeading: Locator;
  /** Composite score paragraph on a country page, e.g. "15/ 100". */
  readonly compositeScore: Locator;
  /** One list item per scored component under "Country risk" (components without data are not printed). */
  readonly breakdownRows: Locator;
  /** "How the points are counted" disclosure under the breakdown. */
  readonly pointsDisclosure: Locator;
  /** One arithmetic line per scored component inside the disclosure, e.g. "risk 23 × 25 / 45 × 70 / 100 = 8.9". */
  readonly pointsRows: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.searchBox = page.getByLabel('Search countries');
    this.countryLinks = this.main.locator('table a[href^="/countries/"]');
    this.noMatchesMessage = this.main.getByText('No matching countries');
    this.countryRiskHeading = this.main.getByRole('heading', { level: 2, name: 'Country risk' });
    this.dataSourcesHeading = this.main.getByRole('heading', { level: 2, name: 'Data sources' });
    this.compositeScore = this.main.getByRole('paragraph').filter({ hasText: /^\s*\d+(\.\d+)?\s*\/\s*100\s*$/ });
    // The breakdown is the first list in main (the "Data sources" list comes later); it has no name of its own.
    this.breakdownRows = this.main.getByRole('list').first().getByRole('listitem');
    this.pointsDisclosure = this.main.getByRole('group').filter({ hasText: 'How the points are counted' });
    this.pointsRows = this.pointsDisclosure.getByRole('listitem');
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

  /** ISO3 codes of every country link currently in the list table. */
  async countryCodes(): Promise<string[]> {
    const hrefs = await this.countryLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    return hrefs.map((href) => href.replace('/countries/', ''));
  }

  /** Risk-band button in the strip above the list; its name starts with the band and embeds "n countries". */
  band(name: RiskBand): Locator {
    return this.main.getByRole('button', { name: new RegExp('^' + name) });
  }

  /** Number of countries the band button reports ("… 13 countries"). */
  async bandCount(name: RiskBand): Promise<number> {
    const text = (await this.band(name).textContent()) ?? '';
    const match = /(\d+)\s+countries/.exec(text);
    if (!match) throw new Error(`Band "${name}" shows no country count: "${text}"`);
    return Number(match[1]);
  }

  /** Label printed for an API breakdown component; throws on a component the page object does not know. */
  breakdownLabel(component: string): string {
    const label = BREAKDOWN_LABELS[component];
    if (label === undefined) throw new Error(`No dashboard label known for breakdown component "${component}"`);
    return label;
  }

  breakdownRow(component: string): Locator {
    return this.breakdownRows.filter({ has: this.page.getByText(this.breakdownLabel(component), { exact: true }) });
  }

  pointsRow(component: string): Locator {
    return this.pointsRows.filter({ has: this.page.getByText(this.breakdownLabel(component), { exact: true }) });
  }

  async openPointsDisclosure(): Promise<void> {
    await this.pointsDisclosure.getByText('How the points are counted', { exact: true }).click();
  }

  /** Composite score printed on the country page. */
  async readCompositeScore(): Promise<number> {
    const text = (await this.compositeScore.textContent()) ?? '';
    const match = /^\s*(\d+(?:\.\d+)?)/.exec(text);
    if (!match) throw new Error(`Composite score not readable: "${text}"`);
    return Number(match[1]);
  }
}
