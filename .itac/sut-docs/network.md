# Network

The Network view shows a company's register neighborhood, its officers, shareholders and beneficial owners, its holdings, branches and other relations a public register states. Every relationship is copied from a public register record, and a click on it shows that record with its source and the day it was read.

## Reading the graph

- Click a company to see its connections, or a relationship to see its source.
- Solid lines are current relationships and dashed lines have ended. Financing relationships are drawn in their own colour.
- **Min ownership** hides shareholdings below a percentage. **Current**, **All history** and **As of** choose which relationships are shown, those in force today, every one on record, or those in force on a date.
- **How are A and B connected?** finds the register path between two companies.
- **Export CSV** downloads the relationships shown, each with its citation.
- When a register lists more relationships than the canvas can draw, the view says how many of them it shows.

Natural persons and their relationships are shown in workspaces where person data is switched on and left out elsewhere. Opening a company here can start a register lookup; reading the network over the API never does.

## Ownership chain

A company's upward ownership chain, hop by hop with each hop cited, is shown on its company page and served by `GET /v1/nodes/{node_id}/ownership-chain`.

Beside the chain, the company page lists every person with significant control the Companies House register lists for the company, as the register states each one, with the band of shares or votes held, where an organisation is registered, the day it was notified and, for one that ceased, the day it ceased. A company whose owners all ceased lists them with their dates, so it never reads as a company that never had one. An organisation registered outside the United Kingdom is named there, although no owner record links it to a company Stonewake can follow, and while it holds control the chain ends on it, named and not traced further, never on a register statement that the company has none. A company the register lists as exempt, such as a company whose shares are traded on a regulated market, ends its chain as exempt.

The company page also states a Companies House company's officers on the first visit. Where they are not read yet they are read at once, the page says so and shows them the moment they arrive, and where the register lists none the page says so with the day it was checked. The company profile PDF says the same.

## Register watch

**Watch register changes** sets a register watch on the company for your team (edit access). [Coverage](/coverage) says which registers a watch checks again and how often.

## Over the API and MCP

`GET /v1/nodes/{node_id}/network` serves the same neighborhood with every relationship's citation, described in the [API reference](/v1#network). Over [MCP](/mcp) the same reads are available to AI assistants.
