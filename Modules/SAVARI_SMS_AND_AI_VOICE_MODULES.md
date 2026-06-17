# Savari Monorepo — SMS & AI Voice Modules

> **Purpose:** Technical reference for resume, portfolio, and interview prep.  
> **Platform:** Savari — multi-operator Transport Management System (TMS) SaaS  
> **Stack:** Next.js 16 · React 19 · Convex · Better Auth · Stripe · Twilio · Vapi.ai

---

## Table of Contents

1. [Platform Context](#platform-context)
2. [SMS Configuration & SMS Modules](#sms-configuration--sms-modules)
3. [AI Voice Agent Modules](#ai-voice-agent-modules)
4. [Technology Summary](#technology-summary)
5. [Resume Bullet Points](#resume-bullet-points)
6. [Skills & Keywords (ATS)](#skills--keywords-ats)
7. [Architecture Diagrams](#architecture-diagrams)

---

## Platform Context

Savari is a **multi-tenant, multi-operator** platform for coach and transport operators. Every backend query and mutation is **operator-scoped** — data isolation is enforced via protected Convex wrappers, indexed lookups by `operatorId`, and membership checks.

Both SMS and AI Voice are **billable add-on integrations** with:

- Per-operator configuration and usage tracking
- Stripe subscription + metered billing for overages
- Operator-facing settings UI in the web dashboard
- Admin provisioning flows where required

---

## SMS Configuration & SMS Modules

### Overview

The SMS module enables transport operators to send **outbound SMS** to passengers and customers via **Twilio**, with usage-based billing, template management, automation workflows, and audit logging.

**Primary use cases:**

- Live tracking link SMS from job allocations
- Automation-driven SMS (event-triggered workflows)
- Operator test messages during configuration
- Unified email/SMS template management with shortcodes

### Module Structure

#### Backend (Convex)

```
packages/backend/convex/shared/features/integrations/sms/
├── schema.ts       # smsIntegrations, smsUsage tables
├── index.ts        # Module exports
├── client.ts       # @convex-dev/twilio lazy client
├── queries.ts      # getStatus, getSmsUsage
├── mutations.ts    # saveSettings, toggle, usage tracking, Stripe lifecycle
├── actions.ts      # sendSms, sendTestSms, enable/disable integration
└── internal.ts     # Internal queries for integration/operator lookup
```

**Related backend files:**

| Path                                                                  | Role                                              |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `packages/backend/convex/convex.config.ts`                            | Registers `@convex-dev/twilio` Convex component   |
| `packages/backend/convex/http.ts`                                     | Twilio webhook routes (delivery status + inbound) |
| `packages/backend/convex/shared/billing/stripeClient.ts`              | `reportSmsMeterEvent()` for metered billing       |
| `packages/backend/convex/shared/billing/stripeSync.ts`                | SMS-only subscription webhook handling            |
| `packages/backend/convex/shared/auditLogs/smsAuditSchedule.ts`        | Schedules SMS audit rows to Tinybird              |
| `packages/backend/convex/tms/features/allocations/actions.ts`         | `sendTrackingLinkSms`                             |
| `packages/backend/convex/tms/features/allocations/smsContext.ts`      | Job/movement context for tracking SMS             |
| `packages/backend/convex/tms/features/settings/emailTemplates/`       | Unified email/SMS template model                  |
| `packages/backend/convex/tms/features/settings/automations/engine.ts` | Automation `action_sms` → `sendSms`               |
| `packages/backend/convex/tms/outboundEmails/utils.ts`                 | `htmlToPlainTextForSms`, shortcode replacement    |

#### Frontend (Web App)

```
apps/web/src/
├── app/(dashboard)/tms/settings/
│   ├── billings/page.tsx                    # Primary SMS Configuration UI
│   └── email-sms-templates/page.tsx         # Template management (email/sms/both)
├── components/features/
│   ├── integrations/sms-connection-card.tsx # Standalone SMS card component
│   ├── settings/email-templates/SmsEditor.tsx
│   ├── settings/automation/                 # Flow builder with Send SMS steps
│   └── jobs/allocations/
│       ├── send-tracking-sms-dialog.tsx
│       └── tracking-session-sheet.tsx
└── components/features/jobs/details/logs-drawer/
    └── sms-logs-tab.tsx                     # Job-level SMS history (Tinybird)
```

#### Shared Package

```
packages/shared/src/lib/
├── automation-sms-custom-recipient.ts       # E.164 phone validation for automations
└── automation-run-display-outcome-pure.ts   # action_sms step display handling
```

### Data Model

#### `smsIntegrations` (per operator)

| Field                      | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `operatorId`               | Multi-tenant isolation key                                    |
| `enabled`                  | Integration on/off                                            |
| `displayName`              | Operator name → derived alphanumeric sender ID (max 11 chars) |
| `stripeSubscriptionItemId` | Stripe metered subscription item                              |
| `stripePriceId`            | SMS price ID                                                  |
| `lastSentAt` / `lastError` | Operational visibility                                        |

#### `smsUsage` (per operator, per billing period)

| Field                      | Description                      |
| -------------------------- | -------------------------------- |
| `messageCount`             | Total messages sent in period    |
| `freeMessagesUsed`         | Count against 100 free allowance |
| `billableMessages`         | Messages beyond free tier        |
| `billableMessagesReported` | Reported to Stripe meter         |

### SMS Configuration Features

| Feature                      | Details                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| **Enable / disable**         | Per-operator toggle with Stripe Checkout when payment setup required                      |
| **Display name → sender ID** | Alphanumeric sender ID derived from operator name (e.g. "Savari Coaches" → "SavariCoach") |
| **Usage dashboard**          | Sent count, free remaining, billable count, estimated cost, billing period                |
| **Test SMS**                 | Authenticated test send — excluded from usage counters                                    |
| **Configuration UI**         | Billing settings → Feature usage → SMS → Configure dialog                                 |

### Billing Model (SMS)

| Item         | Value                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| Free tier    | **100 SMS/month** per billing period                                                 |
| Overage rate | **£0.05 (5p)** per message beyond free tier                                          |
| Stripe meter | `sms_messages`                                                                       |
| Enable flow  | Attach to existing TMS subscription, reuse SMS-only subscription, or Stripe Checkout |

### Sending Pipeline

All production sends flow through **`internal.shared.features.integrations.sms.actions.sendSms`**:

1. Validate integration enabled + sender ID configured
2. Send via Twilio (`@convex-dev/twilio` component)
3. Increment usage counters in `smsUsage`
4. Report billable overage to Stripe meter
5. Optionally schedule job audit log to Tinybird

| Use Case                   | Entry Point                                               |
| -------------------------- | --------------------------------------------------------- |
| Test SMS                   | Billing dialog / `SmsConnectionCard` → `sendTestSms`      |
| Tracking link to passenger | Allocations UI → `sendTrackingLinkSms` → `sendSms`        |
| Automation flows           | Scheduled/triggered automations → `engine.ts` → `sendSms` |

### SMS Templates

Unified with email templates in the `emailTemplates` table:

- **`templateType`:** `email` \| `sms` \| `both`
- **`smsBody`:** HTML-sanitized body, converted to plain text for Twilio
- **Shortcodes:** `{job_id}`, `{live_tracking_link}`, customer name, invoice URL, driver details, etc.
- **UI:** Settings → Email & SMS Templates (`/tms/settings/email-sms-templates`)

### Automations Integration

- Flow builder supports **Send SMS** steps (`AutomationActionType: 'email' | 'sms'`)
- Recipients: role-based (customer phone) or custom phone (E.164 validated via shared lib)
- Template-linked SMS with shortcode rendering
- Run steps recorded as `action_sms` with success/failure telemetry

### Audit & Logging

- Successful/failed sends schedule Tinybird audit events (`smsAuditSchedule.ts`)
- Job details → Logs drawer → **SMS Logs** tab queries Tinybird (`entityType: 'sms'`)
- Sources labeled (e.g. `tracking_link`, automation)

### Twilio Webhooks

Registered in `http.ts` when `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` are set:

- Delivery status updates
- Inbound messages (via `@convex-dev/twilio` component)

### Key Backend Functions

| Function               | Type            | Description                                                   |
| ---------------------- | --------------- | ------------------------------------------------------------- |
| `getStatus`            | Query           | Returns enabled, displayName, senderId, lastSentAt, lastError |
| `getSmsUsage`          | Query           | Billing-period usage, free tier, estimated cost               |
| `saveSettings`         | Mutation        | Save display name + enabled flag                              |
| `toggle`               | Mutation        | Quick enable/disable                                          |
| `incrementSmsUsage`    | Mutation        | Post-send usage accounting                                    |
| `sendSms`              | Internal Action | Core send + billing + audit                                   |
| `sendTestSms`          | Action          | Authenticated test send (no usage charge)                     |
| `enableSmsIntegration` | Action          | Stripe subscription item or Checkout setup                    |
| `sendTrackingLinkSms`  | Action          | User-triggered tracking link with templates/shortcodes        |

### Environment Variables

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
STRIPE_SMS_PRICE_ID          # optional override for SMS metered price
```

---

## AI Voice Agent Modules

### Overview

The AI Voice module is a **multi-tenant TMS add-on** for **outbound AI phone follow-ups on transport quotes**. It uses **Vapi.ai** for voice orchestration, speech (STT/TTS), and telephony — Savari does not implement custom speech pipelines.

**Primary use cases:**

- Launch AI follow-up calls from quote detail pages
- Triage call outcomes in an AI Calls work queue
- Configure Sales Agent templates, missions, and policies
- Metered billing with free trial

> **Note:** Twilio env vars in the backend are for **SMS**, not AI Voice. Telephony for voice is handled by Vapi.

### Module Structure

#### Backend (Convex)

```
packages/backend/convex/tms/features/voiceAgents/
├── schema.ts              # 5 tables + validators/types
├── constants.ts           # Pricing, templates, status defs, mission defs, shortcodes
├── statusDefinitions.ts   # Outcome/tag normalization & conversation inference
├── utils.ts               # Phone formatting, voice-friendly money/dates
├── mutations.ts           # Launch calls, resolve, human status, save templates
├── queries.ts             # Work queue, billing, settings, per-job call lists
├── actions.ts             # Vapi API, Stripe billing, recordings/transcripts
├── internal.ts            # Webhook updates, usage metering, integration lifecycle
├── webhook.ts             # HTTP webhook handler + parsing helpers
└── __tests__/voiceAgents.test.ts   # ~57 Vitest test cases
```

**Related files:**

| Path                                                     | Role                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| `packages/backend/convex/http.ts`                        | `POST /vapi/webhook` route                                      |
| `packages/backend/convex/shared/billing/stripeClient.ts` | `reportVoiceAgentMeterEvent`                                    |
| `packages/backend/convex/shared/billing/stripeSync.ts`   | `ai_voice` subscription webhook handling                        |
| `packages/backend/convex/admin/mutations.ts`             | `activateVoiceAgentIntegration`, `disableVoiceAgentIntegration` |
| `packages/backend/convex/shared/email/templates/`        | Activation/request email templates                              |
| `docs/VAPI_QUOTE_FOLLOW_UP.md`                           | Setup, env vars, assistant prompts, structured output schema    |

#### Frontend (Web App)

```
apps/web/src/
├── app/(dashboard)/tms/
│   ├── ai-calls/page.tsx                         # AI Calls work queue
│   ├── settings/ai-voice-agent/page.tsx          # Agent config & templates
│   ├── settings/billings/page.tsx                # Trial/subscribe/cancel
│   └── jobs/quotes/[referenceNumber]/page.tsx    # Launch button on quotes
├── app/admin/operators/[slug]/page.tsx           # Admin provisioning UI
└── components/features/
    ├── ai-calls/resolve-voice-agent-call-dialog.tsx
    └── jobs/details/
        ├── quote-voice-agent-button.tsx
        └── logs-drawer/core-logs-tab.tsx         # Recordings, transcripts, call logs
```

### Data Model

| Table                         | Purpose                                                                            |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `voiceAgentCalls`             | Per-call record: status, Vapi ID, outcome/tags, transcript summary, billing fields |
| `voiceAgentIntegrations`      | Operator subscription state, phone/Vapi IDs, Stripe item IDs, trial metadata       |
| `voiceAgentUsage`             | Per billing period: seconds used, trial usage, billable minutes, Stripe reporting  |
| `voiceAgentTemplates`         | Operator-editable intro/mission templates and policies                             |
| `voiceAgentStatusDefinitions` | Customizable outcome/action tag definitions per operator                           |

### Call Lifecycle

```
pending → scheduled → queued → ringing → in-progress → ended | failed
```

- Webhook-driven status updates from Vapi
- End-of-call structured output for AI triage
- On-demand recording + transcript fetch from Vapi API (not stored heavily in Convex)

### Mission Types

| Mission              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `initial_follow_up`  | First follow-up on a quote                      |
| `discount_follow_up` | Follow-up offering a discount                   |
| `changes_follow_up`  | Follow-up after quote changes (schema reserved) |
| `ready_to_book`      | Customer ready to confirm (schema reserved)     |
| `custom`             | Operator-defined guidance                       |

> **v1:** Only `initial_follow_up`, `discount_follow_up`, and `custom` are callable from the UI.

### Assistant Types (Roadmap)

| Type              | Status                                          |
| ----------------- | ----------------------------------------------- |
| `sales_follow_up` | **Live** — Sales Agent for quote follow-ups     |
| `rules`           | Reserved — env var configured, not callable yet |
| `finance`         | Reserved                                        |
| `operations`      | Reserved                                        |

### Quote Context Engine

At call launch, Savari transforms job/journey/customer/pricing data into **speech-friendly variables**:

- Journey summaries (pickup, drop-off, dates)
- Passenger count, vehicle type, luggage
- Pricing formatted for natural speech
- Operator branding
- Mission-specific instructions and safety rules

Injected into Vapi via `assistantOverrides.variableValues` + `assistantOverrides.firstMessage`.

### Sales Agent Templates

Operators configure via Settings → AI Voice Agent:

- Intro messages with shortcodes
- Mission templates (initial, discount, custom)
- Policies: discount limits, change handling, escalation rules, voicemail behavior
- Safety rules preventing AI from confirming bookings or changing prices without team approval

### AI Calls Work Queue

Route: `/tms/ai-calls`

| Feature                | Details                                                     |
| ---------------------- | ----------------------------------------------------------- |
| Open vs resolved items | Triage workflow with resolution notes                       |
| Date filters           | Filter by call date range                                   |
| Stats badge            | Nav badge showing open item count                           |
| Call detail modal      | Recording playback, transcript, outcome tags                |
| 40+ outcome tags       | Customer outcome + human action tags                        |
| Conversation inference | Regex-based fallback when structured Vapi output is missing |

### Billing Model (AI Voice)

| Item             | Value                                       |
| ---------------- | ------------------------------------------- |
| Monthly base     | **£19/month**                               |
| Included minutes | **100 minutes** per billing period          |
| Overage rate     | **£0.15** per additional started minute     |
| Free trial       | **50 minutes** on shared trial phone number |
| Stripe meter     | `ai_voice_minutes`                          |

### Admin Provisioning

Savari admin portal provisions per operator:

- Public phone number assignment
- Vapi phone number ID (`vapiPhoneNumberId`)
- Integration activation (trial or paid)
- Activation notification emails via Resend

### Key Backend Functions

| Function                      | Type              | Description                                                               |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------- |
| `launchQuoteFollowUpCall`     | Mutation          | Validates quote, builds context, creates call row, schedules Vapi call    |
| `createVapiCall`              | Internal Action   | `POST https://api.vapi.ai/call` with assistant overrides                  |
| `handleVapiWebhook`           | HTTP Action       | Secret verification, status/end-of-call events, structured output parsing |
| `updateFromVapiWebhook`       | Internal Mutation | Persists outcomes, triggers usage reporting                               |
| `getVoiceAgentCallRecording`  | Action            | On-demand recording fetch from Vapi                                       |
| `getVoiceAgentCallTranscript` | Action            | On-demand transcript fetch from Vapi                                      |
| `listAiCallWorkItems`         | Query             | Paginated work queue                                                      |
| `resolveVoiceAgentCall`       | Mutation          | Mark work item resolved with note                                         |
| `saveVoiceAgentTemplate`      | Mutation          | Persist Sales Agent configuration                                         |
| `recordEndedCallUsage`        | Internal          | Usage metering + Stripe meter reporting                                   |

### Environment Variables

```
VAPI_API_KEY
VAPI_WEBHOOK_SECRET
VAPI_SALES_FOLLOW_UP_ASSISTANT_ID
VAPI_RULES_ASSISTANT_ID          # reserved
VAPI_FINANCE_ASSISTANT_ID        # reserved
VAPI_OPERATIONS_ASSISTANT_ID     # reserved
STRIPE_AI_VOICE_MONTHLY_PRICE_ID
STRIPE_AI_VOICE_USAGE_PRICE_ID
```

### Test Coverage

~**57 Vitest tests** in `voiceAgents.test.ts` covering:

- Webhook parsing and secret verification
- Usage metering and billing math
- Call launch guards and validation
- Status normalization and alias mapping
- Transcript extraction helpers
- Billing access control

---

## Technology Summary

| Layer              | SMS Module                                         | AI Voice Module                                     |
| ------------------ | -------------------------------------------------- | --------------------------------------------------- |
| **Backend**        | Convex (queries, mutations, actions, HTTP)         | Convex (queries, mutations, actions, HTTP)          |
| **External API**   | Twilio via `@convex-dev/twilio`                    | Vapi.ai REST API + webhooks                         |
| **Billing**        | Stripe meter `sms_messages`                        | Stripe meter `ai_voice_minutes` + £19/mo base       |
| **Auth / tenancy** | Better Auth + operator-scoped protected wrappers   | Better Auth + operator-scoped protected wrappers    |
| **Frontend**       | Next.js 16, React 19, TanStack Query, Convex hooks | Next.js 16, React 19, TanStack Query, Convex hooks  |
| **Analytics**      | Tinybird audit logs                                | Convex-native work queue + on-demand Vapi artifacts |
| **Email**          | —                                                  | Resend (activation/request notifications)           |
| **Validation**     | `libphonenumber-js`, E.164                         | Phone formatting utils, quote validation            |
| **Templates**      | Unified email/SMS with shortcodes                  | Mission templates with shortcodes + policies        |

---

## Resume Bullet Points

Copy and adapt these for your CV. Adjust tense (built / designed / implemented) to match your role.

### SMS Module

- Built a **multi-tenant SMS platform** for a transport management SaaS, with per-operator Twilio configuration, alphanumeric sender IDs, and strict operator-scoped Convex data access.

- Integrated **Twilio SMS** using the official `@convex-dev/twilio` Convex component, including lazy credential loading, webhook registration for delivery/inbound events, and user-friendly Twilio error mapping.

- Implemented **usage-based SMS billing** with Stripe metered pricing: 100 free messages/month, automatic overage tracking in Convex, and real-time reporting to Stripe's `sms_messages` billing meter.

- Designed **enable/disable flows** that attach SMS to existing TMS subscriptions, reuse SMS-only subscriptions, or launch Stripe Checkout for invoice customers, with webhook-driven provisioning.

- Unified **Email & SMS templates** in a single operator-scoped template system supporting `email`, `sms`, and `both` types, HTML sanitization, shortcodes, and plain-text conversion for Twilio.

- Shipped operational SMS features: manual **tracking-link SMS** from allocations (template picker, E.164 validation, shortcode rendering) and **automation workflow SMS actions** with custom recipient validation and run-step telemetry.

- Added **SMS audit logging** to Tinybird with job-linked timeline UI (sent/failed status, recipient, message body, source) in the job logs drawer.

- Delivered operator-facing **SMS configuration UX** on the billing/settings surface: usage dashboards, sender ID preview, test SMS, and enable/disable controls with Stripe redirect when payment setup is required.

### AI Voice Module

- Built a **multi-tenant AI Voice Agent add-on** for a transport management SaaS, enabling operators to launch outbound AI phone follow-ups directly from quote records with operator-scoped data isolation on Convex.

- Integrated **Vapi.ai** for outbound voice: call orchestration, webhook-driven lifecycle (status updates, end-of-call analysis), on-demand recording/transcript retrieval, and per-operator phone number provisioning.

- Designed a **quote-aware voice context engine** that transforms job/journey/customer/pricing data into speech-friendly variables (currency formatting, journey summaries, mission-specific instructions) injected into Vapi assistant overrides at call time.

- Implemented **configurable Sales Agent templates** with mission types (initial follow-up, discount follow-up, custom), shortcode-based intro messages, and safety rules preventing the AI from confirming bookings or changing prices without team approval.

- Built an **AI Calls work queue** with open/resolved triage, 40+ structured outcome tags, human-action tagging, conversation inference fallback, and resolution workflow integrated into quote call logs.

- Shipped **Stripe metered billing** for the add-on (£19/mo + 100 included minutes + usage-based overage via `ai_voice_minutes` billing meter), including free trial (50 min), subscription lifecycle, and admin provisioning flows.

- Delivered operator settings, billing UI, admin provisioning portal, and quote-launch UX in **Next.js 16**, with real-time Convex subscriptions, paginated work queues, and in-app audio playback of call recordings.

- Authored comprehensive **Vapi setup documentation** covering assistant prompts, structured output schemas for call triage, webhook security, and environment configuration for production multi-operator deployment.

- Wrote **~57 Vitest tests** covering webhook parsing, usage metering, call launch guards, status normalization, transcript extraction, and billing access control.

### Cross-Cutting (Both Modules)

- Architected **billable SaaS add-ons** on a multi-operator Convex backend with Stripe subscription management, metered usage reporting, free tiers, and operator self-service enable/disable flows.

- Enforced **multi-tenant data isolation** across all integration APIs using protected operator wrappers, indexed queries, and membership verification — aligned with production multi-operator security guidelines.

- Connected integrations to core TMS domains: **jobs, quotes, allocations, automations, and audit logging** for end-to-end operational workflows.

---

## Skills & Keywords (ATS)

Use these in skills sections, LinkedIn, or job applications:

**Languages & frameworks:** TypeScript, React 19, Next.js 16 (App Router), Convex, Node.js

**Integrations:** Twilio SMS, Vapi.ai, Stripe Billing & Meters, Better Auth, Resend, Tinybird

**Patterns:** Multi-tenant SaaS, operator-scoped data isolation, webhook-driven event processing, usage-based billing, metered pricing, E.164 phone validation, template/shortcode engines, automation workflows, audit logging

**Domains:** Transport Management System (TMS), coach/transport operations, quote follow-up, passenger tracking SMS, AI voice agents, work queue triage

**Testing:** Vitest, Convex function unit tests, webhook parsing tests

**Tools:** Turborepo, Bun, Stripe Dashboard, Twilio Console, Vapi Dashboard, Convex Dashboard

---

## Architecture Diagrams

### SMS Send Flow

```
Operator UI (Web)
    │
    ├─ Billing → Configure SMS (enable, sender ID, test)
    ├─ Allocations → Send Tracking Link SMS
    └─ Automations → Send SMS step
            │
            ▼
    Convex Mutations / Actions
            │
            ├─ Validate operator + integration enabled
            ├─ Render template + shortcodes → plain text
            └─ internal.sendSms
                    │
                    ├─► Twilio (@convex-dev/twilio) → outbound SMS
                    ├─► smsUsage increment + Stripe meter (if billable)
                    └─► Tinybird audit log (job-linked)
                            │
                            ▼
                    Twilio webhooks → delivery status / inbound
```

### AI Voice Call Flow

```
Operator UI (Quote Detail)
    │
    └─ QuoteVoiceAgentButton → launchQuoteFollowUpCall
            │
            ▼
    Convex Mutation
            │
            ├─ Build speech-friendly quote context
            ├─ Render mission template + firstMessage
            ├─ Insert voiceAgentCalls row (pending)
            └─ Schedule createVapiCall (internal action)
                    │
                    ▼
            Vapi API (POST /call)
                    │
                    ├─ Outbound call to customer
                    └─ Webhooks → POST /vapi/webhook
                            │
                            ├─ Status updates (ringing, in-progress, ended)
                            ├─ Structured output (outcome tags, summary)
                            └─ recordEndedCallUsage → Stripe meter
                                    │
                                    ▼
            AI Calls Work Queue (/tms/ai-calls)
                    │
                    └─ On-demand: recording + transcript from Vapi API
```

### Multi-Operator Isolation (Both Modules)

```
Authenticated User
    │
    ▼
Better Auth Session
    │
    ▼
protectedOperatorQuery / protectedTMSMutation
    │
    ├─ Verify operator membership
    ├─ Inject ctx.operatorId
    └─ All DB queries use .withIndex('by_operator', ...)
            │
            ▼
    Operator-scoped data only (smsIntegrations, voiceAgentCalls, etc.)
```

---

## File Index (Quick Reference)

### SMS — Backend

- `packages/backend/convex/shared/features/integrations/sms/` — core SMS module
- `packages/backend/convex/tms/features/allocations/actions.ts` — tracking link SMS
- `packages/backend/convex/tms/features/settings/automations/engine.ts` — automation SMS
- `packages/backend/convex/tms/features/settings/emailTemplates/` — unified templates

### SMS — Frontend

- `apps/web/src/app/(dashboard)/tms/settings/billings/page.tsx` — SMS configuration
- `apps/web/src/app/(dashboard)/tms/settings/email-sms-templates/page.tsx` — templates
- `apps/web/src/components/features/jobs/allocations/send-tracking-sms-dialog.tsx`

### AI Voice — Backend

- `packages/backend/convex/tms/features/voiceAgents/` — core voice agent module
- `packages/backend/convex/http.ts` — `/vapi/webhook` route
- `docs/VAPI_QUOTE_FOLLOW_UP.md` — setup documentation

### AI Voice — Frontend

- `apps/web/src/app/(dashboard)/tms/ai-calls/page.tsx` — work queue
- `apps/web/src/app/(dashboard)/tms/settings/ai-voice-agent/page.tsx` — agent config
- `apps/web/src/components/features/jobs/details/quote-voice-agent-button.tsx`

---

_Generated from Savari monorepo codebase analysis. Last updated: June 2026._
