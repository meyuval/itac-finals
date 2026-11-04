# Book import

A bank's book of companies can join portfolio monitoring in one step instead of one search per company. You prepare a CSV file, the import matches every row by its register identifier, shows you what it would do row by row, and adds the companies only when you confirm. In the dashboard the import sits on the portfolio page under Import book, which also offers a template to download.

## Names are never identity

Every row is matched by its register identifier alone, an LEI or a company register number. The name column is shown beside the name the register holds, so a wrong number is easy to spot, and it is never used to find a company. A row that gives only a name adds nothing. A number that could mean more than one company is listed back as ambiguous and never guessed.

## The file

The first line is the header. `identifier_type` and `identifier` are required; the other columns are optional.

```text
identifier_type,identifier,name,currency,limit_amount,drawn_amount
lei,549300UDG16DOYUPR330,thyssenkrupp AG,EUR,50000000,20000000
de_register,HRB 728059 Ulm,VARTA AKTIENGESELLSCHAFT,,,
us_cik,0000012927,BOEING CO,USD,25000000,
```

- The file is comma separated. A header written with semicolons, as German spreadsheet exports write it, is read with semicolons. Lines may end the way any spreadsheet ends them.
- Save the book as CSV. A file saved as Unicode text, or any file holding a control character, is refused as a whole with the reason, and nothing in it is read.
- At most 2,000 rows and 1,000,000 characters per file. A longer book is split and imported in parts; importing a part twice adds nothing twice.
- `currency`, `limit_amount` and `drawn_amount` are the facility figures of the exposure. They are your own figures for reading the book and are never scored. An amount is written as digits with at most two decimals and no thousands separator, for example `25000000.50` or `25000000,50`, and less than 1,000,000,000,000,000; an amount needs its currency, a three letter ISO code.
- These figures apply to companies the import adds. A company already in the book keeps its terms; change them with Edit terms on its row.

## Identifier types

| Identifier type | Register |
|---|---|
| `lei` | Legal Entity Identifier, 20 characters |
| `de_register` | German commercial register, with register type, number and court in one cell, for example `HRB 275806 München` |
| `uk_crn` | UK Companies House company number |
| `us_cik` | US SEC Central Index Key |
| `ch_uid` | Swiss business identification number (UID) |
| `fr_siren` | French SIREN |
| `dk_cvr` | Danish CVR number |
| `no_orgnr` | Norwegian organisation number |
| `be_kbo` | Belgian enterprise number |
| `cz_ico` | Czech company identification number (IČO) |
| `sk_ico` | Slovak company identification number (IČO) |
| `euid` | European Unique Identifier |
| `es_rm_hoja` | Spanish mercantile register sheet |
| `lv_regnr` | Latvian registration number |
| `ee_reg` | Estonian registry code |
| `au_acn` | Australian Company Number (ACN) |
| `au_abn` | Australian Business Number (ABN) |
| `us_co_sos_id` | Colorado Secretary of State entity id |
| `us_ct_sos_id` | Connecticut Secretary of the State business id, seven digits |
| `us_ny_dos_id` | New York Department of State DOS ID |
| `us_rssd` | US Federal Reserve RSSD id |
| `us_crd` | US FINRA CRD number |
| `de_mastr` | German energy market master data register number |
| `ro_cui` | Romanian unique registration code (CUI), without the RO prefix |
| `ra_ra000406` | A registration authority number GLEIF states, the type named by its authority's code (`ra_ra` and six digits), for example `ra_ra000406`, the Israeli Registrar of Companies, as the company answers print it |
| `isin` | ISIN of a security the company issued, as GLEIF maps it to the company |
| `bic` | SWIFT business identifier code GLEIF maps to the company |
| `mic` | Market identifier code of a trading venue GLEIF maps to its operator |
| `vat` | VAT number with its country prefix |
| `ocid` | OpenCorporates id GLEIF maps to the company |
| `spglobal` | S&P Global company id GLEIF states |
| `northdata_id` | North Data entity id |

A German register number without its court is ambiguous, because the same number exists at several courts, so the row is not matched to any of them.

Every identifier is checked by its type's own rule before it is matched. An LEI has 18 letters or digits and two check digits that must hold (ISO 17442), an ISIN its check digit (ISO 6166), and a Norwegian organisation number, a Belgian enterprise number, a Swiss UID and an Australian ABN or ACN the check digit their register publishes. A value that fails the rule is invalid and names the format, so a mistyped number never reads as a company that is missing from the register data.

Whatever the type, the company the row finds must carry a register identifier or an LEI to join the book, the rule the add field applies too.

An identifier that is a number, such as a CIK, an RSSD id, a SIREN or a Swiss UID, is read as its digits, with spaces, points, slashes or hyphens between them if you like, and a Swiss UID may start with CHE. A letter or any other sign in it makes the row invalid instead of being dropped, because a letter O typed for a zero would otherwise match a different company.

## What each row answers

| Outcome | Meaning |
|---|---|
| `add` | The identifier matches one company that is not in your team's book; the import adds it. |
| `reactivate` | The company was in the book and was retired; the import returns it. |
| `in_book` | The company is already in the book. Nothing changes. Where the book holds the same company under its other register record, such as its SEC filer record beside its LEI record, the row names the company the book holds. |
| `duplicate` | The same company appears on an earlier line of the file, also under its other register record. |
| `ambiguous` | The identifier could mean more than one company, such as a German register number without its court. |
| `unresolved` | No company holds this identifier in the register data. |
| `invalid` | The row cannot be read because of a missing identifier, an unknown identifier type, a letter or sign in an identifier that is a number (such as `us_cik,32O193`), an identifier that fails its type's check (such as an LEI whose check digits do not hold), an identifier longer than 64 characters, or a figure that is not a plain amount. |

Every row that is not an `add` carries its reason in plain words. The import goes into the book of your own team, and the preview names that team.

## Preview first, then confirm

The preview writes nothing. In the dashboard you confirm the preview with one click, and the import then runs again against the book as it stands at that moment, so the result can differ from the preview only where the book changed in between. Each company added is recorded in the audit trail with who added it, its register records are watched, and the import queues a recompute of the book.

## Over the API and MCP

- `POST /v1/portfolio/import` previews an import. Send `{"csv": "..."}` and read the same outcomes the dashboard shows. `dry_run` is always true on `/v1`, so the API stays read only, and applying an import happens in the dashboard. The rows come in pages, in file order. `limit` (default and maximum 100) and `offset` choose the page, while `counts` and `total` always cover the whole file. A file that cannot be read at all, for example one without the two identifier columns, answers a 422 whose body names the problem.
- The MCP tool `portfolio_import_preview` sends the same request and pages the rows the same way. A file refused as a whole comes back as a tool error with the same reason.

## Bank terms

Some monitoring signals read inputs only your bank holds, and their rows say Awaiting bank input until you supply them. These are the counterparties of a deal (such as a guarantor, an LC bank or an offtaker), a project's register entry, the refinancing market a borrower is priced against and the supervisory slotting grades of a project finance exposure. Enter them with Edit terms on the exposure's row of the portfolio page. A saved declaration is scored on the next recompute, which the save queues, and the row leaves Awaiting bank input once its input is present. The facility figures are never scored, so a change to them alone queues no recompute. Stored terms the form does not edit are listed in it and saved back unchanged. What you enter is stored in your workspace, and the book is monitored without it.
