# Tender profiles and matches

Your team describes the public tenders it looks for in a tender profile, and Stonewake judges published procurement notices against it by a fixed rule, without any model. Every match explains each criterion of its profile and cites the notice it rests on. The profiles and matches are served over the [API](/v1) and to AI assistants over [MCP](/mcp). On the Tenders page of the dashboard your team sees its matches, each linked to its notice, keeps its profiles and uploads its portal exports, and an analyst adds a match to the Deal Book or sets it aside there. Each profile and match belongs to one team. Whoever works for several teams sees the Tenders page of the team chosen in the sidebar, and a new profile, a pass and an upload go to that team; under All teams the page lists the profiles and matches of every team, each naming its team, and a new profile or upload waits until one team is chosen. Profiles are kept, passes are run and matches are set aside or added to the Deal Book through the dashboard and its API routes `/tenders/profiles` and `/tenders/matches`. Keeping profiles, running passes and setting matches aside need a signed in dashboard session of an analyst in a team that holds the Deal Book module, and these routes are not part of `/v1`. These dashboard routes are no part of the API contract, so the OpenAPI document at `/openapi.json` does not list them. Adding a match to the Deal Book needs the same.

## Your first profile

Every team starts with a profile Stonewake makes from its desk's mandate, so matches arrive without any setup. Its CPV codes are the works and the equipment of the sectors the mandate names, all of the desk's sectors when it names none, and its regions are the countries of the markets the desk buys into, never a market it rules out. A country with no NUTS region, the United Kingdom for example, narrows nothing. The profile sets no other criterion, so a notice that states no value still matches. Stonewake judges the notices of the last 31 days against it at once and every later notice as it arrives. The profile is marked as made by Stonewake, and your team changes, pauses or archives it like any other. An archived one is never made again, and a team that keeps profiles of its own gets none. A team created later gets its profile the moment it is created.

## Where the notices come from

The notices come from TED, the Tenders Electronic Daily of the European Union, today the notices of buyers in Germany. Each notice is stored as TED publishes it, and every match links to the notice's page on TED.

Your bank can also bring notices of its own, from the exports it uploads ([Tender portal exports](/tender-export-upload)) and, once that way is switched on, from the saved search alerts of its own portal accounts ([Your own sources](/own-sources)). They stay with your team. Your profiles judge them by the same rule, and each notice an alert brings is also a match chosen by the portal's own saved search. Such a match links to the notice's page on the portal.

## What a profile asks

A profile names at least one CPV code or one NUTS region. It may add any of the other criteria, and a criterion it leaves empty is not judged.

- **CPV codes.** A code covers every code below it in the CPV tree, so 45000000 (construction work) covers 45233120.
- **NUTS regions.** A region covers every region below it, so DE2 (Bavaria) covers DE212 (Munich). The extra regio codes name no region and cannot be asked for.
- **Value band in EUR**, a lower bound, an upper bound or both, each included. The estimated value the notice states is compared, or the award value when the notice states no estimate. A value in another currency is never converted.
- **Procedure types**, for example open, restricted or negotiated with a prior call for competition.
- **Buyer legal types**, for example local authority, central government authority or body governed by public law.
- **Notice kinds**, for example prior information, competition or result.
- **Days to the tender deadline**, the fewest days that must remain, counted from the day of the pass. Notices of the Bekanntmachungsservice (oeffentlichevergabe.de) state no tender deadline, so a profile that sets this criterion leaves them undetermined, never a match.
- **Keywords**, each one word or several. A keyword matches the notice's title or description as whole words, after umlauts are spelled out and accents are dropped, so Türen, TÜREN and tueren match each other, while Tür never matches Türen. A keyword of several words matches only those words in a row. The match names the field it found the keyword in and the words as the notice writes them.

Every code must be in its official eForms code list. A profile holding codes outside their lists is refused with one answer naming such codes, the first 10 of each list and a count of the rest. Each profile also states its use case, financing a project or the bank as a bidder, and whether it is active. Archive on the Tenders page asks before it archives a profile. An archived profile keeps its matches, is listed under Archived profiles on the Tenders page and by `GET /tenders/profiles?archived=true`, and is restored there or through `POST /tenders/profiles/{profile_id}/restore`, active again.

## How a notice is judged

Each criterion the profile sets is judged on its own and has one of three outcomes.

- **Hit.** The notice states a value the profile asks for, or a code below one it asks for.
- **Miss.** The notice states the field and nothing it states fits. For keywords, both the title and the description are stated and neither holds a keyword.
- **Unknown.** The notice does not state the field, states only a broader code (for example only the country where the profile asks for a region), states a place that could lie anywhere, states a code that no official list holds, or states a value in another currency.

