# Savari TMS - Completed Modules & Technologies

**Project:** Savari Transport Management System (Multi-Application Monorepo)  
**Role:** Full-Stack Developer  
**Duration:** [Your Duration]

---

## 🏗️ **Architecture Overview**

Developed a comprehensive **multi-tenant Transport Management System** using modern web technologies in a **Turborepo monorepo architecture** consisting of 7 specialized applications:

- **TMS (Transport Management System)** - Core business operations platform
- **WMS (Workshop Management System)** - Fleet maintenance and inspections
- **Driver Mobile App** - React Native driver interface
- **Customer Portal** - Public-facing customer interface
- **Admin Dashboard** - Super admin operations
- **Auth Service** - Centralized authentication system
- **API Gateway** - Unified API layer

---

## 🚀 **Core Technology Stack**

### **Frontend Technologies**
- **Next.js 15.5.6** with App Router and React 19
- **TypeScript 5.8.2** with strict mode configuration
- **Tailwind CSS 4.0** + Shadcn/ui + Radix UI primitives
- **TanStack Query 5.81** for server state management
- **React Hook Form 7.57** + Zod 4.1.8 validation
- **Lexical 0.35.0** rich text editor
- **Liveblocks 3.3** for real-time collaboration
- **Mapbox API** for maps and routing

### **Backend Technologies**
- **Bun** runtime and package manager
- **PostgreSQL** + **Drizzle ORM 0.44**
- **Better Auth 1.2.9** with OAuth support
- **Next.js API Routes** + Server Actions
- **Resend 4.6** for email delivery
- **UploadThing 7.7** for file storage

### **Infrastructure & DevOps**
- **Vercel** hosting with edge network
- **Neon** serverless PostgreSQL
- **GitHub Actions** for CI/CD and automated migrations
- **PostHog** for analytics and feature flags
- **Stripe** + **Wonderful** payment processing
- **Intercom** customer support integration

---

## 📦 **Completed Modules & Features**

### **1. Job Management System** ⭐
**Technologies:** Next.js Server Actions, Drizzle ORM, Zod Validation, PostHog Analytics

**Features Implemented:**
- ✅ Multi-step quote creation with journey planning
- ✅ Quote-to-booking conversion workflow
- ✅ Template-based job creation for recurring routes
- ✅ Journey calculation with buffer times and route optimization
- ✅ Real-time job status tracking and notifications
- ✅ Multi-stop route planning with Mapbox integration
- ✅ Job duplication and cloning functionality
- ✅ Public job acceptance/decline by customers
- ✅ Work ticket generation and email delivery

**Key Components:**
- Quote creation stepper with 5-step wizard
- Journey details calculator with distance/time computation
- Movement management with driver/vehicle assignment
- Status management (Quote → Confirmed → Dispatched → Completed)

---

### **2. Customer & Business Management** 👥
**Technologies:** React Hook Form, Zod, Drizzle Relations, TanStack Query

**Features Implemented:**
- ✅ Customer profile management with CRUD operations
- ✅ Business accounts with multi-location support
- ✅ Customer import/export (CSV/XLSX) with validation
- ✅ Customer communication history tracking
- ✅ Email template system for customer notifications
- ✅ Customer combobox with search and create functionality
- ✅ Business customer grouping for bulk invoicing

**Key Components:**
- Customer form with validation
- Business customers modal
- Global customer combobox
- Data import wizard with error handling

---

### **3. Fleet & Driver Management** 🚗
**Technologies:** PostgreSQL RLS, Better Auth, Expo Notifications, OneSignal

**Features Implemented:**
- ✅ Vehicle management with classes and types
- ✅ Driver profiles with PIN authentication
- ✅ Driver mobile app with job acceptance/rejection
- ✅ Real-time driver notifications (Push + SMS)
- ✅ Driver availability tracking
- ✅ Vehicle assignment and allocation
- ✅ Driver PIN reset workflow with OTP
- ✅ Driver job history and performance tracking

**Key Components:**
- Driver authentication system
- Mobile job card with swipeable actions
- Vehicle combobox with filtering
- Driver assignment modal

---

### **4. Financial Management** 💰
**Technologies:** Stripe Connect, Wonderful Payments, Puppeteer PDF, PostgreSQL Transactions

**Features Implemented:**
- ✅ Automated invoice generation from bookings
- ✅ Bulk invoice creation with grouping strategies
- ✅ Payment processing with Stripe and Wonderful
- ✅ Credit note generation and refunds
- ✅ Payment status tracking and reconciliation
- ✅ Multi-currency support with dynamic conversion
- ✅ VAT calculation and configuration
- ✅ Invoice PDF generation with branding
- ✅ Email delivery with PDF attachments
- ✅ Payment link generation for customers

