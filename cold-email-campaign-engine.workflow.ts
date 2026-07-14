import {
  expr,
  newCredential,
  nextBatch,
  node,
  splitInBatches,
  sticky,
  trigger,
  workflow,
} from '@n8n/workflow-sdk';

const dailyCampaignSend = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Daily Campaign Send (8 AM)',
    position: [240, 300],
    parameters: {
      rule: {
        interval: [
          {
            field: 'cronExpression',
            expression: '0 8 * * 1-5',
          },
        ],
      },
    },
  },
  output: [{}],
});

const readCampaignLeads = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Campaign Leads',
    position: [520, 300],
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets OAuth2 API'),
    },
    parameters: {
      resource: 'sheet',
      operation: 'read',
      authentication: 'oAuth2',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Select Campaign Spreadsheet',
      },
      sheetName: {
        __rl: true,
        mode: 'name',
        value: 'Campaign',
      },
      filtersUI: {
        values: [
          {
            lookupColumn: 'Status',
            lookupValue: 'To Contact',
          },
        ],
      },
      combineFilters: 'AND',
      options: {
        returnAllMatches: 'returnAllMatches',
      },
    },
  },
  output: [
    {
      'Lead ID': 'lead_001',
      Name: 'Jane Doe',
      Email: 'jane@example.com',
      Company: 'Acme',
      'Job Title': 'VP Sales',
      Industry: 'SaaS',
      Status: 'To Contact',
    },
  ],
});

const limitDailySendVolume = node({
  type: 'n8n-nodes-base.limit',
  version: 1,
  config: {
    name: 'Limit Daily Send Volume',
    position: [800, 300],
    parameters: {
      maxItems: 30,
      keep: 'firstItems',
    },
  },
  output: [
    {
      'Lead ID': 'lead_001',
      Name: 'Jane Doe',
      Email: 'jane@example.com',
      Company: 'Acme',
      'Job Title': 'VP Sales',
      Industry: 'SaaS',
      Status: 'To Contact',
    },
  ],
});

const sendLoop = splitInBatches({
  version: 3,
  config: {
    name: 'Loop One Lead at a Time',
    position: [1080, 300],
    parameters: {
      batchSize: 1,
    },
  },
  output: [
    {
      'Lead ID': 'lead_001',
      Name: 'Jane Doe',
      Email: 'jane@example.com',
      Company: 'Acme',
      'Job Title': 'VP Sales',
      Industry: 'SaaS',
      Status: 'To Contact',
    },
  ],
});

const prepareLead = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Lead',
    position: [1360, 300],
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: `const source = $json;
const leadId = source['Lead ID'] || source.leadId || source.id || source.email || source.Email;
const name = source.Name || source.name || '';
const email = source.Email || source.email || '';
const company = source.Company || source.company || '';
const jobTitle = source['Job Title'] || source.jobTitle || '';
const industry = source.Industry || source.industry || '';
const subjectVariant = Math.random() < 0.5 ? 'A' : 'B';
const suffix = Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase();

return {
  json: {
    leadId,
    name,
    email,
    company,
    jobTitle,
    industry,
    subjectVariant,
    campaignId: \`CAMP-\${$now.toFormat('yyyyLLdd')}\`,
    trackingId: \`TRK-\${suffix}\`,
    sourceRow: source,
  },
};`,
    },
  },
  output: [
    {
      leadId: 'lead_001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Acme',
      jobTitle: 'VP Sales',
      industry: 'SaaS',
      subjectVariant: 'A',
      campaignId: 'CAMP-20260714',
      trackingId: 'TRK-TEST123',
    },
  ],
});

const generateIcebreaker = node({
  type: '@n8n/n8n-nodes-langchain.openAi',
  version: 2.3,
  config: {
    name: 'Generate Icebreaker',
    position: [1640, 300],
    credentials: {
      openAiApi: newCredential('OpenAI'),
    },
    parameters: {
      resource: 'text',
      operation: 'response',
      modelId: {
        __rl: true,
        mode: 'id',
        value: 'gpt-4o-mini',
      },
      responses: {
        values: [
          {
            type: 'text',
            role: 'system',
            content:
              'You write concise B2B cold email openers. Return exactly one natural sentence under 18 words. No markdown.',
          },
          {
            type: 'text',
            role: 'user',
            content: expr(
              "{{ 'Write an opener for ' + $json.name + ', ' + ($json.jobTitle || 'a leader') + ' at ' + $json.company + ' in ' + ($json.industry || 'their market') + '.' }}",
            ),
          },
        ],
      },
      simplify: true,
      options: {
        maxTokens: 60,
        temperature: 0.5,
        store: false,
      },
    },
  },
  output: [
    {
      output_text: 'Your work at Acme stood out as a practical example of focused SaaS growth.',
    },
  ],
});

const composeEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Compose Email',
    position: [1920, 300],
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: `const lead = $('Prepare Lead').item.json;
const ai = $json;
const icebreaker = (ai.output_text || ai.outputText || ai.text || ai.response || ai.message?.content || ai.output?.[0]?.content?.[0]?.text || \`I noticed \${lead.company || 'your team'} is doing interesting work.\`).trim().replace(/^['\\"]|['\\"]$/g, '');
const subjectLine = lead.subjectVariant === 'B'
  ? \`Idea for \${lead.company || 'your team'}\`
  : \`Quick question, \${lead.name ? lead.name.split(' ')[0] : 'there'}\`;
const roleLine = lead.jobTitle ? \`As \${lead.jobTitle}, you probably see this firsthand.\` : 'You probably see this firsthand.';
const body = \`\${icebreaker}\\n\\n\${roleLine}\\n\\nI help teams like \${lead.company || 'yours'} improve [specific business outcome] without adding extra manual work.\\n\\nWould it be unreasonable to send over a short idea this week?\\n\\nBest,\\n[Your Name]\\n[Your Title]\\n[Your Company]\\n\\nIf this is not relevant, reply unsubscribe and I will not follow up.\`;

return {
  json: {
    ...lead,
    icebreaker,
    subjectLine,
    emailBody: body,
    sentAt: new Date().toISOString(),
  },
};`,
    },
  },
  output: [
    {
      leadId: 'lead_001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Acme',
      subjectVariant: 'A',
      campaignId: 'CAMP-20260714',
      trackingId: 'TRK-TEST123',
      subjectLine: 'Quick question, Jane',
      emailBody: 'Your work at Acme stood out.\n\nWould it be unreasonable to send over a short idea this week?',
      sentAt: '2026-07-14T08:00:00.000Z',
    },
  ],
});

const sendColdEmail = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Send Cold Email',
    position: [2200, 300],
    credentials: {
      smtp: newCredential('SMTP'),
    },
    parameters: {
      resource: 'email',
      operation: 'send',
      fromEmail: '[Your Name] <outreach@yourdomain.com>',
      toEmail: expr('{{ $json.email }}'),
      subject: expr('{{ $json.subjectLine }}'),
      emailFormat: 'text',
      text: expr('{{ $json.emailBody }}'),
      options: {
        appendAttribution: false,
        replyTo: 'outreach@yourdomain.com',
      },
    },
  },
  output: [
    {
      leadId: 'lead_001',
      email: 'jane@example.com',
      status: 'sent',
    },
  ],
});

const upsertSentLog = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Upsert Sent Log',
    position: [2480, 300],
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets OAuth2 API'),
    },
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      authentication: 'oAuth2',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Select Campaign Spreadsheet',
      },
      sheetName: {
        __rl: true,
        mode: 'name',
        value: 'Sent Log',
      },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Tracking ID'],
        value: {
          'Campaign ID': expr('{{ $("Compose Email").item.json.campaignId }}'),
          'Lead ID': expr('{{ $("Compose Email").item.json.leadId }}'),
          Name: expr('{{ $("Compose Email").item.json.name }}'),
          Email: expr('{{ $("Compose Email").item.json.email }}'),
          Company: expr('{{ $("Compose Email").item.json.company }}'),
          'Subject Line': expr('{{ $("Compose Email").item.json.subjectLine }}'),
          Variant: expr('{{ $("Compose Email").item.json.subjectVariant }}'),
          'Tracking ID': expr('{{ $("Compose Email").item.json.trackingId }}'),
          'Sent At': expr('{{ $("Compose Email").item.json.sentAt }}'),
          Status: 'Sent',
          Opened: 'No',
          Clicked: 'No',
          Bounced: 'No',
          Replied: 'No',
          'Follow-up Count': 0,
        },
        schema: [
          {
            id: 'Tracking ID',
            displayName: 'Tracking ID',
            required: false,
            defaultMatch: true,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
        ],
      },
      options: {
        cellFormat: 'USER_ENTERED',
        handlingExtraData: 'insertInNewColumn',
      },
    },
  },
  output: [
    {
      leadId: 'lead_001',
      trackingId: 'TRK-TEST123',
      status: 'logged',
    },
  ],
});

const markCampaignRowSent = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Mark Campaign Row Sent',
    position: [2760, 300],
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets OAuth2 API'),
    },
    parameters: {
      resource: 'sheet',
      operation: 'update',
      authentication: 'oAuth2',
      documentId: {
        __rl: true,
        mode: 'list',
        value: '',
        cachedResultName: 'Select Campaign Spreadsheet',
      },
      sheetName: {
        __rl: true,
        mode: 'name',
        value: 'Campaign',
      },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['Lead ID'],
        value: {
          'Lead ID': expr('{{ $("Compose Email").item.json.leadId }}'),
          Status: 'Sent',
          'Subject Variant': expr('{{ $("Compose Email").item.json.subjectVariant }}'),
          'Sent Date': expr('{{ $("Compose Email").item.json.sentAt }}'),
          'Tracking ID': expr('{{ $("Compose Email").item.json.trackingId }}'),
        },
        schema: [
          {
            id: 'Lead ID',
            displayName: 'Lead ID',
            required: false,
            defaultMatch: true,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
          },
        ],
      },
      options: {
        cellFormat: 'USER_ENTERED',
        handlingExtraData: 'ignoreIt',
      },
    },
  },
  output: [
    {
      leadId: 'lead_001',
      Status: 'Sent',
    },
  ],
});

const setupNote = sticky(
  '## Setup\nSelect the campaign spreadsheet in each Google Sheets node. Required tabs: Campaign and Sent Log. Add OpenAI and SMTP credentials before activation. Replace sender/signature placeholders in Send Cold Email and Compose Email.',
  [readCampaignLeads, sendColdEmail, upsertSentLog, markCampaignRowSent],
  { color: 4 },
);

export default workflow('cold-email-campaign-engine', 'Cold Email Campaign Engine')
  .add(dailyCampaignSend)
  .to(readCampaignLeads)
  .to(limitDailySendVolume)
  .to(
    sendLoop.onEachBatch(
      prepareLead.to(
        generateIcebreaker.to(
          composeEmail.to(sendColdEmail.to(upsertSentLog.to(markCampaignRowSent.to(nextBatch(sendLoop))))),
        ),
      ),
    ),
  )
  .add(setupNote);
