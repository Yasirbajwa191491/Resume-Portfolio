# Savari Monorepo - Project Modules Overview

## 📋 Project Summary

**Project Name:** Savari - Multi-Operator Transport & Workshop Management Platform  
**Architecture:** Full-stack Turborepo Monorepo  
**Project Type:** SaaS B2B Multi-Tenant Platform  
**Team Size:** [Your team size]  
**Duration:** [Your duration]  
**Role:** [Your role]

---

## 🏗️ System Architecture

### Monorepo Structure
- **5 Applications**: Web Dashboard, Driver App, Operator App, Technician App, Customer App
- **7 Packages**: Backend (Convex), UI Components, Shared Logic, Config packages
- **Build System**: Turborepo with Bun package manager
- **Multi-tenant**: Complete operator isolation with secure data segregation

---

## 🚀 Technology Stack

### **Frontend - Web**
- **Framework**: Next.js 16 (App Router, React 19)
- **UI Libraries**: 
  - shadcn/ui component system
  - Radix UI primitives
  - TailwindCSS 4 (utility-first styling)
  - CVA (Class Variance Authority) for variant management
- **State Management**: 
  - Zustand (client state)
  - TanStack Query (server state)
  - Nuqs (URL state management)
- **Forms & Validation**: 
  - TanStack React Form
  - Zod v4 (schema validation)
- **Rich Text**: Tiptap editor (email templates, notes)
- **Maps**: Google Maps (@vis.gl/react-google-maps)
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Analytics**: PostHog, React Intercom

### **Frontend - Mobile**
- **Framework**: React Native (Expo 54)
- **Navigation**: Expo Router (file-based routing)
- **UI**: HeroUI Native, Lucide React Native icons
- **Storage**: Async Storage, Expo Secure Store
- **Device Features**: 
  - Camera, Image Picker
  - Biometric Authentication (Local Auth)
  - Push Notifications
  - Offline support with TanStack DB Collection

### **Backend**
- **BaaS**: Convex (Reactive Backend as a Service)
- **Authentication**: Better-Auth with Convex adapter
- **Database**: Convex (real-time, reactive)
- **Schema**: Strongly-typed with Zod validation
- **Background Jobs**: Trigger.dev v4
- **Email**: Resend API
- **SMS**: Twilio integration
- **Payments**: Stripe (subscriptions, invoicing)
- **File Storage**: Convex file storage
- **Rate Limiting**: Custom auth rate limiter

### **External Integrations**
- **Telematics**: Samsara, Geotab (vehicle tracking)
- **Lead Sources**: Coach Hire Direct
- **Payment Gateway**: Stripe Connect
- **Email Domain**: Custom domain verification (SPF, DKIM, DMARC)
- **SMS Provider**: Twilio

### **DevOps & Tooling**
- **Monorepo**: Turborepo (task orchestration)
- **Package Manager**: Bun 1.2.15
- **Version Control**: Git with Husky pre-commit hooks
- **Deployment**: Vercel (web), EAS (mobile)
- **CI/CD**: Automated deployments with Convex integration
- **Code Quality**: ESLint, Prettier, lint-staged
- **Testing**: Playwright (E2E browser automation)
- **Type Safety**: TypeScript 5 (strict mode)

---

## 📦 Completed Modules

### **1. Transport Management System (TMS)**

#### **Job Management Module**
- ✅ Quote Management (create, edit, convert to booking)
- ✅ Booking Management (accept, decline, allocate)
- ✅ Contract & Schedule Management (recurring jobs)
- ✅ Multi-journey support (outbound, return, stops)
- ✅ Route planning with Google Maps integration
- ✅ Passenger management (lead passenger, additional passengers)
- ✅ Vehicle & driver allocation system
- ✅ Real-time job status tracking
- ✅ Job duplication and templating
- ✅ Audit logging for all job changes

**Technologies**: Next.js App Router, Convex queries/mutations, Google Maps API, TanStack Form, Zod validation

