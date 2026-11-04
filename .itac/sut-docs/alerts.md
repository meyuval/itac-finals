# Teams and webhook alerts

Stonewake can push an alert about your book into your own systems the moment it is written, either into a Microsoft Teams channel through the Workflows app, or to a webhook of your own that checks a signature on every message. A workspace administrator sets both up on the settings page of the dashboard. Everything below is also readable over the [API](/v1) and by AI assistants over [MCP](/mcp), which read and never change a channel.

## What an alert is

An alert is written when the state of your book changes, for example when an exposure moves to Red, a watched company gets a register event or the news reports a serious event about a company in your book or watch list ([News monitoring](/news-monitoring)), in the same step that records the change, so an alert never announces a change that was rolled back. An alert names its event class, its severity (critical, high or information), the dates and the ids of its subject, and never a name. A channel set up for one team receives that team's alerts and the workspace wide ones, a channel for the whole workspace receives all of them, and either only for the parts of Stonewake its team holds. A fact that was already old when its alert was written is recorded for the daily summary and is not posted.

Alerts by SMS are described under [Alerts by SMS](/sms-alerts). Alert mail reaches the members a team's alert subscription names, which your workspace administration arranges with Stonewake, and every member can switch alert mail on for themself on the settings page, as [Alerts by email](/email-alerts) describes. How soon a register event is found depends on its register, as [Coverage](/coverage) describes, for example once a week for a register watch and, for the German commercial register, only when someone opens the company or a change signal arrives.

## Microsoft Teams

Microsoft retired the Office 365 connectors in Teams in May 2026 and names the Workflows app as their replacement, so Stonewake posts to Teams through a workflow.

- In Teams, open the channel, choose **Workflows**, and pick the template **Send webhook alerts to a channel** (or build a flow on the trigger **When a Teams webhook request is received**).
- Save the workflow and copy its webhook link.
- In Stonewake, open **Settings**, add a channel of the kind Microsoft Teams, and paste the link.

Only an address under a Workflows host that Microsoft documents is accepted (`environment.api.powerplatform.com`, and `logic.azure.com` for older flows). The link carries its own signature, so Stonewake keeps it sealed like a password and never shows it again. Each alert arrives as an Adaptive Card in your workspace's alert language with a button that opens the dashboard. Teams answers that it accepted the run, and posting into the channel is the workflow's own step, so the delivery log reads **Sent** for Teams, never **Delivered**.

## Signed webhook

A webhook alert is an HTTPS POST with a JSON body and the three headers of the [Standard Webhooks](https://www.standardwebhooks.com/) scheme.

- `webhook-id` names the delivery. It stays the same on every retry of one delivery, so your receiver can drop a repeat.
- `webhook-timestamp` is the time of this attempt in seconds since 1 January 1970 (UTC).
- `webhook-signature` is `v1,` followed by the base64 of an HMAC SHA256 over `webhook-id`, a full stop, `webhook-timestamp`, a full stop, and the raw body, keyed with your signing secret.

The signing secret starts with `whsec_` and is shown once, when the channel is created. Store it in your own secret store. To check a message, recompute the signature over the raw body as received, compare it in constant time, and refuse a timestamp more than five minutes away from your clock, which stops a replay. The official Standard Webhooks libraries do all three.

The body carries `type` (`stonewake.alert`), `version`, `content_class`, `event_id`, `severity`, a sentence in `text` and a `link` into the dashboard. The sentence is in your workspace's alert language, German unless an administrator chose English on the settings page; the keys and `version` are the same in both languages. A channel set to **detailed** also carries `event_class`, `occurred_at`, `created_at`, `node_id`, `exposure_id`, and `source`, the kind and id of the record the alert stands on, which the dashboard resolves to its citations. A news event (`press_candidate`) also carries `news` with its `event_type` and the counts of its `articles`, `languages` and `sources`, and a detailed Teams card shows the same in a News line. A channel set to **minimal** carries no subject at all. A 2xx answer is your receiver's confirmation and reads **Delivered** in the log.

## Retries and the dead letter

A delivery that fails for a reason that can pass, such as a 5xx answer, a 408, 425 or 429, a timeout or a connection error, is retried after 30 seconds, 2 minutes, 8 minutes, 32 minutes and then hourly, eight attempts in all, under four hours. Each attempt is recorded. A delivery whose failure cannot pass by waiting is given up at once and reads **Given up**. That is the case for another 4xx answer, for an address that fails the checks below, for a channel disabled while the alert was on its way, and for a kind of channel whose delivery Stonewake has not switched on. A delivery whose attempts ran out reads **Given up** as well. Nothing is dropped without a row in the log.

## Address checks

Every address is checked when the channel is created and again before every send.

- HTTPS only, on the standard port, with no user name or password in the address.
- A host name, never an IP address, in plain ASCII.
- Every address the name resolves to must be public. Private, loopback and link local addresses and the cloud metadata addresses are refused, and the connection is opened only to an address that was checked at that moment, so a name that changes its answer between the check and the call never reaches an inside address.
- Redirects are never followed.
- Your workspace can have an allowlist of hosts. Ask your Stonewake representative to set it; once set, an address off the list is refused.

## Test messages and the test receiver

**Send test message** posts a fixed test document that names no event, through the same checks, and shows the answer at once. A channel can also point at the Stonewake test receiver, which checks the signature and the timestamp of each message and records the result, so you can see a signed delivery work end to end before your own receiver is ready. The test receiver runs inside Stonewake. Its deliveries never leave the platform, and it has no public address. The demo workspace delivers to the test receiver only.

## Channels that are switched off

The settings page shows for every alert channel, email, SMS, Teams, webhook and the alerts in the dashboard, whether it delivers in your workspace. A channel that cannot deliver reads **Switched off** with one sentence that says why, and shows no form and no test button. A channel is switched off while no delivery service is set up for it. In a demonstration workspace email and SMS are switched off, because nothing on them leaves Stonewake there, and Teams and webhook deliver to the Stonewake test receiver. The answer comes from the same settings Stonewake sends each alert by, so it changes as soon as a channel is set up.

## Where each part is served

- Dashboard. The settings page lists the channels, adds and disables them, sends test messages, shows the latest deliveries and sets the alert language and time (German or English, German time or UK time). Administrators only, except the list of which channels deliver, which every member sees.
- API. `GET /v1/alerts/events` lists the alerts, and `GET /v1/alerts/deliveries` serves their delivery status, filterable by `event_id`, `status` and `channel`. `GET /v1/alerts/channels` says which channels deliver in the workspace. A key reads its own team's rows and the workspace wide ones.
- MCP. `alert_events` and `alert_deliveries` read the same, with the same team scope, and `alert_channels` reads which channels deliver.

A channel is created, tested and disabled in the dashboard only, and no address or secret is ever served after it was created.
