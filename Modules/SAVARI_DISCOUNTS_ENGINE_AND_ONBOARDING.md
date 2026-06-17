# Savari Monorepo — Discount Engine & Operator Onboarding

> **Purpose:** Technical reference for resume, portfolio, and interview prep.  
> **Platform:** Savari — multi-operator Transport Management System (TMS) SaaS  
> **Stack:** Next.js 16 · React 19 · Convex · Better Auth · Stripe · Zustand · Resend

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Discount Engine — Overview & Complexity](#discount-engine--overview--complexity)
3. [Discount Types & Application Rules](#discount-types--application-rules)
4. [Stripe Integration & Payment Routing](#stripe-integration--payment-routing)
5. [Operator Onboarding — Overview](#operator-onboarding--overview)
6. [Onboarding Flows (4 Paths)](#onboarding-flows-4-paths)
7. [How Discounts & Onboarding Connect](#how-discounts--onboarding-connect)
8. [Data Models](#data-models)
9. [Technology Summary](#technology-summary)
10. [Resume Bullet Points](#resume-bullet-points)
11. [Skills & Keywords (ATS)](#skills--keywords-ats)
12. [Architecture Diagrams](#architecture-diagrams)
13. [File Index](#file-index)

---

## Executive Summary

Savari implements two large, interconnected systems:

| System                           | What it does                                                                                                                                                                     | Complexity level                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Provisioning Discount Engine** | Configures **Savari → operator** SaaS subscription pricing (Dispatch / Operate / FleetOS) with 7 discount types, TMS/WMS workspace scoping, 12-month preview, and Stripe mapping | **High** — rules engine with stacking, conflict detection, and multi-path Stripe integration |
| **Operator Onboarding**          | Gets new operators from signup or sales-led provisioning to paid, active accounts with cloned defaults                                                                           | **High** — 4 resumable flows, 3 Convex tables, auth + Stripe + email + template cloning      |

**Important distinction:** The discount engine applies to **platform subscription billing** (what operators pay Savari). It is **not** a quote/customer discount rules engine. TMS quote adjustments use manual **journey extra charges**; AI voice handles discount **conversations**, not automated quote pricing.

---

## Discount Engine — Overview & Complexity

### What problem it solves

Sales and admin teams need to provision operators with flexible commercial terms before the owner pays:

- Percentage off TMS only, WMS only, or both
- Time-limited promotions (3 months at 50%, then full price)
- Founder pricing (permanent discount)
- Custom per-vehicle list price overrides
- Month-by-month tiered discounts (e.g. 100% month 1, 50% month 2, 25% month 3)
- Free trials (subscription-wide or workspace-scoped)

Stripe Checkout accepts **at most one coupon**, so the engine must route complex configs to **subscription schedules** or **direct subscription APIs** with item-level discounts.

### Module structure

#### Shared (frontend-safe types & validation)

```
packages/shared/src/billing/
├── discount-types.ts              # DiscountConfig union, PricingPreview, plan/workspace types
├── discount-validation.ts         # Bounds, Stripe % rules, validateDiscountConfigs()
├── stripe-discount-labels.ts      # Human-readable discount labels
├── provisioning-payment-flow.ts   # checkout vs direct routing (mirrors backend)
└── __tests__/stripe-discount-labels.test.ts
```

#### Backend discount engine

```
packages/backend/convex/shared/billing/discountEngine/
├── index.ts                       # Public exports
├── preview.ts                     # computePricingPreview(), computeMonthBillingSummary()
├── stripeMapper.ts                # Discount → Stripe coupon specs, checkout routing
├── subscriptionSchedule.ts        # Multi-phase Stripe schedule from timeline
├── workspacePricing.ts            # TMS/WMS split, custom_price handling
├── provisionLineItems.ts          # Workspace line items for checkout
└── __tests__/
    ├── preview.test.ts
    ├── stripeMapper.test.ts
    ├── subscriptionSchedule.test.ts
    └── discountValidation.test.ts
```

#### Related billing & admin files

| Path                                                                    | Role                                                        |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| `packages/backend/convex/shared/billing/provisioningSchema.ts`          | `discountConfigValidator`, `operatorProvisioning.discounts` |
| `packages/backend/convex/shared/billing/provisioningCheckout.ts`        | Stripe checkout / direct subscription / schedule creation   |
| `packages/backend/convex/shared/billing/subscriptions.ts`               | `getSubscriptionPlanSummaryPricing`, discount resolution    |
| `packages/backend/convex/shared/billing/stripeSubscriptionDiscounts.ts` | Live Stripe discount fetch                                  |
| `packages/backend/convex/shared/billing/stripeSync.ts`                  | Webhook sync → `configuredDiscounts`, `appliedCoupons`      |
| `packages/backend/convex/admin/provisioning/mutations.ts`               | CRUD provisioning + `validateDiscountConfigs`               |
| `packages/backend/convex/admin/provisioning/queries.ts`                 | `computePricingPreview` for admin/onboarding                |

#### Frontend (admin & operator billing)

```
apps/web/src/components/admin/provisioning/
├── discount-config-form.tsx       # Admin UI: add/edit all 7 discount types
├── pricing-preview-panel.tsx      # 12-month timeline preview
├── admin-provisioning-review-summary.tsx
├── subscription-review-summary.tsx
└── provisioning-wizard-steps.tsx

apps/web/src/components/billing/
├── plan-summary-discount-engine-pricing.tsx   # Engine-based plan summary
└── plan-summary-stripe-promo-pricing.tsx      # Legacy Stripe promo display

apps/web/src/app/admin/operators/new/page.tsx           # Wizard: discounts step
apps/web/src/app/(auth)/operator-onboarding/[token]/review/page.tsx
apps/web/src/app/(dashboard)/tms/settings/billings/page.tsx
```

### Complexity highlights

| Area                           | Why it is complex                                                               |
| ------------------------------ | ------------------------------------------------------------------------------- |
| **7 discount types**           | Each type has different duration semantics, workspace scope, and Stripe mapping |
| **TMS / WMS workspace split**  | FleetOS plans split pricing across Dispatch (TMS) and Operate (WMS) line items  |
| **Compound stacking**          | Multiple discounts apply sequentially (multiplicative) on running amounts       |
| **Tiered precedence**          | Tiered discounts run before percentage/fixed; conflicts surfaced as warnings    |
| **12-month preview timeline**  | Admin and owner see month-by-month TMS/WMS/total with applied labels            |
| **Stripe single-coupon limit** | Engine chooses Checkout vs direct subscription vs subscription schedule         |
| **Shared validation**          | Same rules enforced in admin UI form and Convex mutations                       |
| **Dual display paths**         | Billing pages show engine-configured discounts or legacy Stripe promos          |
| **Test coverage**              | 4 dedicated test files for preview, mapper, schedule, and validation            |

---

## Discount Types & Application Rules

### Supported discount types

| Type            | Mechanism                                                       | Duration / scope                        |
| --------------- | --------------------------------------------------------------- | --------------------------------------- |
| `percentage`    | % off workspace(s)                                              | `durationMonths`, optional `startMonth` |
| `fixed_monthly` | Fixed £/mo off (split or per-workspace)                         | `durationMonths`, optional `startMonth` |
| `free_trial`    | Pro-rata or subscription-wide £0 via Stripe `trial_period_days` | `durationDays`                          |
| `temporary`     | % off from month 1                                              | `durationMonths`                        |
| `founder`       | % off forever                                                   | No expiry                               |
| `custom_price`  | Override list price per vehicle (pre-discount base)             | Always on                               |
| `tiered`        | Different `%` per calendar month (`phases[]`)                   | Per phase month                         |

### Workspace scoping

Each discount targets one or more of:

- **`tms`** — Dispatch / transport management workspace
- **`wms`** — Operate / fleet operations workspace
- **`all`** — Both workspaces (or subscription-wide for trials)

Plans (v3 list prices per vehicle, GBP):

| Plan     | List price        |
| -------- | ----------------- |
| Dispatch | £24/vehicle/month |
| Operate  | £29/vehicle/month |
| FleetOS  | £39/vehicle/month |

### Application order (`applyDiscountsToWorkspace`)

1. **`custom_price`** adjusts base via `getEffectiveWorkspaceSplit()` before monthly math.
2. **Tiered** discounts apply first for the active month.
3. **Other types** (`percentage`, `temporary`, `founder`, `fixed_monthly`, workspace-scoped `free_trial`) apply **sequentially** — compound/multiplicative stacking on running TMS/WMS amounts.
4. **Subscription-wide `free_trial`** (`workspaces: ['all']`) uses Stripe trial semantics (full months £0).

### Stacking & conflicts

- Multiple discounts **can stack** in preview (e.g. TMS 50% + WMS 100% for different durations).
- **Tiered + percentage on same workspace/month** → **warning** in `preview.conflicts[]` (not a hard block); tiered **wins** in application order.
- Validation enforces Stripe-compatible bounds:
  - Percent: 1–100 (Stripe minimum 1%)
  - Duration months: 1–120; trial days: 1–365
  - Tiered: unique month per phase, months 1–120
  - Vehicle count: 1–10,000

### Key engine functions

| Function                               | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `computePricingPreview()`              | 12-month timeline, savings totals, conflict warnings   |
| `computeMonthBillingSummary()`         | Current billing month breakdown for operator dashboard |
| `getEffectiveWorkspaceSplit()`         | Applies `custom_price` to TMS/WMS per-vehicle amounts  |
| `discountToCouponSpecs()`              | Map single discount → Stripe coupon specifications     |
| `buildSubscriptionSchedulePhases()`    | Collapse timeline into Stripe schedule phases          |
| `discountsRequireDirectSubscription()` | Route multi-discount configs away from Checkout        |
| `validateDiscountConfigs()`            | Shared validation used by UI and backend               |

### Pricing preview output

```typescript
interface PricingPreview {
  vehicleCount: number;
  currency: BillingCurrency; // GBP | EUR | AED
  planSlug: PlanSlug; // dispatch | operate | fleetos
  listPricePerVehicleCents: number;
  monthlyCostCents: number;
  trialSavingsCents: number;
  discountSavingsCents: number;
  firstInvoiceAmountCents: number;
  futureRecurringAmountCents: number;
  timeline: PricingTimelineMonth[]; // 12 months
  conflicts: string[]; // Stacking warnings
}
```

---

## Stripe Integration & Payment Routing

### The Stripe constraint

Stripe Checkout accepts **one coupon**. Savari's engine supports **multiple simultaneous discounts** with different durations and workspace scopes.

### Routing logic (`resolveProvisioningPaymentFlow`)

| Condition                                                                                      | Payment path                                             |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Any `tiered` discount                                                                          | **Direct** — subscription API + hosted invoice (new tab) |
| 2+ duration-coupon types (`percentage`, `temporary`, `fixed_monthly`, `founder`, `free_trial`) | **Direct** — item-level coupons on subscription          |
| Otherwise                                                                                      | **Stripe Checkout** — same-tab redirect                  |

### Stripe mapping strategies

| Strategy                                     | When used                                                    |
| -------------------------------------------- | ------------------------------------------------------------ |
| **Stripe Checkout**                          | Simple configs (0–1 coupon)                                  |
| **Direct subscription + item-level coupons** | Multiple simple duration discounts                           |
| **Subscription schedule**                    | Tiered / month-varying discounts; multi-phase coupon changes |
| **`trial_period_days`**                      | Subscription-wide free trial                                 |

### Post-checkout schedule application

`applyProvisioningDiscountSchedule` attaches multi-phase subscription schedules after Checkout when tiered or complex configs require workspace-specific coupons on TMS vs WMS line items.

### Webhook sync

`stripeSync.ts` persists:

- `configuredDiscounts` on `subscriptions` (copied from provisioning)
- `appliedCoupons` (live Stripe coupon metadata)
- `stripeScheduleId` for phased discounts

### Operator billing display

- **`PlanSummaryDiscountEnginePricing`** — shows engine-computed breakdown when `configuredDiscounts` exist
- **`PlanSummaryStripePromoPricing`** — legacy path for older Stripe promo coupons
- **`useLiveStripeSubscriptionDiscounts`** — reconciles UI with live Stripe subscription state

---

## Operator Onboarding — Overview

Savari supports **four distinct onboarding paths** plus a separate driver-app permission wizard. All web operator flows use resumable Convex state; admin provisioning adds invitation tokens, discount engine pricing, and deferred template cloning until payment completes.

### Module structure

#### Backend

| Path                                                                                   | Role                                                       |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `packages/backend/convex/onboarding/progress.ts`                                       | Self-serve + new-operator progress mutations/queries       |
| `packages/backend/convex/shared/operators/onboarding.ts`                               | `onboardingProgress` table schema                          |
| `packages/backend/convex/shared/billing/provisioningSchema.ts`                         | `operatorProvisioning` + `operatorOwnerInvitations`        |
| `packages/backend/convex/admin/provisioning/mutations.ts`                              | Admin wizard, invitations, owner account setup, completion |
| `packages/backend/convex/admin/provisioning/queries.ts`                                | Token lookup, session resume, payment status               |
| `packages/backend/convex/admin/provisioning/resumeStep.ts`                             | Resume-step resolver for admin-invite flow                 |
| `packages/backend/convex/admin/provisioning/onboardingTimeline.ts`                     | Admin dashboard timeline builder                           |
| `packages/backend/convex/admin/provisioning/actions.ts`                                | Invitation email (Resend)                                  |
| `packages/backend/convex/shared/operators/operatorsFunctions.ts`                       | `createOperator` + seeds defaults                          |
| `packages/backend/convex/shared/seed/cloneOperatorDefaults.ts`                         | Template operator cloning (15+ entity types)               |
| `packages/backend/convex/shared/seed/seedDefaultOperatorData.ts`                       | Orchestrates roles + clone + TMS rollups                   |
| `packages/backend/convex/shared/billing/checkout.ts`                                   | Self-serve Stripe Checkout action                          |
| `packages/backend/convex/shared/billing/provisioningCheckout.ts`                       | Admin-provisioned checkout (discount engine)               |
| `packages/backend/convex/shared/email/templates/operatorOnboardingInvitationEmail.tsx` | Invitation email                                           |

#### Frontend

**Self-serve (`/onboarding/*`):**

```
apps/web/src/app/(auth)/onboarding/
├── signup/page.tsx
├── verify-email/page.tsx
├── create-operator/page.tsx
├── select-product/page.tsx
├── checkout/page.tsx
├── success/page.tsx
└── payment-error/page.tsx
```

**Admin-provisioned owner (`/operator-onboarding/[token]/*`):**

```
apps/web/src/app/(auth)/operator-onboarding/
├── [token]/account/page.tsx
├── [token]/review/page.tsx      # Shows PricingPreviewPanel with configured discounts
├── [token]/checkout/page.tsx
├── [token]/success/page.tsx
├── use-operator-onboarding.ts
└── use-operator-onboarding-resume.ts
```

**Admin provisioning wizard:**

```
apps/web/src/app/admin/operators/new/page.tsx   # 4-step: basic → plan → discounts → review
apps/web/src/components/admin/provisioning/     # Wizard steps, discount form, pricing preview
```

**Additional operator (existing user):**

```
apps/web/src/app/(dashboard)/tms/settings/new-operator/
├── page.tsx
├── select-product/page.tsx
├── checkout/page.tsx
└── success/page.tsx
```

---

## Onboarding Flows (4 Paths)

### A. Self-serve operator onboarding (`type: 'initial'`)

For new users signing up directly.

| Step           | Route                         | Backend action                           |
| -------------- | ----------------------------- | ---------------------------------------- |
| Sign up        | Login / `/onboarding/signup`  | `trackSignup`                            |
| Email verify   | `/onboarding/verify-email`    | Better Auth OTP                          |
| Create company | `/onboarding/create-operator` | `createOperator`, `saveOperatorCreation` |
| Select plan    | `/onboarding/select-product`  | `saveProductSelection`                   |
| Pay            | `/onboarding/checkout`        | `createCheckoutSession` (Stripe)         |
| Done           | `/onboarding/success`         | `completeOnboarding`                     |

**Steps tracked:** `create_operator → select_product → checkout → completed`

**On completion:** Sets TMS/WMS/Compliance context on `operatorMembers`, sends subscription confirmation email, triggers template cloning.

---

### B. Admin-provisioned owner onboarding (`type: 'admin_invite'`)

Sales-led flow: Savari admin configures plan + discounts, owner completes account and payment.

**Admin wizard (`/admin/operators/new`):**

| Step         | Action                                                                     |
| ------------ | -------------------------------------------------------------------------- |
| 1. Basic     | Company name, email, slug, country, timezone → `saveProvisioningBasicStep` |
| 2. Plan      | v3 plan + vehicle count → `initializeProvisioningDraft`                    |
| 3. Discounts | Configure discount engine (all 7 types) → `updateProvisioningConfig`       |
| 4. Review    | Send invitation → `sendOwnerInvitation`                                    |

**Owner flow (`/operator-onboarding/[token]/…`):**

| Step    | Route       | Backend action                                               |
| ------- | ----------- | ------------------------------------------------------------ |
| Account | `/account`  | Better Auth signup/signin + `saveAdminInviteAccountSetup`    |
| Review  | `/review`   | Read-only plan + **PricingPreviewPanel** (12-month timeline) |
| Payment | `/checkout` | `createProvisioningCheckoutSession` (discount-aware routing) |
| Success | `/success`  | Poll payment → `completeAdminProvisioning`                   |

**Provisioning status machine:**

```
draft → pending_invitation → invitation_opened → onboarding_in_progress → completed
```

**Resume logic:** `resolveOperatorOnboardingResumeStep` + `useOperatorOnboardingResume` redirect owners to the furthest completed step after login or mid-flow exit.

**Access gating:** While `operator.provisioningStatus === 'admin_provisioned'`, the operator is in **billing-only mode** — platform features restricted until owner completes payment.

---

### C. Additional operator from billing (`type: 'new_operator'`)

Existing users adding another operator from TMS settings.

**Steps:** `create_operator → select_product → checkout → completed`

Uses parallel mutations: `startNewOperatorFlow`, `saveNewOperatorCreation`, `saveNewOperatorProductSelection`, `completeNewOperatorOnboarding`.

Supports multiple in-progress records via `by_user_type` index.

---

### D. Team member invitation (not operator owner)

Separate from operator provisioning:

- `/onboarding/signup?invitationToken=…` → verify email → `/accept-invitation`
- Uses member invitations (`shared/operators/invitations`), not `operatorOwnerInvitations`
- May auto-complete onboarding if user already has operator membership

---

### Operator bootstrap (template cloning)

Triggered on **`createOperator`** (self-serve) and **`completeAdminProvisioning`** (admin-invite):

1. **`seedSystemRolesForOperator`** — Owner, Admin, User RBAC roles
2. **`cloneOperatorDefaults`** from template slug `seeder-operator` (override: `DEFAULT_OPERATOR_TEMPLATE_SLUG` env)
3. **`backfillJobStats`** — TMS dashboard rollups

**Entities cloned (15+ types):**

| Category    | Entities                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| Fleet / WMS | Tags, inspection forms, service tasks, fluid types, part categories            |
| TMS         | Vehicle classes/types, journey types, luggage types, sources, declined reasons |
| Finance     | Email templates, invoice settings, nominal codes, payment methods              |

Tag ID remapping preserves inspection form audience filters across clone.

---

## How Discounts & Onboarding Connect

The discount engine is **embedded in the admin provisioning wizard** and flows through to owner onboarding:

```
Admin wizard (Step 3: Discounts)
    │
    ├─ DiscountConfigForm → validateDiscountConfigs()
    ├─ PricingPreviewPanel → computePricingPreview() (12-month timeline)
    └─ Saved on operatorProvisioning.discounts[]
            │
            ▼
sendOwnerInvitation → email with token link
            │
            ▼
Owner /operator-onboarding/[token]/review
    │
    ├─ Read-only PricingPreviewPanel (same engine output)
    └─ resolveProvisioningPaymentFlow() → checkout vs direct hint
            │
            ▼
/operator-onboarding/[token]/checkout
    │
    ├─ createProvisioningCheckoutSession (discount-aware Stripe routing)
    ├─ Subscription schedule OR direct subscription OR Checkout
    └─ Webhook → completeAdminProvisioning
            │
            ▼
subscriptions.configuredDiscounts[] synced from provisioning
Operator billing pages use getSubscriptionPlanSummaryPricing
```

---

## Data Models

### `onboardingProgress`

| Field                            | Purpose                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `userId`                         | Better Auth user ID                                                                                  |
| `type`                           | `initial` \| `new_operator` \| `admin_invite`                                                        |
| `currentStep`                    | `select_product`, `create_operator`, `account_setup`, `subscription_review`, `checkout`, `completed` |
| `selectedPlanId`, `vehicleCount` | Plan selection                                                                                       |
| `operatorId`                     | Created/provisioned operator                                                                         |
| `provisioningId`                 | Link to admin provisioning                                                                           |
| `stripeCheckoutSessionId`        | Checkout tracking                                                                                    |
| Milestone timestamps             | `signedUpAt`, `operatorCreatedAt`, `planSelectedAt`, `subscribedAt`, `completedAt`                   |

**Indexes:** `by_user`, `by_step`, `by_operator`, `by_user_type`

### `operatorProvisioning`

| Field                                                                 | Purpose                               |
| --------------------------------------------------------------------- | ------------------------------------- |
| `operatorId`                                                          | Target operator                       |
| `status`                                                              | `draft` → … → `completed`             |
| `planId`, `vehicleCount`, `currency`                                  | Subscription config                   |
| `discounts`                                                           | `DiscountConfig[]` — full typed union |
| `customPricePerVehicle`                                               | Optional override                     |
| `stripeCheckoutSessionId`, `stripeScheduleId`, `stripeSubscriptionId` | Stripe lifecycle                      |

### `operatorOwnerInvitations`

| Field            | Purpose                           |
| ---------------- | --------------------------------- |
| `token`          | URL token for owner onboarding    |
| `email`          | Invited owner email               |
| `status`         | `pending` → `opened` → `accepted` |
| `provisioningId` | Link to provisioning record       |
| Expiry           | 14 days                           |

### `subscriptions` (discount persistence)

| Field                 | Purpose                          |
| --------------------- | -------------------------------- |
| `configuredDiscounts` | Copied from provisioning on sync |
| `provisioningId`      | Link back to admin provisioning  |
| `stripeScheduleId`    | Phased discount schedule         |
| `appliedCoupons`      | Live Stripe coupon metadata      |

### `operators.provisioningStatus`

| Value               | Meaning                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `admin_provisioned` | Created by admin; owner hasn't finished payment — **billing-only mode** |
| `active`            | Onboarding + payment complete                                           |

---

## Technology Summary

| Layer            | Discount Engine                                         | Onboarding                                        |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------- |
| **Shared types** | `packages/shared/src/billing/discount-*`                | —                                                 |
| **Backend**      | Convex discount engine + provisioning checkout          | Convex onboarding + admin provisioning            |
| **Billing**      | Stripe Checkout, schedules, meters, item-level coupons  | Same + self-serve checkout                        |
| **Auth**         | —                                                       | Better Auth (signup, OTP, session resume)         |
| **Email**        | —                                                       | Resend (invitation, subscription confirmation)    |
| **Frontend**     | Admin discount form, pricing preview, billing summaries | Multi-step wizards, resume hooks, Zustand persist |
| **Analytics**    | —                                                       | PostHog funnel events                             |
| **Testing**      | 4 Vitest files (preview, mapper, schedule, validation)  | `resumeStep.test.ts`                              |

---

## Resume Bullet Points

Copy and adapt for your CV. Adjust tense to match your role.

### Discount Engine

- **Designed and implemented a multi-type subscription discount engine** (percentage, fixed, tiered, founder, free trial, custom price) with **TMS/WMS workspace scoping** and a **12-month pricing preview** for admin provisioning and operator onboarding.

- **Mapped complex discount configurations to Stripe** despite Checkout's single-coupon limit: **subscription schedules** for tiered/month-varying discounts, **direct subscriptions with item-level coupons** for stacked multi-discount deals, and **`trial_period_days`** for subscription-wide trials.

- **Built a shared validation layer** (`packages/shared`) enforcing Stripe-compatible bounds (1–100% off, duration limits, unique tiered months) used consistently in **admin UI forms and Convex mutations**.

- **Implemented compound discount stacking rules** with explicit **tiered-over-percentage precedence** and **conflict detection** surfaced in admin pricing previews.

- **Integrated the discount engine with operator billing UX**: live Stripe discount sync, month-aware billing summaries, and dual display paths (configured engine vs legacy Stripe promos).

- **Authored comprehensive unit tests** for pricing preview, Stripe coupon mapping, subscription schedule phase building, and discount validation — covering multi-discount stacking scenarios (e.g. TMS 50% + WMS 100% for different durations).

### Operator Onboarding

- **Designed and implemented multi-path operator onboarding** for a multi-tenant SaaS platform: self-serve signup, admin-provisioned sales-led onboarding, and in-app additional-operator creation — all with **resumable state** in Convex.

- **Built an admin provisioning wizard** with plan selection, vehicle-based pricing, and integration with the **flexible discount engine** — owners see a read-only 12-month pricing timeline before checkout.

- **Implemented token-based owner invitation flow** with 14-day expiry, email tracking (sent/opened/accepted), resume-step logic, and post-login redirect so owners can continue from any step after leaving mid-flow.

- **Modeled onboarding persistence** across three Convex tables (`onboardingProgress`, `operatorProvisioning`, `operatorOwnerInvitations`) with typed flow variants and indexed queries for resume and admin reporting.

- **Automated new-operator bootstrap** by cloning **15+ configuration entities** from a template operator (`seeder-operator`), seeding RBAC roles, and initializing TMS analytics rollups — triggered after operator creation or payment completion.

- **Integrated Better Auth + Stripe + Resend end-to-end**: account creation, email verification bypass for invited owners, discount-aware checkout session creation, webhook-driven activation, and subscription confirmation emails.

- **Enforced platform access gating** so admin-provisioned operators remain in **billing-only mode** until the owner completes payment, using `provisioningStatus` and access-layer checks.

- **Added PostHog funnel analytics** for onboarding milestones and admin dashboard timelines showing provisioning progress from company creation through payment.

### Combined (Discounts + Onboarding)

- **Connected sales-led commercial terms to self-service owner checkout**: admin-configured discount stacks flow from provisioning wizard → invitation review page → Stripe (Checkout, schedule, or direct) → persisted `configuredDiscounts` on the live subscription.

- **Architected a frontend-safe shared billing package** so discount types, validation, payment-flow routing, and label formatting are reused across admin UI, owner onboarding review, and Convex backend without boundary violations.

---

## Skills & Keywords (ATS)

**Languages & frameworks:** TypeScript, React 19, Next.js 16 (App Router), Convex, Zustand

**Billing & pricing:** Subscription discount engine, tiered pricing, compound stacking, pricing preview timelines, metered billing, Stripe Checkout, Stripe Subscription Schedules, item-level coupons, webhook sync

**Onboarding:** Multi-step wizards, resumable flows, token-based invitations, state machines, funnel analytics, template cloning, RBAC seeding

**Integrations:** Stripe, Better Auth, Resend, PostHog

**Patterns:** Multi-tenant SaaS, sales-led provisioning, billing-only access gating, shared validation (frontend + backend), payment flow routing, conflict detection

**Testing:** Vitest, discount engine unit tests, resume-step logic tests

---

## Architecture Diagrams

### Discount engine → Stripe routing

```
Admin DiscountConfigForm
    │
    ├─ validateDiscountConfigs() [shared]
    └─ computePricingPreview() → 12-month timeline + conflicts
            │
            ▼
resolveProvisioningPaymentFlow()
    │
    ├─ tiered discount? ──────────► Direct subscription + hosted invoice
    ├─ 2+ duration coupons? ──────► Direct subscription (item-level coupons)
    └─ otherwise ─────────────────► Stripe Checkout (single coupon)
            │
            ▼
Post-checkout (if needed)
    └─ applyProvisioningDiscountSchedule() → multi-phase Stripe schedule
            │
            ▼
stripeSync webhook → subscriptions.configuredDiscounts[]
```

### Discount application order (single month)

```
List price per vehicle
    │
    ▼
custom_price overrides (TMS/WMS/all)
    │
    ▼
Tiered discounts (per phase month)
    │
    ▼
Sequential: percentage | temporary | founder | fixed_monthly | workspace free_trial
    │
    ▼
Final TMS + WMS amounts → timeline row
```

### Onboarding paths (high level)

```
┌─────────────────────────────────────────────────────────────────┐
│                     SELF-SERVE (initial)                        │
│  Auth → createOperator → select_product → checkout → complete   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN-PROVISIONED (admin_invite)               │
│  Admin wizard (basic→plan→DISCOUNTS→review)                     │
│       → sendOwnerInvitation                                     │
│       → Owner: account → review (pricing preview) → checkout    │
│       → completeAdminProvisioning + cloneOperatorDefaults       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              ADDITIONAL OPERATOR (new_operator)                 │
│  TMS billing → create → select_product → checkout → complete   │
└─────────────────────────────────────────────────────────────────┘

Shared tables: onboardingProgress | operatorProvisioning | operatorOwnerInvitations
```

### Admin-provisioned access gating

```
Admin creates operator (provisioningStatus: admin_provisioned)
    │
    ▼
Owner invited → partial onboarding allowed
    │
    ├─ Platform features: BLOCKED (billing-only mode)
    └─ Billing / onboarding routes: ALLOWED
            │
            ▼
Owner completes payment → completeAdminProvisioning
    │
    ▼
provisioningStatus: active → full platform access
```

---

## File Index

### Discount engine — shared

- `packages/shared/src/billing/discount-types.ts`
- `packages/shared/src/billing/discount-validation.ts`
- `packages/shared/src/billing/provisioning-payment-flow.ts`
- `packages/shared/src/billing/stripe-discount-labels.ts`

### Discount engine — backend

- `packages/backend/convex/shared/billing/discountEngine/` — core engine
- `packages/backend/convex/shared/billing/provisioningCheckout.ts`
- `packages/backend/convex/shared/billing/subscriptions.ts`
- `packages/backend/convex/admin/provisioning/mutations.ts`

### Discount engine — frontend

- `apps/web/src/components/admin/provisioning/discount-config-form.tsx`
- `apps/web/src/components/admin/provisioning/pricing-preview-panel.tsx`
- `apps/web/src/components/billing/plan-summary-discount-engine-pricing.tsx`

### Onboarding — backend

- `packages/backend/convex/onboarding/progress.ts`
- `packages/backend/convex/admin/provisioning/` — admin + invite flow
- `packages/backend/convex/shared/seed/cloneOperatorDefaults.ts`
- `packages/backend/convex/shared/billing/checkout.ts`

### Onboarding — frontend

- `apps/web/src/app/(auth)/onboarding/` — self-serve
- `apps/web/src/app/(auth)/operator-onboarding/` — admin-invite owner flow
- `apps/web/src/app/admin/operators/new/page.tsx` — admin wizard
- `apps/web/src/app/(dashboard)/tms/settings/new-operator/` — additional operator

### Related (not part of discount engine)

- TMS quote **journey extra charges** — manual line items, not discount rules
- AI voice **`discount_follow_up`** mission — human-approved pricing callbacks, not automated discounts

---

_Generated from Savari monorepo codebase analysis. Last updated: June 2026._