#### **Finance Module**
- ✅ Invoice generation (manual & auto from jobs)
- ✅ Credit notes and refunds
- ✅ Payment tracking and allocation
- ✅ Ledger system (double-entry accounting)
- ✅ Stripe integration for customer payments
- ✅ PDF invoice generation with custom branding
- ✅ Deposit management
- ✅ Payment methods and nominal codes
- ✅ Invoice email automation
- ✅ Financial reporting (journal, transactions)

**Technologies**: Convex, Stripe API, Playwright (PDF generation), React Email, Resend

#### **Customer & Business Management**
- ✅ Customer database (CRUD operations)
- ✅ Business profiles (corporate clients)
- ✅ Customer contact management
- ✅ Customer journey history
- ✅ Customer-specific pricing
- ✅ Archive/restore functionality

**Technologies**: Convex reactive queries, TanStack Table, shadcn/ui forms

#### **Resource Management**
- ✅ Vehicle management (types, classes, assignments)
- ✅ Driver management (availability, assignments)
- ✅ Depot management with buffer time settings
- ✅ Resource allocation system (drag-and-drop)
- ✅ Resource availability tracking
- ✅ Conflict detection (double-booking prevention)

**Technologies**: Convex, @dnd-kit, TanStack Table

#### **Settings & Configuration**
- ✅ Job settings (journey types, luggage types, sources, declined reasons)
- ✅ Email/SMS templates with shortcodes
- ✅ PDF branding (logo, colors, headers/footers)
- ✅ Invoice settings (due days, bank details, payment methods)
- ✅ Custom domain setup (email verification)
- ✅ Integration settings (Samsara, Coach Hire Direct)

**Technologies**: Tiptap rich text editor, Convex file storage, DNS verification

---

### **2. Workshop Management System (WMS)**

#### **Inspection System**
- ✅ Dynamic form builder (drag-and-drop)
- ✅ Custom field types (text, number, signature, photo, dropdown, etc.)
- ✅ Vehicle assignment rules (all vehicles, specific types/classes/tags)
- ✅ Driver & technician assignments
- ✅ Mobile inspection submissions (offline support)
- ✅ Photo capture and storage
- ✅ Digital signatures
- ✅ Defect reporting with severity levels
- ✅ Linked work orders from defects

**Technologies**: React Native, Expo Camera, @dnd-kit, Convex file storage, TanStack DB Collection

#### **Work Order Management**
- ✅ Create work orders (manual & from defects)
- ✅ Service task tracking
- ✅ Technician assignments
- ✅ Parts usage tracking
- ✅ Labor time logging
- ✅ Work order status workflow
- ✅ Cost tracking (labor, parts, vendor)

**Technologies**: Convex, TanStack Form, shadcn/ui

#### **Parts & Inventory Management**
- ✅ Parts catalog with categories
- ✅ Part transactions (add, use, adjust)
- ✅ Vendor management
- ✅ Part cost tracking
- ✅ Stock level monitoring
- ✅ Part assignment to work orders

**Technologies**: Convex reactive queries, TanStack Table

#### **Maintenance Scheduling**
- ✅ Service reminder system (mileage/time-based)
- ✅ Scheduled inspections
- ✅ Recurring maintenance tasks
- ✅ Notification system for due services

**Technologies**: Convex cron jobs, Expo Notifications

#### **Vehicle Management**
- ✅ Vehicle database (detailed profiles)
- ✅ Vehicle tags (custom categorization)
- ✅ Mileage/odometer tracking
- ✅ Fluid tracking (oil, fuel, coolant)
- ✅ Vehicle history (inspections, work orders, defects)
- ✅ Integration with telematics (Samsara, Geotab)

**Technologies**: Convex, external API integration

#### **Reporting & Analytics**
- ✅ Cost reports (vehicle, technician, vendor)
- ✅ Work order reports
- ✅ Inspection submission reports
- ✅ Defect trend analysis
- ✅ Service task completion tracking
- ✅ Driver activity reports
- ✅ Fluid usage reports
- ✅ Mileage reports

