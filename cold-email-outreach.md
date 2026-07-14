# Cold Email Campaign Engine

## Overview

A single n8n workflow for weekday B2B cold email sending. It reads leads from Google Sheets, filters rows marked `To Contact`, caps the daily send volume, generates one AI icebreaker per lead, sends the email via SMTP, logs the send, and marks the original lead row as `Sent`.

Created in n8n:

`https://lavencianco.app.n8n.cloud/workflow/1O3W4ku1Buflun7O`

## Workflow

```
Daily Schedule
      |
      v
Read Campaign Leads
      |
      v
Limit Daily Send Volume
      |
      v
Loop One Lead at a Time
      |
      v
Prepare Lead
      |
      v
Generate Icebreaker
      |
      v
Compose Email
      |
      v
Send Cold Email
      |
      v
Upsert Sent Log
      |
      v
Mark Campaign Row Sent
```

## Schedule

Runs weekdays at 8:00 AM using cron:

```cron
0 8 * * 1-5
```

## Google Sheets Setup

Use one spreadsheet with two tabs.

### Campaign

| Lead ID | Name | Email | Company | Job Title | Industry | Status | Subject Variant | Sent Date | Tracking ID | Notes |
|---------|------|-------|---------|-----------|----------|--------|-----------------|-----------|-------------|-------|

Only rows where `Status` is exactly `To Contact` are sent.

### Sent Log

| Campaign ID | Lead ID | Name | Email | Company | Subject Line | Variant | Tracking ID | Sent At | Status | Opened | Clicked | Bounced | Replied | Follow-up Count |
|-------------|---------|------|-------|---------|--------------|---------|-------------|---------|--------|--------|---------|---------|---------|-----------------|

This single workflow logs send history only. It does not include event tracking or follow-up automation.

## Credentials Needed

| Service | Credential |
|---------|------------|
| Google Sheets | Existing `Google Sheets OAuth2 API` credential was auto-assigned |
| OpenAI | Add/select an `OpenAI` credential |
| SMTP | Add/select an `SMTP` credential |

## Required Configuration

1. Open the n8n workflow.
2. In each Google Sheets node, select the campaign spreadsheet.
3. Confirm the sheet tabs are named exactly `Campaign` and `Sent Log`.
4. Add/select the OpenAI credential in `Generate Icebreaker`.
5. Add/select the SMTP credential in `Send Cold Email`.
6. Replace sender placeholders:
   - `[Your Name] <outreach@yourdomain.com>`
   - `replyTo: outreach@yourdomain.com`
   - `[Your Name]`, `[Your Title]`, `[Your Company]` in the email body.
7. Manually execute once with one test row before activating the schedule.

## Behavior

- Daily send cap: `30` leads.
- Lead selection: rows from `Campaign` where `Status = To Contact`.
- A/B split: random `A` or `B` subject variant per lead.
- Campaign ID format: `CAMP-yyyyMMdd`.
- Tracking ID format: generated `TRK-*` value per lead.
- After sending, the workflow writes to `Sent Log` and updates the matching `Campaign` row by `Lead ID`.

## Local SDK Source

The SDK source for the created workflow is:

`n8n-workflows/cold-email-campaign-engine.workflow.ts`
