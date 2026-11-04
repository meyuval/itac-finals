# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> ui 1 login ok
- Location: tests/ui.spec.ts:6:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#email')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: Sign in · Stonewake
  - generic [ref=e4]:
    - img "Stonewake" [ref=e5]:
      - generic [aria-hidden] [ref=e8]: Stonewake
    - heading "Sign in" [level=1] [ref=e9]
    - paragraph [ref=e10]: Agentic market intelligence for banks
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "Email" [ref=e14]:
          - /placeholder: you@bank.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - textbox "Password" [ref=e17]
      - generic [ref=e19]:
        - checkbox "I agree to the Evaluation Terms and the Terms of Service. The Privacy Policy explains how we process your data." [ref=e20]
        - checkbox [aria-hidden]
        - generic [ref=e21]:
          - text: I agree to the
          - link "Evaluation Terms" [ref=e22] [cursor=pointer]:
            - /url: https://stonewake.ai/evaluation-terms
          - text: and the
          - link "Terms of Service" [ref=e23] [cursor=pointer]:
            - /url: https://stonewake.ai/terms
          - text: . The
          - link "Privacy Policy" [ref=e24] [cursor=pointer]:
            - /url: https://stonewake.ai/privacy
          - text: explains how we process your data.
      - button "Sign in" [disabled]
      - paragraph [ref=e25]: Forgot your password? Ask your Stonewake contact for a new one.
    - paragraph [ref=e26]:
      - link "Imprint" [ref=e27] [cursor=pointer]:
        - /url: https://stonewake.ai/imprint
      - link "Privacy" [ref=e28] [cursor=pointer]:
        - /url: https://stonewake.ai/privacy
      - link "Public records notice" [ref=e29] [cursor=pointer]:
        - /url: https://stonewake.ai/public-records-notice
      - link "Terms" [ref=e30] [cursor=pointer]:
        - /url: https://stonewake.ai/terms
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | var EMAIL = 'akomanov88@gmail.com';
  4   | var PASS = 'cMV5GbHdJTgWfgab2sri';
  5   | 
  6   | test('ui 1 login ok', async ({ page }) => {
  7   |   await page.goto('https://app.stonewake.ai/');
  8   |   await page.waitForTimeout(2000);
  9   |   expect(page.url()).toContain('/login');
  10  |   await expect(page).toHaveTitle('Sign in · Stonewake');
  11  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
> 12  |   await page.fill('#email', EMAIL);
      |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  13  |   await page.fill('input[type="password"]', PASS);
  14  |   await page.click('button[role="checkbox"]');
  15  |   await page.click('button[type="submit"]');
  16  |   await page.waitForURL('https://app.stonewake.ai/');
  17  |   await expect(page).toHaveTitle('Deal Book · Stonewake');
  18  |   await expect(page.locator('h1')).toHaveText('Deal Book');
  19  |   await expect(page.locator('#app-sidebar')).toContainText('Team');
  20  |   await expect(page.locator('#app-sidebar a[data-tour="module-deals"]')).toBeVisible();
  21  |   await expect(page.locator('#app-sidebar a[data-tour="module-portfolio"]')).toBeVisible();
  22  |   await expect(page.locator('#app-sidebar a[data-tour="module-countries"]')).toBeVisible();
  23  |   await expect(page.locator('//aside//button[normalize-space(.)="Sign out"]')).toBeVisible();
  24  | });
  25  | 
  26  | test('ui 2 wrong password', async ({ page }) => {
  27  |   await page.goto('https://app.stonewake.ai/login');
  28  |   await page.fill('input[type="email"]', EMAIL);
  29  |   await page.fill('input[type="password"]', 'definitely-wrong-password-123');
  30  |   await page.click('button[role="checkbox"]');
  31  |   await page.click('button[type="submit"]');
  32  |   await expect(page.locator('text=That email and password do not match. Check both and try again.')).toBeVisible();
  33  |   expect(page.url()).toBe('https://app.stonewake.ai/login');
  34  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  35  |   await expect(page.locator('#app-sidebar')).toHaveCount(0);
  36  | });
  37  | 
  38  | test('ui 3 terms checkbox', async ({ page }) => {
  39  |   await page.goto('https://app.stonewake.ai/login');
  40  |   await expect(page.locator('button[type="submit"]')).toBeDisabled();
  41  |   await page.fill('input[type="email"]', EMAIL);
  42  |   await page.fill('input[type="password"]', PASS);
  43  |   await expect(page.locator('button[type="submit"]')).toBeDisabled();
  44  |   await page.check('input[type="checkbox"]');
  45  |   await expect(page.locator('button[type="submit"]')).toBeEnabled();
  46  |   await page.uncheck('input[type="checkbox"]');
  47  |   await expect(page.locator('button[type="submit"]')).toBeDisabled();
  48  |   await expect(page.locator('//a[text()="Terms of Service"]')).toHaveAttribute('href', 'https://stonewake.ai/terms');
  49  | });
  50  | 
  51  | test('ui 4 not logged in redirect', async ({ page }) => {
  52  |   await page.goto('https://app.stonewake.ai/');
  53  |   await page.waitForURL('https://app.stonewake.ai/login');
  54  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  55  |   await page.goto('https://app.stonewake.ai/portfolio');
  56  |   await page.waitForURL('https://app.stonewake.ai/login');
  57  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  58  |   await page.goto('https://app.stonewake.ai/countries/DEU');
  59  |   await page.waitForURL('https://app.stonewake.ai/login');
  60  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  61  |   await page.goto('https://app.stonewake.ai/entities');
  62  |   await page.waitForURL('https://app.stonewake.ai/login');
  63  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  64  |   await expect(page.locator('#app-sidebar')).toHaveCount(0);
  65  | });
  66  | 
  67  | test('ui 5 logout', async ({ page }) => {
  68  |   await page.goto('https://app.stonewake.ai/login');
  69  |   await page.fill('input[type="email"]', EMAIL);
  70  |   await page.fill('input[type="password"]', PASS);
  71  |   await page.click('button[role="checkbox"]');
  72  |   await page.click('button[type="submit"]');
  73  |   await page.waitForURL('https://app.stonewake.ai/');
  74  |   await expect(page.locator('h1')).toHaveText('Deal Book');
  75  |   await page.click('//aside//button[normalize-space(.)="Sign out"]');
  76  |   await page.waitForURL('https://app.stonewake.ai/login');
  77  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  78  |   await page.goto('https://app.stonewake.ai/portfolio');
  79  |   await page.waitForURL('https://app.stonewake.ai/login');
  80  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  81  | });
  82  | 
  83  | test('ui 6 sidebar', async ({ page }) => {
  84  |   await page.goto('https://app.stonewake.ai/login');
  85  |   await page.fill('input[type="email"]', EMAIL);
  86  |   await page.fill('input[type="password"]', PASS);
  87  |   await page.click('button[role="checkbox"]');
  88  |   await page.click('button[type="submit"]');
  89  |   await page.waitForURL('https://app.stonewake.ai/');
  90  |   await page.click('#app-sidebar a[data-tour="module-countries"]');
  91  |   await page.waitForURL('**/countries');
  92  |   await expect(page.locator('h1')).toHaveText('Countries');
  93  |   await page.click('#app-sidebar a[data-tour="module-entities"]');
  94  |   await page.waitForURL('**/entities');
  95  |   await expect(page.locator('h1')).toHaveText('Institutions');
  96  |   await page.click('#app-sidebar a[data-tour="module-portfolio"]');
  97  |   await page.waitForURL('**/portfolio');
  98  |   await expect(page.locator('h1')).toHaveText('Portfolio');
  99  |   await page.click('//aside//a[normalize-space(.)="Monitoring"]');
  100 |   await page.waitForURL('**/monitoring');
  101 |   await expect(page.locator('h1')).toHaveText('Monitoring');
  102 |   await page.click('//aside//a[normalize-space(.)="Screenings"]');
  103 |   await page.waitForURL('**/screenings');
  104 |   await expect(page.locator('h1')).toHaveText('Screenings');
  105 |   await page.click('//aside//a[normalize-space(.)="EDD Dossier"]');
  106 |   await page.waitForURL('**/dossiers');
  107 |   await expect(page.locator('h1')).toHaveText('EDD Dossiers');
  108 |   await page.click('//aside//a[normalize-space(.)="Scoring"]');
  109 |   await page.waitForURL('**/scoring');
  110 |   await expect(page.locator('h1')).toHaveText('Scoring');
  111 | });
  112 | 
```