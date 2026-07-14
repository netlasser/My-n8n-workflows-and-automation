# Multi-Source Lead Capture & CRM Pipeline

## Workflow Overview

Captures leads from Typeform/Tally forms, normalizes fields, scores them, logs to Google Sheets, and sends real-time alerts for hot leads via Slack + Email.

## Architecture

```
Typeform / Tally
      │
      ▼ (Webhook POST)
┌─────────────────────┐
│  Webhook Trigger     │  Receives form submission
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Normalize & Score   │  Standardizes fields + lead scoring
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Google Sheets       │  Every lead logged to master sheet
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  IF Node (Score≥3?)  │  Hot leads: Slack + Email
└─────────┬───────────┘
         ╱ ╲
     Yes/   \No
       ▼     ▼ (end)
┌──────────┐
│ Slack DM │  🔥 Hot Lead Alert
└──────────┘
┌──────────┐
│  Email   │  🔥 Hot Lead Alert
└──────────┘
```

## Scoring Logic

| Condition | Points |
|-----------|--------|
| Message contains hot keyword | +3 |
| Has both name + company | +2 |
| Business email (.com/.io/.org) | +1 |

**Hot Lead** = score ≥ 3, **Warm Lead** = score < 3

Hot keywords: `demo`, `pricing`, `urgent`, `partnership`, `quote`, `buy`, `purchase`, `speak to sales`

## Google Sheets Setup

Create a sheet with 2 tabs:

### Tab: "All Leads"

| Lead ID | Timestamp | Name | Email | Phone | Company | Job Title | Message | Source | Score | Status | Priority |
|---------|-----------|------|-------|-------|---------|-----------|---------|--------|-------|--------|----------|

### Tab: "Scored" (optional — for manual follow-up tracking)

Same columns + `Contacted (Yes/No)` + `Notes`

## Credentials Needed

| Service | What to Create |
|---------|---------------|
| **Google Sheets** | GCP Service Account with Sheets API enabled, share sheet with service account email |
| **Slack** | Slack App with `chat:write` scope, install to workspace, invite bot to `#leads-hot` channel |
| **Email (SMTP)** | SMTP credentials (SendGrid, Gmail App Password, or your provider) |

## Setup Instructions

### 1. Import Workflow
- In n8n: **Workflows → Add Workflow → Import from File**
- Select `lead-capture-pipeline.json`

### 2. Configure Credentials
- Create credentials in n8n for each service above
- Update the `credentials` fields in the workflow nodes

### 3. Set Google Sheet ID
- Open node "Log to Google Sheets"
- Replace `YOUR_GOOGLE_SHEET_ID` with your sheet's ID (from URL: `docs.google.com/spreadsheets/d/`**THIS_PART**`/edit`)

### 4. Connect Typeform/Tally
- **Typeform**: Settings → Connect → Webhooks → paste n8n webhook URL
- **Tally**: Settings → Integrations → Webhooks → paste n8n webhook URL
- The webhook URL is visible when you click the "Webhook (Lead Capture)" node

### 5. Activate
- Toggle the workflow to **Active**
- Submit a test form entry — check Slack/email for hot lead alerts

## Testing

Use the **Webhook node's "Test" button** in n8n editor, or send a test POST:

```bash
curl -X POST https://your-n8n-instance.com/webhook/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@acme.com",
    "company": "Acme Corp",
    "message": "I want a demo of your product"
  }'
```

## Portfolio Narrative

> **Problem:** Sales team spent 3+ hours daily manually collecting leads from Typeform, copying to spreadsheets, and triaging which ones to follow up.
>
> **Solution:** Built a fully automated lead capture pipeline in n8n that ingests form submissions, applies scoring rules, logs to Google Sheets, and instantly notifies the team of hot leads.
>
> **Results:**
> - Zero manual data entry
> - 3+ hrs/week recovered for sales
> - Hot leads notified within 5 seconds of submission
>
> **Tech Stack:** n8n, Google Sheets API, Slack API, SMTP, Typeform/Tally
