# Terms of use

API and MCP access is part of the Stonewake service. Use is governed by your customer agreement, the order form together with the [Terms of Service](https://stonewake.ai/terms). This page states the practical rules for the API surface in plain language; where it differs from the customer agreement, the agreement prevails.

German law governs the contract, excluding the UN Convention on Contracts for the International Sale of Goods (Terms of Service, clause 14.1), and the provider is Stonewake, seated in Germany, as the [imprint](https://stonewake.ai/imprint) states.

## Permitted use

The API exists to put your workspace's intelligence into your institution's own workflows, such as monitoring pipelines, internal reporting, committee preparation, research assistants. Use is internal to the customer named in the agreement, by the users and systems it authorizes.

## Acceptable use

- Keep access inside your institution. Do not share keys with third parties or operate the API on behalf of anyone who is not party to the agreement.
- Do not resell, sublicense, redistribute, or systematically extract the data, and do not operate a product or search over it that is open to the public.
- Do not circumvent technical limits. Rate limits, quotas, tenant isolation, and the restriction to read access are part of the service.
- Do not read the dashboard with bots, scrapers or other automated means. Automated access runs through the API and the MCP endpoint, within their limits. Assistive technology such as a screen reader is not affected.
- Do not use output as the sole basis for an automated decision that produces legal or similarly significant effects on a person. Outputs support human decisions; a person reviews and owns every such decision.
- Do not use output to evaluate the creditworthiness of a natural person or to build any score of a person. Where person data is switched on for your workspace, the API serves the natural persons that official registers and the official sanctions lists name, for know your customer, sanctions and credit due diligence on organisations and their people, and nothing read from it may be repurposed toward such a score.

## Data licensing and attribution

Some obligations travel with the data and apply to how you display and reuse it.

- Attribution fields are part of the data. Where a response carries source names, identifiers, retrieval dates, or attribution lines, preserve them when the data is displayed.
- Press quotes are provided for evidentiary use in your compliance and credit workflow. Display them inside your internal work product with their attribution; do not republish them outside it.
- Indicator data from third parties carries its stated licence. `GET /v1/reference/datasets` lists each dataset's licence and attribution line. For example, the Transparency International Corruption Perceptions Index is served under CC BY-ND 4.0 with values displayed unmodified, and the World Bank Worldwide Governance Indicators under CC BY 4.0; display such values with their attribution intact.
- A figure you modify or derive is yours, not the source's. Do not attribute modified or derived figures to the original source.

## When access ends

API access is enabled per workspace and can end or lapse under your arrangement. Keys stop authenticating when access lapses; listing and revoking your keys keeps working, so you can see and control what was issued (see [Keys and access management](/keys)). Export, wind down, and deletion follow the customer agreement; the posture is summarized under [Security](/security).

Questions about permitted use go to [contact@stonewake.ai](mailto:contact@stonewake.ai).
