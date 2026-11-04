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

test.describe('UI: sidebar navigation', () => {
  // inherited: ui 6 sidebar (EDD Dossier is not offered in this workspace; Tenders and Network are)
  test('every sidebar module opens its route and shows its heading', async ({ loggedInApp }) => {
    for (const { module, heading } of MODULES) {
      await loggedInApp.shell.openModule(module);
      await expect(loggedInApp.page, module).toHaveURL(new RegExp(`${SIDEBAR_MODULES[module]}$`));
      await expect(loggedInApp.shell.pageHeading, module).toHaveText(heading);
    }
  });
});
