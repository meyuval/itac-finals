import type { Page } from '@playwright/test';
import { AppShell } from '../pages/app-shell';
import { CompanyPage } from '../pages/company.page';
import { CountriesPage } from '../pages/countries.page';
import { DealBookPage } from '../pages/deal-book.page';
import { DealPage } from '../pages/deal.page';
import { InstitutionsPage } from '../pages/institutions.page';
import { LoginPage } from '../pages/login.page';
import { MonitoringPage } from '../pages/monitoring.page';
import { PortfolioPage } from '../pages/portfolio.page';

/**
 * Typed entry point to the Stonewake dashboard for one Playwright page.
 * Page objects are created once per WebApp and share the supplied page.
 */
export class WebApp {
  readonly login: LoginPage;
  readonly shell: AppShell;
  readonly dealBook: DealBookPage;
  readonly deal: DealPage;
  readonly company: CompanyPage;
  readonly countries: CountriesPage;
  readonly institutions: InstitutionsPage;
  readonly portfolio: PortfolioPage;
  readonly monitoring: MonitoringPage;

  constructor(readonly page: Page) {
    this.login = new LoginPage(page);
    this.shell = new AppShell(page);
    this.dealBook = new DealBookPage(page);
    this.deal = new DealPage(page);
    this.company = new CompanyPage(page);
    this.countries = new CountriesPage(page);
    this.institutions = new InstitutionsPage(page);
    this.portfolio = new PortfolioPage(page);
    this.monitoring = new MonitoringPage(page);
  }

  /** Navigates to an app route (relative to the configured baseURL). */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