**Advanced Features:**
- Invoice-booking sync with conflict resolution
- Deferred income tracking
- Nominal code assignment
- Payment allocation across multiple invoices

**Key Components:**
- Multi-step bulk invoice wizard
- Invoice PDF template with React Email
- Payment confirmation workflow
- Void and recreate invoice functionality

---

### **5. Financial Reporting** 📊
**Technologies:** Recharts 2.15, PostgreSQL Complex Queries, XLSX Export, Date-fns

**Features Implemented:**
- ✅ **Aged Debtor Report** - Outstanding invoices by aging buckets (0-30, 31-60, 61-90, 90+ days)
- ✅ **Journal Report** - Complete transaction ledger with GL codes
- ✅ **Deferred Sales Report** - Revenue recognition tracking
- ✅ **Vehicle Usage Report** - Fleet utilization analytics
- ✅ Excel/CSV export for all reports
- ✅ Date range filtering and pagination
- ✅ Real-time data refresh with TanStack Query

**Key Components:**
- Report table with sortable columns
- Date range picker with presets
- Export to Excel functionality
- Financial dashboard with charts

---

### **6. Operations & Dispatch** 🎯
**Technologies:** DnD Kit, React Context, WebSocket, Liveblocks

**Features Implemented:**
- ✅ Live allocations dashboard with drag-and-drop
- ✅ Driver/vehicle assignment interface
- ✅ Schedule view (daily, weekly, monthly)
- ✅ Unallocated jobs panel
- ✅ Bulk allocation actions
- ✅ Dispatch confirmation workflow
- ✅ Job overlap detection and warnings
- ✅ Real-time presence indicators
- ✅ Work ticket download and email

**Key Components:**
- Schedule allocation grid with timeline
- Draggable job blocks
- Resource slot drop zones
- Job details side panel

---

### **7. Real-time Collaboration** 💬
**Technologies:** Liveblocks, React Email, Better Auth, WebSockets

**Features Implemented:**
- ✅ Live comments on jobs with @mentions
- ✅ Real-time presence indicators
- ✅ Email notifications for comments
- ✅ User avatars and online status
- ✅ Comment thread management
- ✅ Role-based comment visibility

**Key Components:**
- Liveblocks Room provider
- Comment composer with mentions
- Presence avatars stack
- Email notification templates

---

### **8. Multi-tenant Architecture** 🏢
**Technologies:** PostgreSQL RLS, Better Auth Sessions, Middleware

**Features Implemented:**
- ✅ Operator isolation at database level
- ✅ Role-based access control (RBAC)
- ✅ User invitation system
- ✅ Operator settings management
- ✅ Custom branding per operator
- ✅ Team member management
- ✅ Permission matrix system
- ✅ Operator switching functionality

**Key Components:**
- Auth middleware for operator scoping
- RBAC permission checks
- Settings context provider
- Team switcher component

---

### **9. Security & Compliance** 🔒
**Technologies:** PostgreSQL RLS, Zod, Better Auth, Rate Limiting

**Features Implemented:**
- ✅ Row-level security (RLS) policies
- ✅ Multi-layer input validation (client/server/database)
- ✅ Security event logging and audit trails
- ✅ CSRF protection
- ✅ Content Security Policy headers
- ✅ Rate limiting on API routes
- ✅ SQL injection prevention via ORM
- ✅ XSS protection with sanitization

**Key Components:**
- Security event schema
- Auth validation utilities
- DB security helpers
- API error wrapper

---

### **10. Subscription & Billing** 💳
**Technologies:** Stripe Subscriptions, Webhooks, PostgreSQL, TanStack Query

**Features Implemented:**
- ✅ Multi-tier subscription plans
- ✅ Vehicle-based pricing model
- ✅ Free trial management (14 days)
- ✅ Subscription upgrade/downgrade flow
- ✅ Stripe webhook processing
- ✅ Usage limit enforcement
- ✅ Billing cycle management
- ✅ Payment method updates
- ✅ Subscription cancellation
- ✅ Prorated billing calculations

**Key Components:**
- Subscription plan selector
- Payment form with Stripe Elements
- Usage status widget
- Billing access guard

---

### **11. Settings & Configuration** ⚙️
**Technologies:** React Hook Form, Server Actions, Optimistic Updates

**Features Implemented:**
- ✅ Operator profile settings
- ✅ Regional preferences (timezone, currency, date format)
- ✅ Deposit configuration
- ✅ Email template customization
- ✅ SMS notification settings
- ✅ Nominal code management
- ✅ Depot configuration
- ✅ Vehicle classes and types
- ✅ Journey types configuration
- ✅ Luggage types settings
- ✅ Decline reason templates
- ✅ Integration settings (Stripe, Wonderful, Mapbox)

