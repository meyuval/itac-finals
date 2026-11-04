import { test, expect } from '../../src/business/fixtures';

test.describe('UI: Monitoring', () => {
  // new (product update announced 4 Nov 2026 19:16: Research and Sentiment views, "Monitor a name")
  test('Monitoring offers Research and Sentiment views and a Monitor-a-name action', async ({ loggedInApp }) => {
    const monitoring = loggedInApp.monitoring;
    await loggedInApp.shell.openModule('Monitoring');
    await expect(loggedInApp.page).toHaveURL(/\/monitoring$/);
    await expect(monitoring.heading).toHaveText('Monitoring');
    await expect(monitoring.view('Research')).toHaveAttribute('aria-selected', 'true');
    await expect(monitoring.view('Sentiment')).toHaveAttribute('aria-selected', 'false');
    await expect(monitoring.monitorNameButton).toBeVisible();

    await monitoring.openView('Sentiment');
    await expect(loggedInApp.page).toHaveURL(/\/monitoring\?view=sentiment$/);
    await expect(monitoring.view('Sentiment')).toHaveAttribute('aria-selected', 'true');
    await expect(monitoring.namesYouMonitorHeading).toBeVisible();
    await expect(monitoring.main).toContainText('What public posts said about the names you monitor');
    await expect(monitoring.monitorNameButton).toBeVisible();

    await monitoring.openView('Research');
    await expect(monitoring.view('Research')).toHaveAttribute('aria-selected', 'true');
    await expect(monitoring.namesYouMonitorHeading).toHaveCount(0);
  });
});
