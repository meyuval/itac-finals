# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> ui 10 portfolio
- Location: tests/ui.spec.ts:178:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="tile-not-assessed"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-testid="tile-not-assessed"]') with timeout 5000ms
  - waiting for locator('[data-testid="tile-not-assessed"]')

```

```yaml
- complementary:
  - img "Stonewake"
  - paragraph: Team
  - paragraph: itac-ja
  - navigation:
    - paragraph: Pipeline
    - link "Deal Book":
      - /url: /
    - link "Tenders":
      - /url: /tenders
    - link "Countries":
      - /url: /countries
    - link "Institutions":
      - /url: /entities
    - link "Network":
      - /url: /network
    - paragraph: Coverage
    - link "Monitoring":
      - /url: /monitoring
    - link "Portfolio":
      - /url: /portfolio
    - link "Screenings":
      - /url: /screenings
    - link "EDD Dossiers":
      - /url: /dossiers
    - link "Scoring":
      - /url: /scoring
  - link "ITAC JA":
    - /url: /settings
  - text: Akomanov88
  - group "Display language":
    - button "English" [pressed]
    - button "Deutsch"
  - button "Sign out"
  - button "Change password"
  - link "How it works":
    - /url: /guide
  - button "Report an issue"
  - paragraph: Research content is AI assisted.