**Technologies**: Recharts, Convex aggregations, TanStack Table

---

### **3. Driver Mobile App**

#### **Core Features**
- ✅ Biometric login (Face ID, Touch ID)
- ✅ Job list (upcoming, in-progress, completed)
- ✅ Job details (route, passengers, notes)
- ✅ Real-time job updates (push notifications)
- ✅ Vehicle inspection submissions
- ✅ Photo capture for inspections
- ✅ Digital signature capture
- ✅ Offline mode (sync when online)
- ✅ Driver session tracking

**Technologies**: React Native, Expo, Expo Local Auth, Expo Notifications, Convex sync

---

### **4. Authentication & User Management**

#### **Authentication System**
- ✅ Email/password authentication
- ✅ Magic link authentication
- ✅ Session management with Better-Auth
- ✅ Rate limiting (brute force protection)
- ✅ Password reset flow
- ✅ Email verification

**Technologies**: Better-Auth, Convex adapter, Resend

#### **Multi-Operator System**
- ✅ Operator creation and onboarding
- ✅ Operator switching (single user, multiple operators)
- ✅ Operator invitations (email-based)
- ✅ Role-based permissions
- ✅ Data isolation (complete tenant separation)
- ✅ Operator subscription management

**Technologies**: Convex, Stripe subscriptions

#### **User Preferences**
- ✅ Last viewed operator persistence
- ✅ Theme preferences
- ✅ Notification settings

**Technologies**: Convex, Zustand

---

### **5. Subscription & Billing**

#### **Stripe Integration**
- ✅ Subscription plans (TMS, WMS, combined)
- ✅ Checkout flow with Stripe
- ✅ Webhook handling (subscription events)
- ✅ Coupon/discount support
- ✅ Subscription reactivation
- ✅ Payment method management
- ✅ Invoice generation

**Technologies**: Stripe API, Convex HTTP endpoints, Stripe CLI

---

### **6. Email & Communication**

#### **Email System**
- ✅ Transactional emails (invoices, passwords, invitations)
- ✅ Custom email templates with shortcodes
- ✅ Custom domain setup (SPF, DKIM, DMARC)
- ✅ Email preview system
- ✅ Email tracking (sent, delivered, bounced)
- ✅ Resend integration

**Technologies**: Resend API, React Email, Tiptap

#### **SMS System**
- ✅ SMS notifications
- ✅ SMS templates
- ✅ Twilio integration
- ✅ SMS usage tracking

**Technologies**: Twilio API, Convex

---

### **7. Admin & Migrations**

#### **Admin Panel**
- ✅ System-wide user management
- ✅ Operator management
- ✅ Migration tools (legacy data import)
- ✅ System commands

**Technologies**: Convex, Next.js admin routes

#### **Data Migration System**
- ✅ Legacy Savari data import
- ✅ Progress tracking
- ✅ Error handling and logging
- ✅ Migration history audit trail
- ✅ Rollback support

**Technologies**: Convex actions, Neon Database (legacy)

---

## 🎯 Key Technical Achievements

### **Performance Optimizations**
- ✅ Parallel tool execution (Factory Droid optimization)
- ✅ React 19 compiler integration
- ✅ Convex reactive queries (real-time updates)
- ✅ Turborepo caching (build optimization)
- ✅ Code splitting and lazy loading

### **Security Implementations**
- ✅ Multi-tenant data isolation (row-level security)
- ✅ Auth rate limiting (brute force protection)
- ✅ Secure operator switching
- ✅ Audit logging for all critical operations
- ✅ Environment variable security

### **Developer Experience**
- ✅ Monorepo workspace setup
- ✅ Custom AI agent configurations (Factory Droids)
- ✅ Type-safe API layer (Convex + Zod)
- ✅ Shared component library
- ✅ Comprehensive documentation (AGENTS.md per package)

