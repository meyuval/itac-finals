import { test, expect } from '../../src/business/fixtures';
import { SIDEBAR_MODULES, type SidebarModule } from '../../src/business/pages/app-shell';

/** Modules reachable from the sidebar in the competition workspace, with the heading each page shows. */
const MODULES: Array<{ module: SidebarModule; heading: string }> = [
  { module: 'Countries', heading: 'Countries' },
  { module: 'Institutions', heading: 'Institutions' },
  { module: 'Portfolio', heading: 'Portfolio' },
  { module: 'Monitoring', heading: 'Monitoring' },
  { module: 'Screenings', heading: 'Screenings' },
  { module: 'Tenders', heading: 'Tenders' },
  { module: 'Network', heading: 'Network' },
  { module: 'Scoring', heading: 'Scoring' },
];

/**
 * Modules that exist as pages but have no sidebar link in this workspace (audited live on 4 Nov 2026).
 * The inherited test clicked an "EDD Dossier" sidebar link that is not rendered; the page itself exists.
 */
const UNLINKED_MODULES: Array<{ route: string; heading: string }> = [
  { route: '/dossiers', heading: 'EDD Dossiers' },
  { route: '/signals', heading: 'Signals' },
];

test.describe('UI: sidebar navigation', () => {
  // inherited: ui 6 sidebar (sidebar part; EDD Dossier has no sidebar link here, see the test below)
  test('every sidebar module opens its route and shows its heading', async ({ loggedInApp }) => {
    for (const { module, heading } of MODULES) {
      await loggedInApp.shell.openModule(module);
      await expect(loggedInApp.page, module).toHaveURL(new RegExp(`${SIDEBAR_MODULES[module]}$`));
      await expect(loggedInApp.shell.pageHeading, module).toHaveText(heading);
    }
  });

  // inherited: ui 6 sidebar (EDD Dossiers destination); documents product observation P-2 in docs/DEFECTS_AND_CHANGES.md
  test('EDD Dossiers and Signals pages exist by URL but are not linked from the sidebar', async ({ loggedInApp }) => {
    for (const { route, heading } of UNLINKED_MODULES) {
      await loggedInApp.goto(route);
      await expect(loggedInApp.page, route).toHaveURL(new RegExp(`${route}$`));
      await expect(loggedInApp.shell.pageHeading, route).toHaveText(heading);
      await expect(loggedInApp.shell.navigation.getByRole('link', { name: heading }), route).toHaveCount(0);
    }
  });
});