**Key Components:**
- Settings sidebar navigation
- Form data manager with auto-save
- Unsaved changes warning bar
- Item card CRUD components

---

### **12. Email System** 📧
**Technologies:** Resend, React Email, Lexical, UploadThing

**Features Implemented:**
- ✅ Rich text email composer with Lexical
- ✅ Email template system (Quote, Booking, Invoice, etc.)
- ✅ Shortcode insertion for dynamic content
- ✅ CC/BCC support
- ✅ Attachment handling (PDF, images)
- ✅ Email logging and tracking
- ✅ Email analytics with open/click tracking
- ✅ Template preview functionality
- ✅ Email scheduling

**Key Components:**
- Lexical editor with custom plugins
- Email template selector
- Email analytics card
- Email chips input

---

### **13. Data Import/Export** 📥
**Technologies:** XLSX, CSV Parser, Trigger.dev, PostgreSQL Bulk Insert

**Features Implemented:**
- ✅ Customer data import (CSV/XLSX)
- ✅ Job data import with validation
- ✅ Template-based import with error reporting
- ✅ Bulk data validation
- ✅ Import progress tracking
- ✅ Error handling and rollback
- ✅ Sample file generation
- ✅ Export to Excel/CSV for all entities

**Key Components:**
- Import wizard with file upload
- Data validation pipeline
- Import progress modal
- Error display with line numbers

---

### **14. Database Migration System** 🗄️
**Technologies:** GitHub Actions, Drizzle Kit, Neon API, Bash Scripts

**Features Implemented:**
- ✅ Environment-specific workflows (dev, staging, production)
- ✅ Automated dev migrations on push
- ✅ Approval-gated staging migrations
- ✅ Multi-step production approvals
- ✅ Automatic backup before migrations
- ✅ Risk assessment and validation
- ✅ Rollback capabilities
- ✅ Feature branch database isolation
- ✅ Vercel preview integration
- ✅ Automatic cleanup of feature branches

**Key Scripts:**
- `.github/workflows/dev-migrations.yml`
- `.github/workflows/staging-migrations.yml`
- `.github/workflows/production-migrations.yml`
- `scripts/migrate-runner.ts`

---

### **15. Dashboard & Analytics** 📈
**Technologies:** Recharts, PostHog, TanStack Query, PostgreSQL Aggregations

**Features Implemented:**
- ✅ Financial dashboard (revenue, payments, outstanding)
- ✅ Operations dashboard (job status, allocations)
- ✅ Sales dashboard (bookings, quotes)
- ✅ Subscription usage widget
- ✅ Dashboard type switcher
- ✅ Real-time data updates
- ✅ Interactive charts (bar, line, pie)
- ✅ KPI cards with trend indicators

**Key Components:**
- Financial dashboard component
- Chart components with Recharts
- Dashboard stats hooks
- Widget grid layout

---

### **16. Schedule Management** 📅
**Technologies:** React DnD, Luxon, PostgreSQL, TanStack Query

**Features Implemented:**
- ✅ Schedule creation and editing
- ✅ Recurring job patterns
- ✅ Date range selection
- ✅ Schedule update confirmation
- ✅ Template-based scheduling
- ✅ Conflict detection
- ✅ Schedule allocation view
- ✅ Vehicle/driver schedule timeline

**Key Components:**
- Schedule form with date tags
- Schedule update dialog
- Allocation grid with timeline
- Schedule view switcher

---

### **17. User Management & RBAC** 👤
**Technologies:** Better Auth, PostgreSQL, React Context

**Features Implemented:**
- ✅ User invitation system
- ✅ Role assignment and management
- ✅ Permission matrix configuration
- ✅ Team member listing
- ✅ User profile management
- ✅ Impersonation for admin
- ✅ OAuth integration (Google, GitHub)
- ✅ Session management

**Key Components:**
- User management table
- Role selector
- Permission editor
- Invitation form

---

### **18. Notifications System** 🔔
**Technologies:** OneSignal, Expo Notifications, Email, SMS

**Features Implemented:**
- ✅ Push notifications for drivers
- ✅ Email notifications for users
- ✅ SMS notifications (configurable)
- ✅ In-app notification inbox
- ✅ Notification triggers configuration
- ✅ Unified notification service
- ✅ Notification preferences

**Key Components:**
- Notification inbox component
- Notification trigger settings
- Unified notification service
- Driver notification handler

---

### **19. PDF Generation** 📄
**Technologies:** Puppeteer, @sparticuz/chromium, React, HTML2Canvas

**Features Implemented:**
- ✅ Quote PDF generation
- ✅ Invoice PDF generation
- ✅ Work ticket PDF generation
- ✅ Custom branding in PDFs
- ✅ Multi-currency support
- ✅ PDF preview before download
- ✅ Email PDF as attachment
- ✅ Serverless PDF generation