---

## 📊 Project Metrics

- **Total Applications**: 5
- **Total Packages**: 7
- **Database Tables**: 50+ (TMS + WMS combined)
- **API Endpoints**: 200+ Convex functions
- **UI Components**: 100+ reusable components
- **Mobile Screens**: 30+ screens per app
- **Lines of Code**: [Estimate based on repo]

---

## 🔗 Integration Ecosystem

### **Third-Party Services**
1. **Stripe** - Subscription billing, payments, invoicing
2. **Resend** - Transactional email delivery
3. **Twilio** - SMS notifications
4. **Google Maps** - Route planning, geocoding
5. **Samsara** - Vehicle telematics
6. **Geotab** - Fleet tracking
7. **Coach Hire Direct** - Lead generation
8. **PostHog** - Product analytics
9. **Intercom** - Customer support
10. **Trigger.dev** - Background job processing

---

## 💼 Skills Demonstrated

### **Frontend Development**
- React 19 (latest features)
- Next.js 16 (App Router, Server Components)
- React Native (Expo)
- TypeScript (advanced types)
- TailwindCSS 4 (design system)
- Form handling (complex validations)
- Real-time UI updates

### **Backend Development**
- Convex BaaS (reactive backend)
- RESTful API design
- Authentication & authorization
- Database schema design
- Webhook handling
- Background job processing
- Multi-tenancy architecture

### **DevOps & Architecture**
- Monorepo management (Turborepo)
- CI/CD pipelines (Vercel, EAS)
- Environment configuration
- Git workflows
- Performance optimization
- Security best practices

### **Mobile Development**
- React Native (Expo)
- Offline-first architecture
- Device feature integration (camera, biometrics)
- Push notifications
- Mobile-specific UI/UX

---

## 🚀 Deployment & Operations

- **Web App**: Deployed on Vercel with automatic preview deployments
- **Mobile Apps**: EAS Build (iOS/Android)
- **Backend**: Convex Cloud (auto-scaling)
- **Monitoring**: PostHog analytics, error tracking
- **Uptime**: [Your uptime stats if available]

---

## 📝 Resume Summary Template

```
Savari - Transport & Workshop Management Platform (SaaS)
Full-Stack Developer | [Duration]

• Architected and developed a full-stack multi-tenant SaaS platform using Next.js 16, 
  React Native, and Convex BaaS, serving transport and workshop management operations
  
• Built 5 production applications (web dashboard + 4 mobile apps) in a Turborepo monorepo 
  with shared component library and 50+ database tables
  
• Implemented comprehensive TMS module: job management (quotes, bookings, schedules), 
  finance system (invoicing, payments, ledger), and resource allocation with real-time updates
  
• Developed WMS module: dynamic inspection form builder, work order system, parts inventory 
  management, and maintenance scheduling with mobile offline support
  
• Integrated 10+ third-party services (Stripe, Google Maps, Samsara, Twilio, Resend) 
  with custom webhooks and API handlers
  
• Established secure multi-operator architecture with complete data isolation, role-based 
  access control, and audit logging for compliance
  
• Tech Stack: React 19, Next.js 16, React Native (Expo 54), TypeScript, Convex, 
  TailwindCSS 4, Stripe, Zod, TanStack Query, Turborepo, Vercel

Key Metrics: 50+ tables, 200+ API endpoints, 100+ UI components, 3 mobile apps
```

---

## 📄 Notes for Resume

1. **Highlight specific modules** you personally worked on
2. **Quantify impact** where possible (users, revenue, performance)
3. **Emphasize architecture decisions** (multi-tenancy, monorepo, real-time)
4. **Showcase technical depth** (TypeScript, Zod validation, Convex schema)
5. **Include integrations** as proof of API/webhook expertise

---

**Document Generated**: 2026-01-21  
**Project Repository**: savari-monorepo  
**For**: Resume/Portfolio purposes
