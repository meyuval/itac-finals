import type { Locator, Page } from '@playwright/test';

/** Sidebar modules visible in the competition workspace (nav link text → route). */
export const SIDEBAR_MODULES = {
  'Deal Book': '/',
  Tenders: '/tenders',
  Countries: '/countries',
  Institutions: '/entities',
  Network: '/network',
  Monitoring: '/monitoring',
  Portfolio: '/portfolio',
  Screenings: '/screenings',
  Scoring: '/scoring',
} as const;

export type SidebarModule = keyof typeof SIDEBAR_MODULES;

/** The signed-in application shell: sidebar navigation, sign-out and the page heading. */
export class AppShell {
  readonly sidebar: Locator;
  readonly navigation: Locator;
  readonly signOutButton: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.sidebar = page.locator('#app-sidebar');
    this.navigation = this.sidebar.getByRole('navigation');
    this.signOutButton = this.sidebar.getByRole('button', { name: 'Sign out' });
    this.pageHeading = page.getByRole('main').getByRole('heading', { level: 1 });
  }

  moduleLink(name: SidebarModule): Locator {
    return this.navigation.getByRole('link', { name, exact: true });
  }

  async openModule(name: SidebarModule): Promise<void> {
    await this.moduleLink(name).click();
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
  }
}