**Key Components:**
- PDF template components
- Puppeteer service
- PDF generation API routes
- Download dialog

---

### **20. Mobile Driver Application** 📱
**Technologies:** React Native, Expo, TypeScript, TanStack Query

**Features Implemented:**
- ✅ Driver authentication with PIN
- ✅ Job listing with filters
- ✅ Job acceptance/rejection workflow
- ✅ Job details with map view
- ✅ Offline mode support
- ✅ Push notifications
- ✅ Profile management
- ✅ PWA install prompt
- ✅ Network status indicator

**Key Components:**
- Driver login screen
- Job card with swipeable actions
- Bottom sheet modal
- PWA installer

---

## 🛠️ **Additional Technical Implementations**

### **Code Quality & Testing**
- ✅ TypeScript strict mode throughout
- ✅ ESLint with custom rules
- ✅ Prettier code formatting
- ✅ Husky pre-commit hooks
- ✅ Vitest testing framework
- ✅ Integration tests for critical flows
- ✅ Accessibility testing

### **Performance Optimization**
- ✅ React Query caching strategies
- ✅ Optimistic UI updates
- ✅ Database query optimization
- ✅ Proper indexing strategy
- ✅ Code splitting with Next.js
- ✅ Image optimization
- ✅ Lazy loading components

### **Developer Experience**
- ✅ Turborepo monorepo setup
- ✅ Shared packages (@savari/database, @savari/ui, @savari/auth)
- ✅ Development scripts automation
- ✅ Environment validation
- ✅ Hot module replacement
- ✅ Type-safe APIs
- ✅ Documentation generation

---

## 📊 **Project Statistics**

- **Applications:** 7 (TMS, WMS, Driver, Customer, Admin, Auth, API)
- **Total Components:** 500+
- **Database Tables:** 40+
- **API Routes:** 100+
- **Server Actions:** 150+
- **Lines of Code:** 100,000+ (TypeScript/React)
- **Test Coverage:** Integration tests for critical flows

---

## 🎯 **Key Achievements**

1. ✅ Built a **production-ready multi-tenant TMS** serving multiple transport operators
2. ✅ Implemented **real-time collaboration** features with Liveblocks
3. ✅ Designed and developed **complex financial reporting** system
4. ✅ Created **automated CI/CD pipeline** with GitHub Actions for safe database migrations
5. ✅ Built **mobile-first driver application** with offline support
6. ✅ Integrated **multiple payment processors** (Stripe, Wonderful)
7. ✅ Developed **comprehensive RBAC system** with row-level security
8. ✅ Implemented **Mapbox routing** with ferry route detection
9. ✅ Built **bulk invoice generation** with multiple grouping strategies
10. ✅ Created **feature branch database workflow** for isolated testing

---

## 🔗 **Repository Structure**

```
savari-nextjs/
├── apps/
│   ├── tms/          # Transport Management System
│   ├── wms/          # Workshop Management System
│   ├── driver/       # Driver Mobile App
│   ├── admin/        # Admin Dashboard
│   ├── auth/         # Auth Service
│   ├── api/          # API Gateway
│   └── operator/     # Operator Portal
├── packages/
│   ├── database/     # Shared database schemas
│   ├── ui/           # Shared UI components
│   ├── auth/         # Shared auth logic
│   └── uploadthing/ # File upload utilities
└── .github/
    └── workflows/    # CI/CD pipelines
```

---

## 💡 **Technical Highlights for Resume**

**Full-Stack Transport Management System (Monorepo)**
- Architected and developed 7-application monorepo using **Next.js 15, React 19, TypeScript, Bun**
- Built **multi-tenant SaaS** with PostgreSQL RLS, serving multiple transport operators
- Implemented **real-time collaboration** with Liveblocks (live comments, presence)
- Developed **comprehensive financial system** (invoicing, payments, reporting)
- Created **CI/CD pipeline** with GitHub Actions for safe database migrations
- Integrated **Stripe + Wonderful** payment processing with webhook handling
- Built **driver mobile app** with **React Native/Expo** and offline support
- Implemented **Mapbox routing** with intelligent ferry route detection
- Developed **bulk invoice generation** with advanced grouping strategies
- Achieved **type-safe full-stack** development with Drizzle ORM + Zod validation
- Built **RBAC system** with role-based permissions and row-level security
- Technologies: Next.js, React, TypeScript, PostgreSQL, Drizzle ORM, TanStack Query, Tailwind CSS, Liveblocks, Stripe, Mapbox

---

*This document provides a comprehensive overview of all completed modules in the Savari TMS project. Each module represents production-ready code with proper testing, error handling, and documentation.*
