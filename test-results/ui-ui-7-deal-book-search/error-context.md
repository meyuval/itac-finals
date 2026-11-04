# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.ts >> ui 7 deal book search
- Location: tests/ui.spec.ts:113:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main a[href^=\'/deal/\']').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('main a[href^=\'/deal/\']').first() with timeout 5000ms
  - waiting for locator('main a[href^=\'/deal/\']').first()

```

```yaml
- alert: Deal Book · Stonewake
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
  - heading "Deal Book" [level=1]
  - paragraph: Deals surfaced by research, every fact cited
  - button "Export"
  - tablist "Deal views":
    - tab "Deals" [selected]
    - tab "Following"
  - textbox "Search deals":
    - /placeholder: Search deals…
  - combobox "All windows":
    - option "All windows" [selected]
    - option "Financing open"
    - option "Early stage"
    - option "Not confirmed"
    - option "Financing set"
    - option "Cancelled"
  - combobox "All sectors":
    - option "All sectors" [selected]
    - option "Energy & power"
    - option "Renewables"
    - option "Oil & gas"
    - option "Mining & metals"
    - option "Rail & transport"
    - option "Aviation"
    - option "Maritime & ports"
    - option "Telecom & digital"
    - option "Water & environment"
    - option "Healthcare"
    - option "Industrial plant"
    - option "Defence"
    - option "Agri & food"
    - option "Social infrastructure"
    - option "Other"
  - combobox "All regions":
    - option "All regions" [selected]
    - option "Europe"
    - option "Turkey"
    - option "CIS & Central Asia"
    - option "GCC"
    - option "Middle East"
    - option "North Africa"
    - option "Sub-Saharan Africa"
    - option "Asia-Pacific"
    - option "Americas"
  - button "Filters"
  - table:
    - rowgroup:
      - row "Deal Financing window Value Parties Score Last activity Actions":
        - columnheader "Deal"
        - columnheader "Financing window"
        - columnheader "Value"
        - columnheader "Parties"
        - columnheader "Score"
        - columnheader "Last activity"
        - cell "Actions"
    - rowgroup:
      - row "Japan Invest 3 LLC, US natural gas generation project United States · Energy & power Financing open $630m JBIC +2 Relevance score 84 of 100 1 Apr 2026 Follow Dismiss":
        - cell "Japan Invest 3 LLC, US natural gas generation project United States · Energy & power":
          - link "Japan Invest 3 LLC, US natural gas generation project United States · Energy & power":
            - /url: /deals/5df4ec755205
        - cell "Financing open"
        - cell "$630m"
        - cell "JBIC +2"
        - cell "Relevance score 84 of 100":
          - img "Relevance score 84 of 100": "84"
        - cell "1 Apr 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New La Cobaltera / El Cofre cobalt-copper project Chile · Mining & metals Financing open $375m US EXIM +2 Relevance score 82 of 100 17 Aug 2026 Follow Dismiss":
        - cell "New La Cobaltera / El Cofre cobalt-copper project Chile · Mining & metals":
          - link "New La Cobaltera / El Cofre cobalt-copper project Chile · Mining & metals":
            - /url: /deals/d26a33aac7a5
        - cell "Financing open"
        - cell "$375m"
        - cell "US EXIM +2"
        - cell "Relevance score 82 of 100":
          - img "Relevance score 82 of 100": "82"
        - cell "17 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Colossus rare earth project debt framework Brazil · Mining & metals Financing open $100m Bpifrance AE +4 Relevance score 76 of 100 20 Aug 2026 Follow Dismiss":
        - cell "New Colossus rare earth project debt framework Brazil · Mining & metals":
          - link "New Colossus rare earth project debt framework Brazil · Mining & metals":
            - /url: /deals/50a4c7ea53e8
        - cell "Financing open"
        - cell "$100m"
        - cell "Bpifrance AE +4"
        - cell "Relevance score 76 of 100":
          - img "Relevance score 76 of 100": "76"
        - cell "20 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "Troilus copper-gold project financing Canada · Mining & metals Financing open $1.2bn EDC +5 Relevance score 76 of 100 5 May 2026 Follow Dismiss":
        - cell "Troilus copper-gold project financing Canada · Mining & metals":
          - link "Troilus copper-gold project financing Canada · Mining & metals":
            - /url: /deals/728189070d4e
        - cell "Financing open"
        - cell "$1.2bn"
        - cell "EDC +5"
        - cell "Relevance score 76 of 100":
          - img "Relevance score 76 of 100": "76"
        - cell "5 May 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Guinea education infrastructure, Planet One contract Guinea · Social infrastructure Financing open $100m UKEF +1 Relevance score 75 of 100 21 Oct 2026 Follow Dismiss":
        - cell "New Guinea education infrastructure, Planet One contract Guinea · Social infrastructure":
          - link "New Guinea education infrastructure, Planet One contract Guinea · Social infrastructure":
            - /url: /deals/efc5abf29141
        - cell "Financing open"
        - cell "$100m"
        - cell "UKEF +1"
        - cell "Relevance score 75 of 100":
          - img "Relevance score 75 of 100": "75"
        - cell "21 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New ACC UK Group government administrative complex, Benin Benin · Social infrastructure Financing open $109m UKEF +1 Relevance score 75 of 100 20 Oct 2026 Follow Dismiss":
        - cell "New ACC UK Group government administrative complex, Benin Benin · Social infrastructure":
          - link "New ACC UK Group government administrative complex, Benin Benin · Social infrastructure":
            - /url: /deals/23501d82fd86
        - cell "Financing open"
        - cell "$109m"
        - cell "UKEF +1"
        - cell "Relevance score 75 of 100":
          - img "Relevance score 75 of 100": "75"
        - cell "20 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Tuaspring Desalination Plant buyer's credit for key components Singapore · Water & environment Financing open $14m JBIC +3 Relevance score 71 of 100 3 Nov 2026 Follow Dismiss":
        - cell "New Tuaspring Desalination Plant buyer's credit for key components Singapore · Water & environment":
          - link "New Tuaspring Desalination Plant buyer's credit for key components Singapore · Water & environment":
            - /url: /deals/b07cef67dbdc
        - cell "Financing open"
        - cell "$14m"
        - cell "JBIC +3"
        - cell "Relevance score 71 of 100":
          - img "Relevance score 71 of 100": "71"
        - cell "3 Nov 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New First Phosphate Port Saguenay phosphoric acid plant Canada · Industrial plant Financing open $213m SACE +6 Relevance score 71 of 100 16 Sep 2026 Follow Dismiss":
        - cell "New First Phosphate Port Saguenay phosphoric acid plant Canada · Industrial plant":
          - link "New First Phosphate Port Saguenay phosphoric acid plant Canada · Industrial plant":
            - /url: /deals/241b8063b86f
        - cell "Financing open"
        - cell "$213m"
        - cell "SACE +6"
        - cell "Relevance score 71 of 100":
          - img "Relevance score 71 of 100": "71"
        - cell "16 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New LS Cable & System subsea cable plant construction in Chesapeake, Virginia United States · Industrial plant Financing open $224m KEXIM +1 Relevance score 71 of 100 24 Aug 2026 Follow Dismiss":
        - cell "New LS Cable & System subsea cable plant construction in Chesapeake, Virginia United States · Industrial plant":
          - link "New LS Cable & System subsea cable plant construction in Chesapeake, Virginia United States · Industrial plant":
            - /url: /deals/81f09fc83a0e
        - cell "Financing open"
        - cell "$224m"
        - cell "KEXIM +1"
        - cell "Relevance score 71 of 100":
          - img "Relevance score 71 of 100": "71"
        - cell "24 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Caravel Copper Project Australia · Mining & metals Financing open $220m Finnvera +3 Relevance score 71 of 100 17 Aug 2026 Follow Dismiss":
        - cell "New Caravel Copper Project Australia · Mining & metals":
          - link "New Caravel Copper Project Australia · Mining & metals":
            - /url: /deals/5098a8d7ee9a
        - cell "Financing open"
        - cell "$220m"
        - cell "Finnvera +3"
        - cell "Relevance score 71 of 100":
          - img "Relevance score 71 of 100": "71"
        - cell "17 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Avalon Thunder Bay lithium processing facility equipment buyer credit Canada · Mining & metals Financing open $95m Finnvera +2 Relevance score 71 of 100 15 Jul 2026 Follow Dismiss":
        - cell "New Avalon Thunder Bay lithium processing facility equipment buyer credit Canada · Mining & metals":
          - link "New Avalon Thunder Bay lithium processing facility equipment buyer credit Canada · Mining & metals":
            - /url: /deals/d58e9aa4e513
        - cell "Financing open"
        - cell "$95m"
        - cell "Finnvera +2"
        - cell "Relevance score 71 of 100":
          - img "Relevance score 71 of 100": "71"
        - cell "15 Jul 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Reko Diq, US EXIM approved financing Pakistan · Mining & metals Financing open $1.3bn US EXIM +2 Relevance score 70 of 100 27 Sep 2026 Follow Dismiss":
        - cell "New Reko Diq, US EXIM approved financing Pakistan · Mining & metals":
          - link "New Reko Diq, US EXIM approved financing Pakistan · Mining & metals":
            - /url: /deals/5839d6debb1e
        - cell "Financing open"
        - cell "$1.3bn"
        - cell "US EXIM +2"
        - cell "Relevance score 70 of 100":
          - img "Relevance score 70 of 100": "70"
        - cell "27 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Luena-Saurimo railway section financing Angola · Rail & transport Financing open $1.1bn Atradius DSB +4 Relevance score 70 of 100 26 Aug 2026 Follow Dismiss":
        - cell "New Luena-Saurimo railway section financing Angola · Rail & transport":
          - link "New Luena-Saurimo railway section financing Angola · Rail & transport":
            - /url: /deals/a14e6f25d3a4
        - cell "Financing open"
        - cell "$1.1bn"
        - cell "Atradius DSB +4"
        - cell "Relevance score 70 of 100":
          - img "Relevance score 70 of 100": "70"
        - cell "26 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Solar power project in Serbia Serbia · Renewables Financing open $1bn K-SURE +1 Relevance score 70 of 100 22 Jun 2026 Follow Dismiss":
        - cell "New Solar power project in Serbia Serbia · Renewables":
          - link "New Solar power project in Serbia Serbia · Renewables":
            - /url: /deals/88e734ce9806
        - cell "Financing open"
        - cell "$1bn"
        - cell "K-SURE +1"
        - cell "Relevance score 70 of 100":
          - img "Relevance score 70 of 100": "70"
        - cell "22 Jun 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Troilus Mining Metso equipment procurement Canada · Mining & metals Financing open $155m Finnvera +2 Relevance score 69 of 100 28 Aug 2026 Follow Dismiss":
        - cell "New Troilus Mining Metso equipment procurement Canada · Mining & metals":
          - link "New Troilus Mining Metso equipment procurement Canada · Mining & metals":
            - /url: /deals/a82d0c5c031e
        - cell "Financing open"
        - cell "$155m"
        - cell "Finnvera +2"
        - cell "Relevance score 69 of 100":
          - img "Relevance score 69 of 100": "69"
        - cell "28 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New La Cotiere Conakry electricity transmission project Guinea · Energy & power Financing open $172m UKEF +2 Relevance score 68 of 100 21 Oct 2026 Follow Dismiss":
        - cell "New La Cotiere Conakry electricity transmission project Guinea · Energy & power":
          - link "New La Cotiere Conakry electricity transmission project Guinea · Energy & power":
            - /url: /deals/fbd1ed72b00f
        - cell "Financing open"
        - cell "$172m"
        - cell "UKEF +2"
        - cell "Relevance score 68 of 100":
          - img "Relevance score 68 of 100": "68"
        - cell "21 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Boffa to Kamsar high-tension power line Guinea · Energy & power Financing open $150m UKEF +1 Relevance score 68 of 100 20 Oct 2026 Follow Dismiss":
        - cell "New Boffa to Kamsar high-tension power line Guinea · Energy & power":
          - link "New Boffa to Kamsar high-tension power line Guinea · Energy & power":
            - /url: /deals/fa774aead926
        - cell "Financing open"
        - cell "$150m"
        - cell "UKEF +1"
        - cell "Relevance score 68 of 100":
          - img "Relevance score 68 of 100": "68"
        - cell "20 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New KDAW Construction rural and semi-urban water programme, Guinea Guinea · Water & environment Financing open $342m UKEF +1 Relevance score 68 of 100 20 Oct 2026 Follow Dismiss":
        - cell "New KDAW Construction rural and semi-urban water programme, Guinea Guinea · Water & environment":
          - link "New KDAW Construction rural and semi-urban water programme, Guinea Guinea · Water & environment":
            - /url: /deals/32128d8d517b
        - cell "Financing open"
        - cell "$342m"
        - cell "UKEF +1"
        - cell "Relevance score 68 of 100":
          - img "Relevance score 68 of 100": "68"
        - cell "20 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New NorthStarH2 e-methanol project FEED Sweden · Industrial plant Financing open $10m AFRY +4 Relevance score 68 of 100 1 Sep 2026 Follow Dismiss":
        - cell "New NorthStarH2 e-methanol project FEED Sweden · Industrial plant":
          - link "New NorthStarH2 e-methanol project FEED Sweden · Industrial plant":
            - /url: /deals/8d4409edd652
        - cell "Financing open"
        - cell "$10m"
        - cell "AFRY +4"
        - cell "Relevance score 68 of 100":
          - img "Relevance score 68 of 100": "68"
        - cell "1 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Argentina LNG project Argentina · Oil & gas Financing open $6bn CESCE +17 Relevance score 65 of 100 25 Sep 2026 Follow Dismiss":
        - cell "New Argentina LNG project Argentina · Oil & gas":
          - link "New Argentina LNG project Argentina · Oil & gas":
            - /url: /deals/f7837b3aa8dd
        - cell "Financing open"
        - cell "$6bn"
        - cell "CESCE +17"
        - cell "Relevance score 65 of 100":
          - img "Relevance score 65 of 100": "65"
        - cell "25 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Taean 500MW offshore wind project South Korea · Renewables Financing open approximately $2-2.5 billion Euler Hermes +1 Relevance score 64 of 100 4 Aug 2026 Follow Dismiss":
        - cell "New Taean 500MW offshore wind project South Korea · Renewables":
          - link "New Taean 500MW offshore wind project South Korea · Renewables":
            - /url: /deals/bfad046e607c
        - cell "Financing open"
        - cell "approximately $2-2.5 billion"
        - cell "Euler Hermes +1"
        - cell "Relevance score 64 of 100":
          - img "Relevance score 64 of 100": "64"
        - cell "4 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Tashkent New Airport project Uzbekistan · Aviation Financing open $5.2bn KEXIM +1 Relevance score 64 of 100 4 Aug 2026 Follow Dismiss":
        - cell "New Tashkent New Airport project Uzbekistan · Aviation":
          - link "New Tashkent New Airport project Uzbekistan · Aviation":
            - /url: /deals/6aed3ca97c1f
        - cell "Financing open"
        - cell "$5.2bn"
        - cell "KEXIM +1"
        - cell "Relevance score 64 of 100":
          - img "Relevance score 64 of 100": "64"
        - cell "4 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Korean Air Lines Co., Ltd, Boeing commercial jet aircraft South Korea · Other Financing open Value not reported. US EXIM +2 Relevance score 64 of 100 15 May 2026 Follow Dismiss":
        - cell "New Korean Air Lines Co., Ltd, Boeing commercial jet aircraft South Korea · Other":
          - link "New Korean Air Lines Co., Ltd, Boeing commercial jet aircraft South Korea · Other":
            - /url: /deals/1c514eb67c72
        - cell "Financing open"
        - cell "Value not reported."
        - cell "US EXIM +2"
        - cell "Relevance score 64 of 100":
          - img "Relevance score 64 of 100": "64"
        - cell "15 May 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Cove Kaz/Kaz Resources Northern Katpar tungsten project Kazakhstan · Mining & metals Financing open $900m US EXIM +1 Relevance score 63 of 100 1 Apr 2026 Follow Dismiss":
        - cell "New Cove Kaz/Kaz Resources Northern Katpar tungsten project Kazakhstan · Mining & metals":
          - link "New Cove Kaz/Kaz Resources Northern Katpar tungsten project Kazakhstan · Mining & metals":
            - /url: /deals/ba053c4174e9
        - cell "Financing open"
        - cell "$900m"
        - cell "US EXIM +1"
        - cell "Relevance score 63 of 100":
          - img "Relevance score 63 of 100": "63"
        - cell "1 Apr 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Mozambique LNG Mozambique · Oil & gas Financing open $3.5bn Atradius DSB +6 Relevance score 62 of 100 1 Dec 2025 Follow Dismiss":
        - cell "New Mozambique LNG Mozambique · Oil & gas":
          - link "New Mozambique LNG Mozambique · Oil & gas":
            - /url: /deals/ae0c173f7a89
        - cell "Financing open"
        - cell "$3.5bn"
        - cell "Atradius DSB +6"
        - cell "Relevance score 62 of 100":
          - img "Relevance score 62 of 100": "62"
        - cell "1 Dec 2025"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Gopalpur Green Ammonia Project Phase One India · Industrial plant Financing open Value not reported. JBIC +1 Relevance score 60 of 100 4 Aug 2026 Follow Dismiss":
        - cell "New Gopalpur Green Ammonia Project Phase One India · Industrial plant":
          - link "New Gopalpur Green Ammonia Project Phase One India · Industrial plant":
            - /url: /deals/efc39f7dc857
        - cell "Financing open"
        - cell "Value not reported."
        - cell "JBIC +1"
        - cell "Relevance score 60 of 100":
          - img "Relevance score 60 of 100": "60"
        - cell "4 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Karuma-Tororo 400kV transmission line construction Uganda · Energy & power Financing open Value not reported. EKN +1 Relevance score 58 of 100 23 Oct 2026 Follow Dismiss":
        - cell "New Karuma-Tororo 400kV transmission line construction Uganda · Energy & power":
          - link "New Karuma-Tororo 400kV transmission line construction Uganda · Energy & power":
            - /url: /deals/766f89abbcb8
        - cell "Financing open"
        - cell "Value not reported."
        - cell "EKN +1"
        - cell "Relevance score 58 of 100":
          - img "Relevance score 58 of 100": "58"
        - cell "23 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Defence and security campus in Benin Benin · Defence Financing open $27m UKEF +1 Relevance score 58 of 100 20 Oct 2026 Follow Dismiss":
        - cell "New Defence and security campus in Benin Benin · Defence":
          - link "New Defence and security campus in Benin Benin · Defence":
            - /url: /deals/15c5e98c1f8f
        - cell "Financing open"
        - cell "$27m"
        - cell "UKEF +1"
        - cell "Relevance score 58 of 100":
          - img "Relevance score 58 of 100": "58"
        - cell "20 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Casablanca desalination plant (Sidi Rahal) Morocco · Water & environment Financing open Value not reported. Acciona Relevance score 58 of 100 27 Sep 2026 Follow Dismiss":
        - cell "New Casablanca desalination plant (Sidi Rahal) Morocco · Water & environment":
          - link "New Casablanca desalination plant (Sidi Rahal) Morocco · Water & environment":
            - /url: /deals/fa8e57d623fc
        - cell "Financing open"
        - cell "Value not reported."
        - cell "Acciona"
        - cell "Relevance score 58 of 100":
          - img "Relevance score 58 of 100": "58"
        - cell "27 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Digital Media City (DMC) Infrastructure Project at Konza Technopolis Kenya · Telecom & digital Financing open Value not reported. KEXIM +1 Relevance score 56 of 100 21 Aug 2026 Follow Dismiss":
        - cell "New Digital Media City (DMC) Infrastructure Project at Konza Technopolis Kenya · Telecom & digital":
          - link "New Digital Media City (DMC) Infrastructure Project at Konza Technopolis Kenya · Telecom & digital":
            - /url: /deals/bfe1aee1813a
        - cell "Financing open"
        - cell "Value not reported."
        - cell "KEXIM +1"
        - cell "Relevance score 56 of 100":
          - img "Relevance score 56 of 100": "56"
        - cell "21 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Cebu port project Philippines · Maritime & ports Financing open $173m KEXIM Relevance score 56 of 100 No dated evidence Follow Dismiss":
        - cell "New Cebu port project Philippines · Maritime & ports":
          - link "New Cebu port project Philippines · Maritime & ports":
            - /url: /deals/c8f8a62f6cf6
        - cell "Financing open"
        - cell "$173m"
        - cell "KEXIM"
        - cell "Relevance score 56 of 100":
          - img "Relevance score 56 of 100": "56"
        - cell "No dated evidence"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Montepuez-Lichinga Road Project Mozambique · Other Financing open Value not reported. JBIC +3 Relevance score 54 of 100 3 Aug 2026 Follow Dismiss":
        - cell "New Montepuez-Lichinga Road Project Mozambique · Other":
          - link "New Montepuez-Lichinga Road Project Mozambique · Other":
            - /url: /deals/e9a9b09cfbb9
        - cell "Financing open"
        - cell "Value not reported."
        - cell "JBIC +3"
        - cell "Relevance score 54 of 100":
          - img "Relevance score 54 of 100": "54"
        - cell "3 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New 3,000 MW solar project with battery storage in Iraq Iraq · Renewables Financing open Value not reported. UKEF +4 Relevance score 54 of 100 4 Mar 2026 Follow Dismiss":
        - cell "New 3,000 MW solar project with battery storage in Iraq Iraq · Renewables":
          - link "New 3,000 MW solar project with battery storage in Iraq Iraq · Renewables":
            - /url: /deals/bef782a65868
        - cell "Financing open"
        - cell "Value not reported."
        - cell "UKEF +4"
        - cell "Relevance score 54 of 100":
          - img "Relevance score 54 of 100": "54"
        - cell "4 Mar 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Katyavala Bwila University faculty buildings, phase 1 Angola · Social infrastructure Financing open Value not reported. Mitrelli +1 Relevance score 53 of 100 19 Oct 2026 Follow Dismiss":
        - cell "New Katyavala Bwila University faculty buildings, phase 1 Angola · Social infrastructure":
          - link "New Katyavala Bwila University faculty buildings, phase 1 Angola · Social infrastructure":
            - /url: /deals/aa8f91f1e78d
        - cell "Financing open"
        - cell "Value not reported."
        - cell "Mitrelli +1"
        - cell "Relevance score 53 of 100":
          - img "Relevance score 53 of 100": "53"
        - cell "19 Oct 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Ethiopian Airlines Group, Boeing commercial jet aircraft Ethiopia · Other Financing open Value not reported. US EXIM +2 Relevance score 51 of 100 15 Jan 2026 Follow Dismiss":
        - cell "New Ethiopian Airlines Group, Boeing commercial jet aircraft Ethiopia · Other":
          - link "New Ethiopian Airlines Group, Boeing commercial jet aircraft Ethiopia · Other":
            - /url: /deals/db5ba2f73758
        - cell "Financing open"
        - cell "Value not reported."
        - cell "US EXIM +2"
        - cell "Relevance score 51 of 100":
          - img "Relevance score 51 of 100": "51"
        - cell "15 Jan 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Mesabi Metallics Minnesota iron-ore and direct-reduction pellet project United States · Mining & metals Financing open $10bn US EXIM +1 Relevance score 46 of 100 17 Aug 2026 Follow Dismiss":
        - cell "New Mesabi Metallics Minnesota iron-ore and direct-reduction pellet project United States · Mining & metals":
          - link "New Mesabi Metallics Minnesota iron-ore and direct-reduction pellet project United States · Mining & metals":
            - /url: /deals/7b90d6d87526
        - cell "Financing open"
        - cell "$10bn"
        - cell "US EXIM +1"
        - cell "Relevance score 46 of 100":
          - img "Relevance score 46 of 100": "46"
        - cell "17 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Captain Arctic vessel construction Mauritius · Other Financing open Value not reported. Atradius DSB Relevance score 44 of 100 18 Jun 2026 Follow Dismiss":
        - cell "New Captain Arctic vessel construction Mauritius · Other":
          - link "New Captain Arctic vessel construction Mauritius · Other":
            - /url: /deals/cc9e26dd7f8e
        - cell "Financing open"
        - cell "Value not reported."
        - cell "Atradius DSB"
        - cell "Relevance score 44 of 100":
          - img "Relevance score 44 of 100": "44"
        - cell "18 Jun 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Santa Cruz copper project United States · Mining & metals Financing open $1.1bn US EXIM +1 Relevance score 42 of 100 24 Aug 2026 Follow Dismiss":
        - cell "New Santa Cruz copper project United States · Mining & metals":
          - link "New Santa Cruz copper project United States · Mining & metals":
            - /url: /deals/7029eb3cc34a
        - cell "Financing open"
        - cell "$1.1bn"
        - cell "US EXIM +1"
        - cell "Relevance score 42 of 100":
          - img "Relevance score 42 of 100": "42"
        - cell "24 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New US EXIM Loan for Perpetua Resources Stibnite Gold Project United States · Mining & metals Financing open $2.9bn US EXIM +1 Relevance score 42 of 100 21 May 2026 Follow Dismiss":
        - cell "New US EXIM Loan for Perpetua Resources Stibnite Gold Project United States · Mining & metals":
          - link "New US EXIM Loan for Perpetua Resources Stibnite Gold Project United States · Mining & metals":
            - /url: /deals/a7005152c406
        - cell "Financing open"
        - cell "$2.9bn"
        - cell "US EXIM +1"
        - cell "Relevance score 42 of 100":
          - img "Relevance score 42 of 100": "42"
        - cell "21 May 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Aclara Project Dynamo rare earth facility United States · Mining & metals Financing open $750m US EXIM +1 Relevance score 37 of 100 4 Sep 2026 Follow Dismiss":
        - cell "New Aclara Project Dynamo rare earth facility United States · Mining & metals":
          - link "New Aclara Project Dynamo rare earth facility United States · Mining & metals":
            - /url: /deals/78440cf198a8
        - cell "Financing open"
        - cell "$750m"
        - cell "US EXIM +1"
        - cell "Relevance score 37 of 100":
          - img "Relevance score 37 of 100": "37"
        - cell "4 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New EVelution Energy Arizona cobalt processing facility United States · Mining & metals Financing open $275m US EXIM +1 Relevance score 36 of 100 3 Aug 2026 Follow Dismiss":
        - cell "New EVelution Energy Arizona cobalt processing facility United States · Mining & metals":
          - link "New EVelution Energy Arizona cobalt processing facility United States · Mining & metals":
            - /url: /deals/a9d0f863eac6
        - cell "Financing open"
        - cell "$275m"
        - cell "US EXIM +1"
        - cell "Relevance score 36 of 100":
          - img "Relevance score 36 of 100": "36"
        - cell "3 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New American Rare Earths Halleck Creek project United States · Mining & metals Financing open $456m US EXIM +1 Relevance score 34 of 100 17 Aug 2026 Follow Dismiss":
        - cell "New American Rare Earths Halleck Creek project United States · Mining & metals":
          - link "New American Rare Earths Halleck Creek project United States · Mining & metals":
            - /url: /deals/95e83f568e65
        - cell "Financing open"
        - cell "$456m"
        - cell "US EXIM +1"
        - cell "Relevance score 34 of 100":
          - img "Relevance score 34 of 100": "34"
        - cell "17 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Canada Nickel Crawford nickel-cobalt project Canada · Mining & metals Financing open $500m EDC +1 Relevance score 33 of 100 17 Aug 2026 Follow Dismiss":
        - cell "New Canada Nickel Crawford nickel-cobalt project Canada · Mining & metals":
          - link "New Canada Nickel Crawford nickel-cobalt project Canada · Mining & metals":
            - /url: /deals/b79264cb3be5
        - cell "Financing open"
        - cell "$500m"
        - cell "EDC +1"
        - cell "Relevance score 33 of 100":
          - img "Relevance score 33 of 100": "33"
        - cell "17 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Atlas Salt Great Atlantic Salt Project Canada · Mining & metals Financing open $107m EDC +1 Relevance score 33 of 100 23 Jul 2026 Follow Dismiss":
        - cell "New Atlas Salt Great Atlantic Salt Project Canada · Mining & metals":
          - link "New Atlas Salt Great Atlantic Salt Project Canada · Mining & metals":
            - /url: /deals/a7e3766d765d
        - cell "Financing open"
        - cell "$107m"
        - cell "EDC +1"
        - cell "Relevance score 33 of 100":
          - img "Relevance score 33 of 100": "33"
        - cell "23 Jul 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New EVelution Energy cobalt processing facility United States · Mining & metals Financing open $70m Finnvera +1 Relevance score 33 of 100 28 May 2026 Follow Dismiss":
        - cell "New EVelution Energy cobalt processing facility United States · Mining & metals":
          - link "New EVelution Energy cobalt processing facility United States · Mining & metals":
            - /url: /deals/ffecffe8f975
        - cell "Financing open"
        - cell "$70m"
        - cell "Finnvera +1"
        - cell "Relevance score 33 of 100":
          - img "Relevance score 33 of 100": "33"
        - cell "28 May 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Tele-Fonika Cable Americas Corp, Industrial cables United States · Other Financing open Value not reported. US EXIM +1 Relevance score 32 of 100 24 Aug 2026 Follow Dismiss":
        - cell "New Tele-Fonika Cable Americas Corp, Industrial cables United States · Other":
          - link "New Tele-Fonika Cable Americas Corp, Industrial cables United States · Other":
            - /url: /deals/833b40553c7e
        - cell "Financing open"
        - cell "Value not reported."
        - cell "US EXIM +1"
        - cell "Relevance score 32 of 100":
          - img "Relevance score 32 of 100": "32"
        - cell "24 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Export of 20 KF-21 Boramae fighter jets to Philippine Air Force Philippines · Defence Financing open Value not reported. KEXIM +1 Relevance score 30 of 100 2 Jul 2026 Follow Dismiss":
        - cell "New Export of 20 KF-21 Boramae fighter jets to Philippine Air Force Philippines · Defence":
          - link "New Export of 20 KF-21 Boramae fighter jets to Philippine Air Force Philippines · Defence":
            - /url: /deals/1e550023d5f7
        - cell "Financing open"
        - cell "Value not reported."
        - cell "KEXIM +1"
        - cell "Relevance score 30 of 100":
          - img "Relevance score 30 of 100": "30"
        - cell "2 Jul 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Perpetua Resources Idaho Inc, The items being exported will be gold dor[eacute] and antimony concentrate United States · Other Financing open Value not reported. US EXIM +1 Relevance score 30 of 100 30 Mar 2026 Follow Dismiss":
        - cell "New Perpetua Resources Idaho Inc, The items being exported will be gold dor[eacute] and antimony concentrate United States · Other":
          - link "New Perpetua Resources Idaho Inc, The items being exported will be gold dor[eacute] and antimony concentrate United States · Other":
            - /url: /deals/27f175eb4801
        - cell "Financing open"
        - cell "Value not reported."
        - cell "US EXIM +1"
        - cell "Relevance score 30 of 100":
          - img "Relevance score 30 of 100": "30"
        - cell "30 Mar 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Tekmar European offshore wind project contract extension Renewables Financing open $7m UKEF +1 Relevance score 29 of 100 30 Sep 2026 Follow Dismiss":
        - cell "New Tekmar European offshore wind project contract extension Renewables":
          - link "New Tekmar European offshore wind project contract extension Renewables":
            - /url: /deals/4e7ece17c42f
        - cell "Financing open"
        - cell "$7m"
        - cell "UKEF +1"
        - cell "Relevance score 29 of 100":
          - img "Relevance score 29 of 100": "29"
        - cell "30 Sep 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
      - row "New Hudbay Minerals copper projects Mining & metals Financing open $825m US EXIM +1 Relevance score 28 of 100 2 Aug 2026 Follow Dismiss":
        - cell "New Hudbay Minerals copper projects Mining & metals":
          - link "New Hudbay Minerals copper projects Mining & metals":
            - /url: /deals/b591460adf51
        - cell "Financing open"
        - cell "$825m"
        - cell "US EXIM +1"
        - cell "Relevance score 28 of 100":
          - img "Relevance score 28 of 100": "28"
        - cell "2 Aug 2026"
        - cell "Follow Dismiss":
          - button "Follow"
          - button "Dismiss"
  - paragraph:
    - text: 308 held back as financing set, cancelled, older than 12 months or with no movement in that time, own bank, domestic, below the value floor or not a lending deal of your desk.
    - button "Show them"
  - text: 1 to 50 of 145
  - button "Previous" [disabled]
  - button "Next"
```

# Test source

```ts
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
> 124 |   await expect(link).toBeVisible();
      |                      ^ Error: expect(locator).toBeVisible() failed
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