- main:
  - heading "Portfolio" [level=1]
  - paragraph: Deterministic credit monitoring over your monitored book. Every status is recomputed from cited register records, never estimated.
  - link "Sanctions person review":
    - /url: /portfolio/sanctions
  - link "Scoring profile":
    - /url: /portfolio/profile
  - text: Red
  - paragraph: "0"
  - text: Amber
  - paragraph: "1"
  - text: No score yet
  - paragraph: "11"
  - text: Not yet assessed
  - paragraph: "0"
  - text: Green
  - paragraph: "13"
  - paragraph: 25 active exposures · 8 status changes in 30 days
  - paragraph: No score yet means the registers hold too little evidence to score the company. Not yet assessed means its first assessment has not run.
  - paragraph: Reviews due
  - text: 25 exposures have no credit review on record A review is recorded on the company's page, at least once a year. Never reviewed
  - combobox "Add a company to the monitored book"
  - button "Add" [disabled]
  - button "Import book"
  - table:
    - rowgroup:
      - row "Company Status Score Attention Last change":
        - columnheader "Company"
        - columnheader "Status"
        - columnheader "Score"
        - columnheader "Attention"
        - columnheader "Last change"
    - rowgroup:
      - row "ROLLS-ROYCE HOLDINGS PLC Amber 30 Equity ratio (shareholders' equity / total assets), Altman Z score (1995) Added to the book as Amber, 26 Oct 2026":
        - cell "ROLLS-ROYCE HOLDINGS PLC":
          - link "ROLLS-ROYCE HOLDINGS PLC":
            - /url: /entities/n106084
        - cell "Amber"
        - cell "30"
        - cell "Equity ratio (shareholders' equity / total assets), Altman Z score (1995)": Equity ratio (shareholders' equity / total assets) +1
        - cell "Added to the book as Amber, 26 Oct 2026": 26 Oct 2026
      - row "VINCI No score yet Not scored Piotroski F score (2000) Green to No score yet, 29 Oct 2026":
        - cell "VINCI":
          - link "VINCI":
            - /url: /entities/n233995
        - cell "No score yet"
        - cell "Not scored"
        - cell "Piotroski F score (2000)"
        - cell "Green to No score yet, 29 Oct 2026": 29 Oct 2026
      - row "Siemens Aktiengesellschaft No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "Siemens Aktiengesellschaft":
          - link "Siemens Aktiengesellschaft":
            - /url: /entities/n3367646
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "SCHNEIDER ELECTRIC SE No score yet Not scored Piotroski F score (2000) Added to the book as No score yet, 26 Oct 2026":
        - cell "SCHNEIDER ELECTRIC SE":
          - link "SCHNEIDER ELECTRIC SE":
            - /url: /entities/n2828018
        - cell "No score yet"
        - cell "Not scored"
        - cell "Piotroski F score (2000)"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "thyssenkrupp AG No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "thyssenkrupp AG":
          - link "thyssenkrupp AG":
            - /url: /entities/n1622213
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "ABB Ltd No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "ABB Ltd":
          - link "ABB Ltd":
            - /url: /entities/n1176711
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "BASF SE No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "BASF SE":
          - link "BASF SE":
            - /url: /entities/n1100661
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "Sulzer AG No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "Sulzer AG":
          - link "Sulzer AG":
            - /url: /entities/n1090934
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "Holcim AG No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "Holcim AG":
          - link "Holcim AG":
            - /url: /entities/n1034689
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "MTU Aero Engines AG No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "MTU Aero Engines AG":
          - link "MTU Aero Engines AG":
            - /url: /entities/n996022
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "Schindler Holding AG No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "Schindler Holding AG":
          - link "Schindler Holding AG":
            - /url: /entities/n992421
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "Knorr-Bremse Aktiengesellschaft No score yet Not scored None yet Added to the book as No score yet, 26 Oct 2026":
        - cell "Knorr-Bremse Aktiengesellschaft":
          - link "Knorr-Bremse Aktiengesellschaft":
            - /url: /entities/n957170
        - cell "No score yet"
        - cell "Not scored"
        - cell "None yet"
        - cell "Added to the book as No score yet, 26 Oct 2026": 26 Oct 2026
      - row "Heidelberg Materials AG Green 0 None yet No score yet to Green, 31 Oct 2026":
        - cell "Heidelberg Materials AG":
          - link "Heidelberg Materials AG":
            - /url: /entities/n3362507
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "No score yet to Green, 31 Oct 2026": 31 Oct 2026
      - row "KRONES Aktiengesellschaft Green 0 None yet No score yet to Green, 31 Oct 2026":
        - cell "KRONES Aktiengesellschaft":
          - link "KRONES Aktiengesellschaft":
            - /url: /entities/n1090739
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "No score yet to Green, 31 Oct 2026": 31 Oct 2026
      - row "SAP SE Green 0 None yet No score yet to Green, 28 Oct 2026":
        - cell "SAP SE":
          - link "SAP SE":
            - /url: /entities/n1026942
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "No score yet to Green, 28 Oct 2026": 28 Oct 2026
      - row "CATERPILLAR INC. Green 2 Executive departure No score yet to Green, 27 Oct 2026":
        - cell "CATERPILLAR INC.":
          - link "CATERPILLAR INC.":
            - /url: /entities/n3367973
        - cell "Green"
        - cell "2"
        - cell "Executive departure"
        - cell "No score yet to Green, 27 Oct 2026": 27 Oct 2026
      - row "DEERE & COMPANY Green 20 Turnover evolution (year over year) No score yet to Green, 27 Oct 2026":
        - cell "DEERE & COMPANY":
          - link "DEERE & COMPANY":
            - /url: /entities/n3364504
        - cell "Green"
        - cell "20"
        - cell "Turnover evolution (year over year)"
        - cell "No score yet to Green, 27 Oct 2026": 27 Oct 2026
      - row "HONEYWELL INTERNATIONAL INC. Green 7 Piotroski F score (2000), Executive departure No score yet to Green, 27 Oct 2026":
        - cell "HONEYWELL INTERNATIONAL INC.":
          - link "HONEYWELL INTERNATIONAL INC.":
            - /url: /entities/n3360909
        - cell "Green"
        - cell "7"
        - cell "Piotroski F score (2000), Executive departure": Piotroski F score (2000) +1
        - cell "No score yet to Green, 27 Oct 2026": 27 Oct 2026
      - row "GENERAL ELECTRIC COMPANY Green 24 EBIT / interest expense No score yet to Green, 27 Oct 2026":
        - cell "GENERAL ELECTRIC COMPANY":
          - link "GENERAL ELECTRIC COMPANY":
            - /url: /entities/n927222
        - cell "Green"
        - cell "24"
        - cell "EBIT / interest expense"
        - cell "No score yet to Green, 27 Oct 2026": 27 Oct 2026
      - row "ALSTOM Green 0 None yet Added to the book as Green, 26 Oct 2026":
        - cell "ALSTOM":
          - link "ALSTOM":
            - /url: /entities/n2798554
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
      - row "NATIONAL GRID PLC Green 11 Altman Z score (1995) Added to the book as Green, 26 Oct 2026":
        - cell "NATIONAL GRID PLC":
          - link "NATIONAL GRID PLC":
            - /url: /entities/n2598304
        - cell "Green"
        - cell "11"
        - cell "Altman Z score (1995)"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
      - row "DEUTSCHE BANK AKTIENGESELLSCHAFT Green 0 None yet Added to the book as Green, 26 Oct 2026":
        - cell "DEUTSCHE BANK AKTIENGESELLSCHAFT":
          - link "DEUTSCHE BANK AKTIENGESELLSCHAFT":
            - /url: /entities/n2120244
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
      - row "UNILEVER PLC Green 0 None yet Added to the book as Green, 26 Oct 2026":
        - cell "UNILEVER PLC":
          - link "UNILEVER PLC":
            - /url: /entities/n1500904
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
      - row "BP P.L.C. Green 0 None yet Added to the book as Green, 26 Oct 2026":
        - cell "BP P.L.C.":
          - link "BP P.L.C.":
            - /url: /entities/n156743
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
      - row "BARCLAYS PLC Green 0 None yet Added to the book as Green, 26 Oct 2026":
        - cell "BARCLAYS PLC":
          - link "BARCLAYS PLC":
            - /url: /entities/n155662
        - cell "Green"
        - cell "0"
        - cell "None yet"
        - cell "Added to the book as Green, 26 Oct 2026": 26 Oct 2026
  - paragraph: Status changes
  - text: 8 changes to acknowledge
  - button "Acknowledge all"
  - button "Why the status changed"
  - text: 31 Oct 2026
  - link "Heidelberg Materials AG":
    - /url: /entities/n3362507
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 31 Oct 2026
  - link "KRONES Aktiengesellschaft":
    - /url: /entities/n1090739
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 29 Oct 2026
  - link "VINCI":
    - /url: /entities/n233995
  - text: Green to No score yet
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 28 Oct 2026
  - link "SAP SE":
    - /url: /entities/n1026942
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 27 Oct 2026
  - link "CATERPILLAR INC.":
    - /url: /entities/n3367973
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 27 Oct 2026
  - link "DEERE & COMPANY":
    - /url: /entities/n3364504
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 27 Oct 2026
  - link "HONEYWELL INTERNATIONAL INC.":
    - /url: /entities/n3360909
  - text: No score yet to Green
  - button "Acknowledge"
  - button "Why the status changed"
  - text: 27 Oct 2026
  - link "GENERAL ELECTRIC COMPANY":
    - /url: /entities/n927222
  - text: No score yet to Green
  - button "Acknowledge"
  - text: 26 Oct 2026
  - link "CATERPILLAR INC.":
    - /url: /entities/n3367973
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Siemens Aktiengesellschaft":
    - /url: /entities/n3367646
  - text: Added to the book as No score yet 26 Oct 2026
  - link "DEERE & COMPANY":
    - /url: /entities/n3364504
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Heidelberg Materials AG":
    - /url: /entities/n3362507
  - text: Added to the book as No score yet 26 Oct 2026
  - link "HONEYWELL INTERNATIONAL INC.":
    - /url: /entities/n3360909
  - text: Added to the book as No score yet 26 Oct 2026
  - link "SCHNEIDER ELECTRIC SE":
    - /url: /entities/n2828018
  - text: Added to the book as No score yet 26 Oct 2026
  - link "ALSTOM":
    - /url: /entities/n2798554
  - text: Added to the book as Green 26 Oct 2026
  - link "NATIONAL GRID PLC":
    - /url: /entities/n2598304
  - text: Added to the book as Green 26 Oct 2026
  - link "DEUTSCHE BANK AKTIENGESELLSCHAFT":
    - /url: /entities/n2120244
  - text: Added to the book as Green 26 Oct 2026
  - link "thyssenkrupp AG":
    - /url: /entities/n1622213
  - text: Added to the book as No score yet 26 Oct 2026
  - link "UNILEVER PLC":
    - /url: /entities/n1500904
  - text: Added to the book as Green 26 Oct 2026
  - link "ABB Ltd":
    - /url: /entities/n1176711
  - text: Added to the book as No score yet 26 Oct 2026
  - link "BASF SE":
    - /url: /entities/n1100661
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Sulzer AG":
    - /url: /entities/n1090934
  - text: Added to the book as No score yet 26 Oct 2026
  - link "KRONES Aktiengesellschaft":
    - /url: /entities/n1090739
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Holcim AG":
    - /url: /entities/n1034689
  - text: Added to the book as No score yet 26 Oct 2026
  - link "SAP SE":
    - /url: /entities/n1026942
  - text: Added to the book as No score yet 26 Oct 2026
  - link "MTU Aero Engines AG":
    - /url: /entities/n996022
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Schindler Holding AG":
    - /url: /entities/n992421
  - text: Added to the book as No score yet 26 Oct 2026
  - link "Knorr-Bremse Aktiengesellschaft":
    - /url: /entities/n957170
  - text: Added to the book as No score yet 26 Oct 2026
  - link "GENERAL ELECTRIC COMPANY":
    - /url: /entities/n927222
  - text: Added to the book as No score yet 26 Oct 2026
  - link "VINCI":
    - /url: /entities/n233995
  - text: Added to the book as Green 26 Oct 2026
  - link "BP P.L.C.":
    - /url: /entities/n156743
  - text: Added to the book as Green 26 Oct 2026
  - link "BARCLAYS PLC":
    - /url: /entities/n155662
  - text: Added to the book as Green
  - button "Why the status changed"
  - text: 26 Oct 2026
  - link "ROLLS-ROYCE HOLDINGS PLC":
    - /url: /entities/n106084
  - text: Added to the book as Amber
- alert
```

# Test source

```ts
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
> 191 |   await expect(page.locator('[data-testid="tile-not-assessed"]')).toBeVisible();
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
  192 |   var first = page.locator('tbody a[href^="/entities/n"]').first();
  193 |   await expect(first).toBeVisible();
  194 |   var name = (await first.innerText()).trim();
  195 |   await first.click();
  196 |   await page.waitForURL(/\/entities\/n\d+/);
  197 |   await expect(page.locator('h1')).toHaveText(name);
  198 | });
  199 | 
```