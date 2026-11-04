# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> ui 6 sidebar
- Location: tests/ui.spec.ts:83:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('//aside//a[normalize-space(.)="EDD Dossier"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]: Screenings · Stonewake
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - img "Stonewake" [ref=e6]:
        - generic [aria-hidden] [ref=e9]: Stonewake
      - generic "Showing itac-ja" [ref=e10]:
        - paragraph [ref=e11]: Team
        - paragraph [ref=e12]: itac-ja
      - navigation [ref=e13]:
        - generic [ref=e14]:
          - paragraph [ref=e15]: Pipeline
          - generic [ref=e16]:
            - link "Deal Book" [ref=e17] [cursor=pointer]:
              - /url: /
            - link "Tenders" [ref=e22] [cursor=pointer]:
              - /url: /tenders
            - link "Countries" [ref=e29] [cursor=pointer]:
              - /url: /countries
            - link "Institutions" [ref=e35] [cursor=pointer]:
              - /url: /entities
            - link "Network" [ref=e40] [cursor=pointer]:
              - /url: /network
        - generic [ref=e48]:
          - paragraph [ref=e49]: Coverage
          - generic [ref=e50]:
            - link "Monitoring" [ref=e51] [cursor=pointer]:
              - /url: /monitoring
            - link "Portfolio" [ref=e59] [cursor=pointer]:
              - /url: /portfolio
            - link "Screenings" [active] [ref=e63] [cursor=pointer]:
              - /url: /screenings
            - link "EDD Dossiers" [ref=e66] [cursor=pointer]:
              - /url: /dossiers
            - link "Scoring" [ref=e71] [cursor=pointer]:
              - /url: /scoring
      - generic [ref=e73]:
        - link "ITAC JA" [ref=e74] [cursor=pointer]:
          - /url: /settings
        - generic [ref=e75]: Akomanov88
        - group "Display language" [ref=e76]:
          - button "English" [pressed] [ref=e81]
          - button "Deutsch" [ref=e82]
        - button "Sign out" [ref=e83]
        - button "Change password" [ref=e88]
        - link "How it works" [ref=e93] [cursor=pointer]:
          - /url: /guide
        - button "Report an issue" [ref=e98]
        - paragraph [ref=e101]: Research content is AI assisted.
    - main [ref=e102]:
      - generic [ref=e104]:
        - heading "Screenings" [level=1] [ref=e106]
        - button "New screening" [ref=e108]
      - generic [ref=e110]:
        - paragraph [ref=e111]: Nothing screened yet
        - paragraph [ref=e112]: Start a screening to check the last five years of public coverage for an organization, a country, or a person.
```

# Test source

```ts
  5   | 
  6   | test('ui 1 login ok', async ({ page }) => {
  7   |   await page.goto('https://app.stonewake.ai/');
  8   |   await page.waitForTimeout(2000);
  9   |   expect(page.url()).toContain('/login');
  10  |   await expect(page).toHaveTitle('Sign in · Stonewake');
  11  |   await expect(page.locator('//h1[text()="Sign in"]')).toBeVisible();
  12  |   await page.fill('#email', EMAIL);
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
> 105 |   await page.click('//aside//a[normalize-space(.)="EDD Dossier"]');
      |              ^ Error: page.click: Test timeout of 30000ms exceeded.
  106 |   await page.waitForURL('**/dossiers');
  107 |   await expect(page.locator('h1')).toHaveText('EDD Dossiers');
  108 |   await page.click('//aside//a[normalize-space(.)="Scoring"]');
  109 |   await page.waitForURL('**/scoring');
  110 |   await expect(page.locator('h1')).toHaveText('Scoring');
  111 | });
  112 | 
  113 | test('ui 7 deal book search', async ({ page }) => {
  114 |   await page.goto('https://app.stonewake.ai/login');
  115 |   await page.fill('input[type="email"]', EMAIL);
  116 |   await page.fill('input[type="password"]', PASS);
  117 |   await page.click('button[role="checkbox"]');
  118 |   await page.click('button[type="submit"]');
  119 |   await page.waitForURL('https://app.stonewake.ai/');
  120 |   await page.waitForTimeout(3000);
  121 |   await expect(page.locator('select[aria-label="All sectors"]')).toBeVisible();
  122 |   await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText('Deals');
  123 |   var link = page.locator("main a[href^='/deal/']").first();
  124 |   await expect(link).toBeVisible();
  125 |   var href = await link.getAttribute('href');
  126 |   await page.fill('input[placeholder="Search deals…"]', 'zzzzqqxx');
  127 |   await expect(page.locator('text=No matching deals')).toBeVisible();
  128 |   await page.fill('input[placeholder="Search deals…"]', '');
  129 |   await page.click("main a[href='" + href + "']");
  130 |   await page.waitForURL('**' + href);
  131 |   await expect(page.locator('//h2[text()="Briefing"]')).toBeVisible();
  132 | });
  133 | 
  134 | test('ui 8 countries', async ({ page }) => {
  135 |   await page.goto('https://app.stonewake.ai/login');
  136 |   await page.fill('input[type="email"]', EMAIL);
  137 |   await page.fill('input[type="password"]', PASS);
  138 |   await page.click('button[role="checkbox"]');
  139 |   await page.click('button[type="submit"]');
  140 |   await page.waitForURL('https://app.stonewake.ai/');
  141 |   await page.goto('https://app.stonewake.ai/countries');
  142 |   await expect(page.locator('h1')).toHaveText('Countries');
  143 |   await page.fill('input[aria-label="Search countries"]', 'Germany');
  144 |   await page.waitForTimeout(1000);
  145 |   await page.click('main a[href="/countries/DEU"]');
  146 |   await page.waitForURL('https://app.stonewake.ai/countries/DEU');
  147 |   await expect(page.locator('h1')).toHaveText('Germany');
  148 |   await expect(page.locator('//h2[text()="Country risk"]')).toBeVisible();
  149 |   await expect(page.locator('//h2[text()="Data sources"]')).toBeVisible();
  150 |   await page.goto('https://app.stonewake.ai/countries');
  151 |   await page.fill('input[aria-label="Search countries"]', 'Zzzzqq');
  152 |   await expect(page.locator('text=No matching countries')).toBeVisible();
  153 |   await expect(page.locator("table a[href^='/countries/']")).toHaveCount(0);
  154 |   await page.goto('https://app.stonewake.ai/countries/ZZZ');
  155 |   await expect(page).toHaveTitle('Page not found · Stonewake');
  156 | });
  157 | 
  158 | test('ui 9 institutions', async ({ page }) => {
  159 |   await page.goto('https://app.stonewake.ai/login');
  160 |   await page.fill('input[type="email"]', EMAIL);
  161 |   await page.fill('input[type="password"]', PASS);
  162 |   await page.click('button[role="checkbox"]');
  163 |   await page.click('button[type="submit"]');
  164 |   await page.waitForURL('https://app.stonewake.ai/');
  165 |   await page.goto('https://app.stonewake.ai/entities');
  166 |   await expect(page.locator('h1')).toHaveText('Institutions');
  167 |   await expect(page.locator('select[aria-label="Kind"]')).toBeVisible();
  168 |   await expect(page.locator('select[aria-label="Country"]')).toBeVisible();
  169 |   await page.fill('input[placeholder="Search institutions…"]', 'UKEF');
  170 |   await expect(page.locator('main a[href="/entities/4"]')).toContainText('UK Export Finance');
  171 |   await expect(page.locator("main a[href^='/entities/']")).toHaveCount(1);
  172 |   await page.click('main a[href="/entities/4"]');
  173 |   await page.waitForURL('https://app.stonewake.ai/entities/4');
  174 |   await expect(page).toHaveTitle('Institutions · Stonewake');
  175 |   await expect(page.locator('h1')).toBeVisible();
  176 | });
  177 | 
  178 | test('ui 10 portfolio', async ({ page }) => {
  179 |   await page.goto('https://app.stonewake.ai/login');
  180 |   await page.fill('input[type="email"]', EMAIL);
  181 |   await page.fill('input[type="password"]', PASS);
  182 |   await page.click('button[role="checkbox"]');
  183 |   await page.click('button[type="submit"]');
  184 |   await page.waitForURL('https://app.stonewake.ai/');
  185 |   await page.goto('https://app.stonewake.ai/portfolio');
  186 |   await expect(page.locator('h1')).toHaveText('Portfolio');
  187 |   await expect(page.locator('[data-testid="tile-red"]')).toBeVisible();
  188 |   await expect(page.locator('[data-testid="tile-amber"]')).toBeVisible();
  189 |   await expect(page.locator('[data-testid="tile-green"]')).toBeVisible();
  190 |   await expect(page.locator('[data-testid="tile-insufficient"]')).toBeVisible();
  191 |   await expect(page.locator('[data-testid="tile-not-assessed"]')).toBeVisible();
  192 |   var first = page.locator('tbody a[href^="/entities/n"]').first();
  193 |   await expect(first).toBeVisible();
  194 |   var name = (await first.innerText()).trim();
  195 |   await first.click();
  196 |   await page.waitForURL(/\/entities\/n\d+/);
  197 |   await expect(page.locator('h1')).toHaveText(name);
  198 | });
  199 | 
```