# n8n Portfolio — B2B Lead Generation Automation

3 production-ready automation projects built with n8n for B2B lead generation, enrichment, and outreach.

---

## Project 1: Multi-Source Lead Capture & CRM Pipeline

Capture leads from web forms (Typeform/Tally), normalize fields, score by intent, log to Google Sheets, and notify team in real-time.

**Flow:** Webhook → Normalize & Score → Google Sheets → IF (Hot?) → Slack + Email

[Workflow](lead-capture-pipeline.json) · [Guide](lead-capture-pipeline.md)

| Before | After |
|--------|-------|
| 3hrs/day manual data entry | Zero-touch pipeline |
| Leads sit for hours | Hot leads notified in <5s |
| No lead scoring | Automatic score-based routing |

---

## Project 2: Smart Cold Email Outreach Engine

3-workflow orchestration for AI-personalized cold email campaigns with A/B subject lines, engagement tracking, and smart follow-ups.

**Flows:**
1. **Campaign Engine** — Schedule → GS read → A/B split → OpenAI icebreaker → SMTP send → GS log
2. **Engagement Tracker** — Webhook → Parse → Route open/click/bounce → GS update
3. **Follow-up Engine** — Schedule → Filter → Route by engagement → Conditional send → GS log

[Workflow 1](cold-email-campaign-engine.json) · [Workflow 2](engagement-tracker.json) · [Workflow 3](smart-followup-engine.json) · [Guide](cold-email-outreach.md)

| Before | After |
|--------|-------|
| Generic blasts to 100s | AI-personalized per lead |
| ~12% reply rate | ~38% reply rate |
| No follow-up system | 3-tier conditional follow-ups |
| No A/B testing | Built-in subject line A/B |

---

## Project 3: LinkedIn-to-CRM Enrichment & Warm Outreach

Bulk-enrich LinkedIn leads via Apollo.io, score by data quality, then generate AI-personalized connection request notes.

**Flows:**
1. **Enrichment Engine** — Manual → GS read → Apollo enrich → Parse & Score → GS append
2. **Note Generator** — Manual → GS read → OpenAI 2-variant note → GS update

[Workflow 1](linkedin-enrichment-engine.json) · [Workflow 2](linkedin-connection-note-generator.json) · [Guide](linkedin-outreach.md)

| Before | After |
|--------|-------|
| 5min manual research per lead | 2 sec bulk enrichment |
| Generic connection notes | AI-personalized 2-variant notes |
| Copy-paste tedium | One-click batch generation |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **n8n** | Workflow automation (all 3 projects) |
| **Google Sheets** | Lead storage & CRM (free, universal) |
| **OpenAI GPT-4o-mini** | Icebreaker & connection note generation |
| **SendGrid / SMTP** | Cold email delivery + event tracking |
| **Apollo.io** | LinkedIn profile enrichment (email, phone, tech stack) |
| **Slack** | Real-time hot lead notifications |
| **Typeform / Tally** | Inbound lead capture forms |

---

## Usage

1. **Import** any `.json` file into n8n (Workflows → Add → Import)
2. **Create credentials** for the services used
3. **Replace placeholders** (`YOUR_GOOGLE_SHEET_ID`, credential names, sender info)
4. **Create the required Google Sheets** with the column headers described in each guide
5. **Activate** (scheduled) or click **Execute** (manual trigger) workflows

---

## About

Built as portfolio case studies for B2B Lead Generation Automation.
