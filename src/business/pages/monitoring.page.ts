import type { Locator, Page } from '@playwright/test';

/**
 * Monitoring (`/monitoring`). Since the 4 Nov 2026 19:16 product update it has two views,
 * "Research" and "Sentiment" (`?view=sentiment`), and a "Monitor a name" action.
 */
export class MonitoringPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly views: Locator;
  readonly monitorNameButton: Locator;
  readonly namesYouMonitorHeading: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1 });
    this.views = this.main.getByRole('tablist', { name: 'Monitoring views' });
    this.monitorNameButton = this.main.getByRole('button', { name: 'Monitor a name' });
    this.namesYouMonitorHeading = this.main.getByRole('heading', { name: 'Names you monitor' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/monitoring');
  }

  view(name: 'Research' | 'Sentiment'): Locator {
    return this.views.getByRole('tab', { name, exact: true });
  }

  async openView(name: 'Research' | 'Sentiment'): Promise<void> {
    await this.view(name).click();
  }
}
