import type { Locator, Page } from '@playwright/test';

export type DealSection = 'Briefing' | 'Updates' | 'Parties' | 'Score' | 'Key facts';

/** Deal page at `/deals/<id>`: heading, sections and document downloads. */
export class DealPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly downloadReport: Locator;
  readonly downloadDeck: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.downloadReport = this.main.getByRole('button', { name: 'Download report' });
    this.downloadDeck = this.main.getByRole('button', { name: 'Download deck' });
  }

  /** The heading of a section. */
  sectionHeading(name: DealSection): Locator {
    return this.main.getByRole('heading', { level: 2, name, exact: true });
  }

  /**
   * The card that holds a section. XPath: the cards are plain divs with no region role or label,
   * and each h2 sits in the card's header bar, so the card is the heading's grandparent.
   */
  section(name: DealSection): Locator {
    return this.sectionHeading(name).locator('xpath=../..');
  }
}