A notice that states several codes for one criterion is a hit when any of them hits. A notice is a match only when every criterion its profile sets is a hit. One miss makes it no match, and a notice with an unknown and no miss stays undetermined. An undetermined notice is never shown as a match.

## Matches

A profile holds one match per procedure. When a later notice of the same procedure also matches, for example a correction or the result notice, the match moves to that notice, and a match your team set aside stays set aside. For every criterion the match states the outcome, the notice field read, what the notice states there and what the profile asks, and it carries the notice itself with its page on TED and its record id. Once the notice's tender deadline lies before today on the buyer's calendar, the match says so with `deadline_passed` and the Tenders page marks it closed. It keeps its status, because a closed tender can still be a project to finance. An amount of 1,000 or less is never a contract value on a published notice, for it is a token a buyer states to withhold the figure, a rate per hour or unit, or a figure whose thousands separator was read as a decimal point, so it is shown and judged as not stated. An analyst can set a match aside through `POST /tenders/matches/{match_id}/dismiss`, and every change is recorded in the audit trail.

Every notice that arrives after a profile was saved is judged against it on its own, soon after it is stored, while the profile is active; a paused profile picks up where it stopped once it is active again. An analyst can also run a profile through `POST /tenders/profiles/{profile_id}/run` over at most 31 days of publication, for example to look back before the profile existed. On the Tenders page this is Look back on the profile's row, which offers the last 31 days, refuses a longer or reversed window with the same sentence and shows what the pass found. The pass answers how many notices it judged and, for each criterion that did not hit, how many notices missed it or left it unknown and why. A pass judges at most 50,000 notices and says so when it stops there.

## Into the Deal Book

An analyst adds a match to the Deal Book with Add to Deal Book on the Tenders page, or through `POST /tenders/matches/{match_id}/to-deal-book`. Only a match that is new and confirmed by every criterion its profile sets goes in. So does a new match your bank's own saved search on a portal chose. A match your team set aside never does, and adding a match twice changes nothing. No model is used anywhere in this step.

- **Cited evidence.** The deal cites the notice itself. Its source is the notice's own fields as the notice states them, the kind of notice, title, buyer, estimated or award value, tender deadline, publication date and reference, with the link to the notice on TED or on your portal, and its finding states the notice in a fixed sentence.
- **Stage.** A prior information notice reads Planned, a contract notice Tender open and a contract award notice Contract awarded, each on your desk's own stages. A later notice moves a deal forward only, never back.
- **One procedure, one deal.** A match of a procedure your Deal Book already holds lands on that deal, whether another of your profiles added it, a notice of your own portal lane that names the same procedure or the same TED publication number went in first, or a research finding already cites the notice's page on TED. On a deal whose parties, stage and research Stonewake maintains, the match is added as it is, and the deal's stage and evidence stay as Stonewake keeps them. Two procedures never land on one deal this way, and when two deals already hold the same procedure the match waits until an analyst merges them.
- **On the deal page.** A deal that holds a tender shows one line with the tender deadline and the link to the notice.

Every addition is recorded in the audit trail.

## Persons

The winners of a contract are never shown on a match, neither their names nor their identifiers. A buyer is named only when every buyer legal type the notice states is a public one. A contract subsidised by a contracting authority, an entity with special or exclusive rights or a defence contractor can be a natural person, so in those cases the buyer's names and identifiers are withheld and the match says so. The notice's description is not shown. Its title is shown unless the buyer is withheld and the title repeats the buyer's name or identifier, and its page on TED is always linked.

## Over the API and MCP

`GET /v1/tenders/profiles`, `GET /v1/tenders/matches`, `GET /v1/tenders/matches/{match_id}` and `GET /v1/tenders/deals/{deal_id}`, the matches a deal holds, serve these reads for the teams you read. A key reads the one team it was issued for, and a reader of several teams narrows `GET /v1/tenders/profiles` and `GET /v1/tenders/matches` to one team with `team`. The MCP tools `tender_profiles` and `tender_matches` read them for an AI assistant, `tender_matches` with `deal_id` for one deal. Each profile says in `made_by_stonewake` whether Stonewake made it from your mandate. Neither surface writes a profile, runs a pass or adds a match to the Deal Book, and neither serves who wrote a profile or who set a match aside. A match from your own portal lane carries `portal_notice` instead of `notice` and says in `decided_by` whether a profile or the portal's saved search chose it, and no portal account, address or key is served.
