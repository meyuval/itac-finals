import type { Locator, Page } from '@playwright/test';

/** Company page at `/entities/n<node_id>`: heading, status badge and sections. */
export class CompanyPage {
  readonly main: Locator;
  readonly heading: Locator;
  /** Exposure status (Red/Amber/Green/...) in the Credit monitoring card. Plain text with no role, so a test id. */
  readonly statusBadge: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.statusBadge = this.main.getByTestId('risk-status');
  }

  /**
   * A headed card such as "Ownership chain", "Officers and ownership", "Financing" or "Registry records".
   * Cards are unlabelled <div>s (no region role), so CSS/XPath: the nearest `rounded-control` card around the h2.
   */
  section(name: string): Locator {
    return this.main
      .getByRole('heading', { level: 2, name, exact: true })
      .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " rounded-control ")][1]');
  }

  /** Node id from the current `/entities/n<id>` URL. */
  nodeId(): string {
    const match = /\/entities\/n(\d+)/.exec(this.page.url());
    if (!match?.[1]) throw new Error(`Not on a company page: ${this.page.url()}`);
    return match[1];
  }
}
