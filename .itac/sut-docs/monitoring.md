# Monitoring

Monitoring is the settings page of what research checks for the deals and names you follow, and how often, hourly, daily, every 2 days or weekly. You follow deals, companies, brands, persons and topics in one place, the Following tab of the [Deal Book](/deal-book), which lists each one with its newest update and, where public posts are read, its tone. Research looks for new developments about each one, each cited to its public source. In workspaces where person data is switched on, natural persons can be followed too.

## The page

- The table lists every name you follow and the research check of every deal you follow. It shows each one's type, how often it is checked (under the setting, the schedule research keeps in your workspace where that differs), its last check and its status, OK, Queued, Checking, Overdue when a check is late, Paused, Retrying, or Failed with the error on hover.
- The **Active** switch pauses or resumes a check, and a paused one is not checked until it is resumed. Select rows to pause, resume or remove several at once (edit access).
- **Follow a name** sits in the Following tab, with **Browse catalog**, which adds the export credit agencies and other agencies of your desk's verified catalog by region, in bulk. A workspace without the Deal Book keeps Follow a name on this page. The earlier addresses of the Sentiment tab lead to the Following tab.

## What Monitoring is not

Monitoring is research on a schedule. It is not the credit monitoring of your book, which is the [Portfolio](/portfolio), and not the register watch on a single company, which [Coverage](/coverage) describes. News and social media about the companies of your book are covered in [News monitoring](/news-monitoring) and [Social monitoring](/social-monitoring).

## Over the API

The Following tab is two reads over the API, the deals your team follows (`GET /v1/deals` with `status` `tracking`) and the names, `GET /v1/monitoring/targets`, which serves them with their latest run outcome and next due time, `GET /v1/monitoring/catalog` your desk's catalog and `GET /v1/monitoring/sources` the sources research reads. See the [API reference](/v1#research).
