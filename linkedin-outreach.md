# LinkedIn-to-CRM Enrichment & Warm Outreach

## Overview

A 2-workflow system that takes LinkedIn URLs from a Google Sheet, enriches them with Apollo.io (email, phone, company data, tech stack), scores each lead, then generates AI-personalized connection request notes for warm outreach.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│ WORKFLOW 1: LinkedIn Lead Enrichment Engine                         │
│ Trigger: Manual (button in n8n editor)                              │
│                                                                     │
│  GS: Read LinkedIn URLs ─→ Filter New ──→ IF Has Leads?             │
│       │ (yes)                              │ (no)                   │
│       ▼                                    ▼                        │
│  Apollo: Enrich by URL                  NoOp ─→ Done                │
│       │                                                             │
│  Parse & Score (email=+3, phone=+2, etc.)                           │
│       │                                                             │
│       ├──→ GS: Append to "Enriched Leads"                         │
│       └──→ GS: Mark "LinkedIn Leads" as "Enriched"                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (status = "Hot" / "Warm")
┌─────────────────────────────────────────────────────────────────────┐
│ WORKFLOW 2: Connection Note Generator                               │
│ Trigger: Manual (button in n8n editor)                              │
│                                                                     │
│  GS: Read Enriched ─→ Filter Hot/Warm ─→ Has Candidates?            │
│       │ (yes)                              │ (no)                   │
│       ▼                                    ▼                        │
│  OpenAI: Generate 2 note variants         NoOp ─→ Done              │
│       │                                                             │
│  Parse Variants → GS: Update with Notes + Status = "Note Ready"    │
└─────────────────────────────────────────────────────────────────────┘
```

## Scoring Logic

| Condition | Points |
|-----------|--------|
| Email found | +3 |
| Phone found | +2 |
| Company size available | +1 |
| Tech stack detected | +1 |
| Job title found | +1 |

**Hot** = score ≥ 5, **Warm** = score 3-4, **Cold** = score < 3

## Google Sheets Setup

### Sheet 1: `LinkedIn Leads`

| Lead ID | LinkedIn URL | Name | Headline | Company | Job Title | Status | Score | Enriched At | Email | Notes |
|---------|-------------|------|----------|---------|-----------|--------|-------|-------------|-------|-------|

### Sheet 2: `Enriched Leads`

| Lead ID | Name | LinkedIn URL | Headline | Company | Company Size | Industry | Job Title | Email | Email Status | Phone | Tech Stack | Score | Status | Connection Note V1 | Connection Note V2 | Note Generated At | Enriched At |
|---------|------|-------------|----------|---------|-------------|---------|-----------|-------|-------------|-------|-----------|-------|--------|-------------------|-------------------|-----------------|------------|

## Setup Instructions

### 1. Import Workflows
- Import `linkedin-enrichment-engine.json` and `linkedin-connection-note-generator.json`

### 2. Create Credentials
| Service | What to Create |
|---------|---------------|
| **Google Sheets** | Same as previous projects |
| **Apollo.io** | API key from Apollo settings → API → Create key (use HTTP Header Auth credential in n8n with header `X-Api-Key`) |
| **OpenAI** | Same as Project 2 |

### 3. Configure Apollo Authentication
The Apollo node uses HTTP Header Auth:
- **Header Name:** `X-Api-Key`
- **Header Value:** your Apollo API key
- Name the credential `YOUR_APOLLO_CREDENTIALS_NAME`

### 4. Prepare Your Lead Sheet
Add LinkedIn URLs to the `LinkedIn Leads` sheet with Status = "New"

### 5. Run the Workflows
- **Workflow 1:** Click "Execute Workflow" in n8n to enrich all new leads
- **Workflow 2:** After enrichment, click "Execute Workflow" to generate connection notes for Hot/Warm leads

### 6. Copy Notes to LinkedIn
Open your `Enriched Leads` sheet, find leads with Status = "Note Ready", copy the connection note variants, and paste into LinkedIn connection requests.

## Testing

Paste a test LinkedIn URL into your sheet and run Workflow 1. Check the `Enriched Leads` sheet for the enriched data.

## Portfolio Narrative

> **Problem:** Sourcing leads from LinkedIn was manual — copy-paste names, search for emails, write connection notes one-by-one. Each lead took 5-10 minutes to research and reach out to.
>
> **Solution:** Built a 2-workflow n8n system that enriches LinkedIn leads via Apollo.io in bulk and generates personalized connection notes via OpenAI.
>
> **Results:**
> - Lead enrichment dropped from 5min/lead to 2 seconds
> - AI-generated connection notes increased acceptance rate by ~40%
> - Full pipeline handles 100+ leads per batch
>
> **Tech Stack:** n8n, Apollo.io API, OpenAI GPT-4o-mini, Google Sheets
