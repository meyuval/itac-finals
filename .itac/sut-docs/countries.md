# Countries

Countries lists every market with its country risk and its list standing, and opens a cited profile for each. The figures come from public reference datasets, each named with its publisher, licence and edition on [Coverage](/coverage).

## The list

- One line per market shows country risk from 0 to 100, where higher is riskier, and its sanctions, EU AML and FATF list flags. Where your workspace has a Deal Book, the line also shows your live deals there and their reported value, counted like the Deal Book for the team chosen in the sidebar, or for every team under All teams.
- The strip on top counts the countries in each risk band, or shows where your pipeline value sits by band, and a click on a band filters the list.
- **Export** downloads the countries as an Excel workbook. Where your workspace has a Deal Book, it holds the same live deals and value for each market.

A country is scored only where its components with data carry at least half of the score's weight, and reads Not scored below that, with that reason on hover. The page lists the components with data and prints nothing about the others, not even a percentage. A component without data is never scored as safe.

## A country profile

A country page shows the composite risk with its weighted breakdown, the list status with a citation to each instrument, every indicator of the page with a value, the Corruption Perceptions Index, the governance indicators, the Global Freedom Score of Freedom in the World and the OECD country risk category, each with its edition, the reference events and, where you have a Deal Book, your deals there for the same team. **Download report** produces the Country Brief PDF for that team. **Research this country** puts the market on the daily research sweep (edit access), and the header then reads Researched daily.

## How the score is built

The score reads seven components in two parts. The country assessments are the Corruption Perceptions Index (weight 25), the governance indicators (20), the OECD country risk category (12) and verified adverse news from your own research (13). The list standing is the FATF lists (10), the EU high risk list (5) and the country sanctions programs (15). Each component turns its input into a risk from 0 to 100, the OECD category k as k times 100 divided by 7.

A component without data passes its weight to the components with data in its own part, so the list standing counts 30 of the 100 points for every country and a missing assessment is never filled with list rows that read 0. A country is scored only where its components with data carry at least 50 of the 100 weight points. The OECD category is the consensus of the export credit agencies on country credit risk. A country the OECD does not classify, such as a high income OECD or euro area country, has no category in the score and is never read as category 0, and its page reads the note the OECD table gives it in the table's own words. **How the points are counted** under the breakdown shows each row's arithmetic. `GET /v1/countries/{iso3}` carries `gaps` on its `risk`, each component the score is computed without with its `reason` and its `sentences`, and each row's `part`.

## Over the API

`GET /v1/countries` serves the index and `GET /v1/countries/{iso3}` one country's cited detail, every indicator with its dataset attribution and `on_record` false where the active edition holds no value for the country. A country without a score carries `risk_reason` `below_coverage_floor` on `GET /v1/countries`. `GET /v1/reference/datasets` lists the datasets behind them. See the [API reference](/v1#countries-and-reference-data).
