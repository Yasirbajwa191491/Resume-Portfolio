# SAG Application - Project Modules Overview

## Project Information
**Project Name:** SAG Enterprise Resource Planning System  
**Technology Stack:** Laravel 9 + Vue.js 2 + MS SQL Server  
**Company:** SA Group  
**Project Type:** Multi-tenant ERP System with HRMS, Accounts, Procurement, and Project Management

---

## Core Technologies Used

### Backend Technologies
- **Framework:** Laravel 9.x (PHP 8.0+)
- **Authentication:** Laravel Passport (OAuth2), Laravel Sanctum
- **Authorization:** Spatie Laravel Permission (Role-Based Access Control)
- **Database:** Microsoft SQL Server (via sqlsrv drivers)
- **API Documentation:** RESTful API
- **PDF Generation:** Laravel FPDF (codedge/laravel-fpdf)
- **Excel Operations:** Maatwebsite Excel 3.1
- **Image Processing:** Intervention Image
- **Email:** PHPMailer
- **Real-time:** Laravel Echo, Socket.io, Pusher
- **Background Jobs:** Laravel Queue
- **Biometric Integration:** ZKTeco SDK (maliklibs/zkteco)
- **AI Integration:** OpenAI PHP Client
- **Video Chat:** Laravel Video Chat

### Frontend Technologies
- **Framework:** Vue.js 2.6
- **UI Framework:** Bootstrap 5.1, Bootstrap-Vue 2.21
- **State Management:** Pinia 2.1
- **Routing:** Vue Router 3.5
- **Charts:** ApexCharts 3.33, Chart.js 4.3, Vue-ChartJS
- **Date Handling:** Moment.js, Vue2-DateRange-Picker
- **Rich Text Editor:** Vue2-Editor (Quill)
- **File Upload:** Vue2-Dropzone 3.6, Vue Media Upload
- **Data Tables:** Vue Good Table, Bootstrap-Vue-Datatable
- **PDF Export:** Vue-HTML2PDF
- **Excel Operations:** XLSX 0.18
- **Calendar:** Vue-FullCalendar
- **Notifications:** Vue-Toastr
- **Organization Chart:** Vue-Organization-Chart
- **Barcode:** Vue-Barcode
- **Maps:** Vuejs-Google-Maps
- **Drag & Drop:** Vuedraggable
- **Select Components:** Vue-Multiselect, V-Select2-Component
- **Dropdowns:** Syncfusion EJ2 Vue Dropdowns
- **UI Components:** PrimeVue 2.10, Primeicons
- **Image Viewer:** V-Viewer
- **Tour/Onboarding:** Vue-Tour
- **Build Tool:** Laravel Mix 6.0, Webpack

### Development Tools
- **Version Control:** Git
- **Package Manager:** Composer (Backend), NPM (Frontend)
- **Testing:** PHPUnit 9.5, Laravel Sail
- **Code Quality:** Mockery, Faker PHP
- **Debugging:** Spatie Laravel Ignition, Spatie Backtrace

---

## Module 1: Human Resource Management System (HRMS)

### 1.1 Employee Management
**Features Implemented:**
- Employee registration and profile management
- Personal information (CNIC, DOB, Blood Group, Contact Details)
- Employment details (Department, Designation, Posting, Salary)
- Document management (Multi-document upload system)
- Employee status tracking (Active, Resigned, Terminated, Suspended)
- Reporting hierarchy (Manager, HOD assignments)
- Bank account management for salary disbursement

**Technologies:**
- Vue.js components for UI (`hr_create_employee.vue`, `hr_employee_detail.vue`, `hr_edit_employee.vue`)
- Laravel Controllers for backend logic
- SQL Server stored procedures for complex queries
- Image upload with Intervention Image

### 1.2 Attendance Management
**Features Implemented:**
- Biometric device integration (ZKTeco)
- Real-time attendance tracking (Check-in/Check-out)
- Roster management (Shift scheduling)
- Grace period calculation
- Overtime calculation
- Late arrival tracking
- Leave management (Annual, Sick, Casual, Unpaid)
- Attendance reports by department/employee
- Time adjustment requests
- Holiday management

**Technologies:**
- ZKTeco SDK for biometric device integration
- SQL Server stored procedures for daily attendance processing
- Cron jobs for automated attendance calculations
- Vue components (`hr_attendance_dashboard.vue`, `hr_emp_att_detail.vue`, `hr_team_member_att.vue`)

### 1.3 Leave Management
**Features Implemented:**
- Leave requisition system
- Multi-level approval workflow (Manager → HR)
- Leave balance tracking
- Leave types configuration
- Leave history and reports
- Calendar integration for leave visualization

**Technologies:**
- Vue-FullCalendar for leave calendar
- Approval workflow with email notifications
- Database triggers for leave balance updates

### 1.4 Recruitment Module
**Features Implemented:**
- Job posting management
- Candidate registration portal
- Resume/CV management
- Interview scheduling (Online/Offline)
- Multi-stage interview process (First, Second, Final)
- Candidate rating system
- Interview status tracking
- Hiring workflow

**Technologies:**
- Vue components (`jobs.vue`, `candidates.vue`, `interviews.vue`, `job_details.vue`)
- File upload for resumes and documents
- Email notifications for interview schedules
- Google Maps integration for interview locations

### 1.5 Warning & Disciplinary Actions
**Features Implemented:**
- Warning letter generation
- Warning types (Verbal, Written, Final)
- Reason templates
- Warning letter printing
- Employee warning history

**Technologies:**
- FPDF for PDF letter generation
- Vue components (`hr_warning_create.vue`, `hr_warning_detail.vue`, `hr_warning_printing.vue`)

---

## Module 2: Payroll Management

### 2.1 Salary Processing
**Features Implemented:**
- Monthly salary calculation based on attendance
- Overtime calculation (per minute basis)
- Deduction calculation (absent days, grace period violations)
- Per-day and per-hour salary computation
- Salary increment tracking
- Multi-level approval workflow (Department → HR → Finance)
- Salary distribution management
- Payment method support (Cash, Bank Transfer)

**Technologies:**
- Complex SQL stored procedures for salary calculations
- Vue components (`py_salary_generation.vue`, `payroll_hr_approval.vue`, `payroll_finance_approval.vue`)
- Excel export for salary sheets

### 2.2 Loans & Advances
**Features Implemented:**
- Loan requisition system
- Loan types (Personal, Emergency, Advance)
- Installment management
- Maximum loan limit configuration
- Loan approval workflow
- Automatic installment deduction from salary
- Loan history tracking

**Technologies:**
- Installment calculation engine
- Integration with salary processing
- Vue component (`loans.vue`)

### 2.3 Allowances & Benefits
**Features Implemented:**
- Multiple allowance types (Fuel, Housing, Transport, Medical)
- Fuel bill management with detailed tracking
- Welfare allowance management
- Session-based allowance assignment
- Allowance approval workflow

**Technologies:**
- Vue components (`py_allowance.vue`, `py_allowance_fuel.vue`, `py_bill_fuel.vue`, `Fuelallowance.vue`)
- PDF generation for fuel bills

### 2.4 Deductions Management
**Features Implemented:**
- Fine management
- Dues tracking
- Tax withholding
- Automatic deduction from salary

**Technologies:**
- Vue components (`py_dues.vue`, `py_tax_holding.vue`)
- Integration with finance module

### 2.5 Bonuses & Arrears
**Features Implemented:**
- Bonus management (Performance, Annual, Festival)
- Arrears calculation and payment
- Session-based bonus assignment

**Technologies:**
- Vue components (`py_bonuses.vue`, `py_arrears.vue`)

### 2.6 Final Settlement
**Features Implemented:**
- End-of-service settlement calculation
- Gratuity calculation
- Leave encashment
- Loan clearance
- Multi-approval workflow
- Settlement payment tracking

**Technologies:**
- Complex calculation stored procedures
- Vue component (`final_settlement.vue`)
- PDF report generation

### 2.7 Stipend Management
**Features Implemented:**
- Department-wise stipend allocation
- Internship stipend management

**Technologies:**
- Vue component (`py_stipend.vue`)

---

## Module 3: Procurement Management

### 3.1 Demand Requisition
**Features Implemented:**
- Department-wise requisition creation
- Multiple requisition types (Inventory, Assets, Services)
- Item selection with specifications
- Multi-level approval workflow
- Requisition tracking and status management
- Requisition merging capability

**Technologies:**
- Vue components (`demand_requisition.vue`, `demand_requisition_assets.vue`, `demand_requisition_services.vue`)
- PDF report generation
- Email notifications

### 3.2 Purchase Requisition
**Features Implemented:**
- Purchase requisition creation from demand requisitions
- Vendor recommendation
- Budget approval integration
- Purchase requisition tracking
- Requisition merging for bulk orders

**Technologies:**
- Vue components (`purchase_requistion.vue`, `purchase_requistion_detail.vue`, `purchase_merge_requisition.vue`)
- RESTful API for requisition management

### 3.3 Quotation Management
**Features Implemented:**
- Vendor quotation collection
- Comparative statement generation
- Multi-vendor quotation analysis
- Quotation approval workflow
- Lowest bid identification

**Technologies:**
- Vue components (`purchase_create_quotation.vue`, `purchase_edit_quotation.vue`)
- Excel export for comparative analysis

### 3.4 Purchase Order (PO) Management
**Features Implemented:**
- PO generation from approved quotations
- Multiple PO types (Direct, Work Order, Service Order)
- Terms & conditions management
- PO tracking and status management
- PO amendment support
- Advance payment tracking

**Technologies:**
- Vue components (`PurchaseOrders.vue`, `PurchaseOrderCreate.vue`)
- PDF generation for PO documents
- Email notification to vendors

### 3.5 Goods Receipt Note (GRN)
**Features Implemented:**
- GRN creation against PO
- Quality inspection recording
- Partial/Full receipt handling
- Direct GRN (without PO) support
- GRN approval workflow

**Technologies:**
- Vue components (`GRN.vue`, `GRNCreate.vue`)
- Barcode generation for items
- PDF receipt printing

### 3.6 Purchase Invoice Management
**Features Implemented:**
- Invoice creation from GRN
- Tax calculation (GST, WHT)
- Invoice verification
- Payment term tracking
- Invoice aging reports

**Technologies:**
- Vue components (`create_pinvoice.vue`, `edit_pinvoice.vue`, `purchase_inv_detail.vue`)
- Automatic tax calculations

### 3.7 Purchase Returns
**Features Implemented:**
- Return creation against GRN/Invoice
- Quality rejection tracking
- Return approval workflow
- Debit note generation
- Vendor credit management

**Technologies:**
- Vue components (`PurchaseReturns.vue`, `PurchaseReturnCreate.vue`, `purchase_debit_notes.vue`)

### 3.8 Vendor Management
**Features Implemented:**
- Vendor registration
- Vendor categorization
- Contact management
- Bank account details
- Vendor performance tracking
- Vendor balance reports

**Technologies:**
- Vue component (`purchase_vendor_detail.vue`)
- Vendor portal access

---

## Module 4: Inventory Management

### 4.1 Stock Management
**Features Implemented:**
- Real-time stock tracking
- Multi-location inventory
- Stock valuation (FIFO, Average Cost)
- Minimum stock alerts
- Stock aging analysis
- Item categorization
- Unit of measurement management

**Technologies:**
- Vue component (`stock_detail.vue`)
- Complex SQL queries for stock calculations
- Dashboard with ApexCharts for stock visualization

### 4.2 Issuance Management
**Features Implemented:**
- Department-wise issuance
- Project-wise issuance
- Site issuance for construction projects
- Issuance approval workflow
- Multiple issuance types (Permanent, Temporary, Returnable)

**Technologies:**
- Vue components (`Issuances.vue`, `IssuanceCreate.vue`, `create_site_issuance.vue`)
- Barcode scanning for item verification
- PDF receipt generation

### 4.3 Issuance Returns
**Features Implemented:**
- Return against issuance
- Partial/Full return support
- Return reason tracking
- Stock adjustment on return

**Technologies:**
- Vue components (`IssuanceReturns.vue`, `IssuanceReturnCreate.vue`)

### 4.4 Inventory Adjustment
**Features Implemented:**
- Stock adjustment for discrepancies
- Adjustment reason recording
- Approval workflow for adjustments
- Audit trail for all adjustments

**Technologies:**
- Vue component (`inventory_adjustment.vue`)
- Multi-level authorization

### 4.5 Inventory Reports
**Features Implemented:**
- Stock summary reports
- Stock ledger by item
- Consumption analysis reports
- Item aging reports
- Receiving/Issuance data reports
- Department-wise stock reports
- Project-wise stock reports

**Technologies:**
- PDF/Excel report generation
- Date range filtering
- Multi-parameter reporting

---

## Module 5: Accounts/Finance Management

### 5.1 Chart of Accounts (COA)
**Features Implemented:**
- Hierarchical COA structure (up to 5 levels)
- Account head types (Assets, Liabilities, Equity, Revenue, Expenses)
- Account configuration and management
- Account portal with tree view
- Account transactions tracking
- Account balance calculations

**Technologies:**
- Vue components (`confg_coa.vue`, `coa_portal.vue`, `CoaPortal/Nodes.vue`, `CoaPortal/Transactions.vue`)
- Recursive tree structure
- Vue-Tree-Chart for visualization

### 5.2 Journal Vouchers (JV)
**Features Implemented:**
- Journal entry creation
- Multi-line journal entries
- Debit/Credit validation
- JV approval workflow
- JV reversal support
- Narration and reference tracking

**Technologies:**
- Vue components (`accounting_jv_create.vue`, `accounting_jv_detail.vue`, `accounting_edit_jv.vue`)
- Automatic balancing validation
- PDF voucher printing

### 5.3 Contra Entry
**Features Implemented:**
- Bank to cash transfers
- Cash to bank transfers
- Inter-bank transfers
- Contra entry approval

**Technologies:**
- Vue components (`accounting_contaentry_create.vue`, `accounting_contaentry_detail.vue`, `accounting_contaentry_edit.vue`)

### 5.4 Payment/Receipt Vouchers
**Features Implemented:**
- Payment voucher creation
- Receipt voucher creation
- Multiple payment methods (Cash, Cheque, Online, Bank Transfer)
- Vendor payment tracking
- Customer receipt management

**Technologies:**
- Vue components (`purchase_payment_voucher.vue`, `purchase_payment_detail.vue`)
- Integration with vendor/customer ledgers

### 5.5 Petty Cash Management
**Features Implemented:**
- Petty cash voucher creation
- Department-wise petty cash
- Petty cash reimbursement
- User-based access control
- Petty cash balance tracking

**Technologies:**
- Vue components (`create_petty_cash.vue`, `edit_pettycash.vue`, `petty_cash_detail.vue`, `pattycash_access.vue`)
- Multi-level approval

### 5.6 Sales Management
**Features Implemented:**
- Sales quotation
- Sales invoice generation
- Customer management
- Sales returns
- Credit notes
- Payment receipt tracking
- Sales reports

**Technologies:**
- Vue components (`sales_quotation.vue`, `sales_invoice.vue`, `sales_return.vue`, `sales_credit_notes.vue`)
- Tax calculations (GST)
- Invoice printing

### 5.7 Post-Dated Cheques (PDC)
**Features Implemented:**
- PDC receivable tracking
- PDC payable tracking
- Cheque status management (Pending, Cleared, Bounced)
- Cheque maturity alerts

**Technologies:**
- Vue components (`PdcReceivable.vue`, `PdcPayable.vue`)
- Automated notifications

### 5.8 Assets Management
**Features Implemented:**
- Fixed assets register
- Asset categorization
- Asset depreciation calculation
- Depreciation schedule management
- Asset retirement/disposal
- Asset assignment tracking

**Technologies:**
- Vue components (`assets_book.vue`, `assets_detail.vue`, `assets_depresciassion.vue`, `assets_retirement.vue`, `create_assets_depreciation.vue`)
- Automatic depreciation calculation

### 5.9 Configuration Management
**Features Implemented:**
- Account heads configuration
- Tax configuration (GST, WHT rates)
- Currency management with exchange rates
- Bank accounts configuration
- Product categories
- Payment terms
- Session/Financial year management
- Delivery configuration

**Technologies:**
- Vue components (`confg_accounts_sessions.vue`, `confg_taxes.vue`, `confg_currencies.vue`, `config_banks.vue`, `confg_products_categories.vue`)

### 5.10 Financial Reports
**Features Implemented:**
- Trial Balance
- Balance Sheet
- Income Statement (P&L)
- Cash Flow Statement
- Ledger Reports (Account-wise)
- Day Book / Cash Book
- Bank Book
- Receivables/Payables Aging
- Vendor Balance Report
- Tax Reports

**Technologies:**
- Vue components in `reports/` folder
- PDF/Excel export
- Date range and parameter-based filtering
- Drill-down capability

---

## Module 6: Real Estate/Units Management

### 6.1 Unit Management
**Features Implemented:**
- Unit/Property registration
- Unit booking management
- Unit controller dashboard
- Payment receipt against units
- Multiple receipt types (Cash, Cheque, Online, Bank Transfer, Booking, Adjustment)
- Suspense receipt management
- Unit transfer management

**Technologies:**
- Vue components (`unit_controller.vue`, `unit_pending_*.vue`, `unit_suspense_receipts.vue`)
- Unit adjustment and merging

### 6.2 Dealer Management
**Features Implemented:**
- Dealer commission tracking
- Dealer voucher generation
- Commission calculation

**Technologies:**
- Vue components (`units_dealer_commission.vue`, `units_dealer_voucher.vue`)

### 6.3 Unit Services & Payments
**Features Implemented:**
- Service charges management
- Maintenance fee tracking
- Electricity bill integration
- SAM (Society Association Management) vouchers
- Odd voucher management
- Refund processing

**Technologies:**
- Vue components (`unit_services.vue`, `units_refund.vue`, `units_odd_voucher.vue`)

---

## Module 7: Club Management

### 7.1 Club Registration
**Features Implemented:**
- Club profile management
- Club facilities management
- Club location tracking

**Technologies:**
- Vue component (`clubRegister.vue`)

### 7.2 Member Management
**Features Implemented:**
- Member registration
- Member categorization (Resident/Non-Resident)
- Family member tracking
- Membership fee management

**Technologies:**
- Vue components (`memberRegister.vue`, `clubMembersFee.vue`, `membersFees.vue`)

---

## Module 8: Project Management

### 8.1 Project Creation & Management
**Features Implemented:**
- Project registration
- Project details management
- Project status tracking
- File upload and document management
- Project team assignment

**Technologies:**
- Vue components (`project_list.vue`)
- RESTful API endpoint for project creation
- Multi-user collaboration

### 8.2 Bill of Quantities (BOQ)
**Features Implemented:**
- BOQ creation for projects
- Item-wise quantity estimation
- Cost calculation

**Technologies:**
- Vue component (`boq.vue`)

### 8.3 Bill of Materials (BOM)
**Features Implemented:**
- Material requirement planning
- BOM linking with inventory

**Technologies:**
- Vue component (`bom.vue`)

### 8.4 Material Statement
**Features Implemented:**
- Project-wise material consumption
- Material allocation tracking

**Technologies:**
- Vue components (`material_statement.vue`)
- Laravel controller (`MaterialStatementController.php`)

### 8.5 Work Breakdown Structure (WBS)
**Features Implemented:**
- Task hierarchy creation
- Milestone tracking
- Progress monitoring

**Technologies:**
- Vue component (`work_break_down.vue`)

### 8.6 Project Documentation
**Features Implemented:**
- File upload management
- Version control
- Diagram management

**Technologies:**
- Vue components (`files_upload.vue`, `diagrams.vue`, `versions.vue`)

---

## Module 9: Administration & Access Control

### 9.1 Company Management
**Features Implemented:**
- Multi-company/tenant support
- Company registration and profile
- Company-wise data segregation
- Child company hierarchy
- Company dashboard

**Technologies:**
- Vue components (`create_company.vue`, `company_detail.vue`, `company_edit.vue`, `company_dashboard.vue`, `overall_companies.vue`)
- Multi-database connection support

### 9.2 User Management
**Features Implemented:**
- User registration and profile
- User status management (Active, Inactive, Blocked)
- Password management with encryption
- User activity logging

**Technologies:**
- Vue components (`create_user.vue`, `update_user.vue`, `users_page.vue`)
- Laravel Passport for OAuth2
- Activity log tracking

### 9.3 Roles & Permissions
**Features Implemented:**
- Dynamic role creation
- Permission assignment to roles
- User-role assignment
- Module-wise permissions
- Custom permission types (HRMS, Procurement, Accounts, etc.)
- Frontend/Backend permission segregation

**Technologies:**
- Spatie Laravel Permission package
- Vue components (`RolesAndPermissions.vue`, `CreateRoles.vue`, `RoleAccordions.vue`)
- Database-driven permission system

### 9.4 Department & Designation Management
**Features Implemented:**
- Department hierarchy
- Designation management
- Department-wise employee assignment

**Technologies:**
- Vue components (`department_detail.vue`, `designation_detail.vue`)

### 9.5 Location Management
**Features Implemented:**
- Office location management
- City management
- Posting location assignment

**Technologies:**
- Vue component (`location_detail.vue`)
- Google Maps integration

### 9.6 Configuration Management
**Features Implemented:**
- System-wide settings
- HR configuration
- Payroll configuration
- Accounts configuration
- General configuration

**Technologies:**
- Vue components (`hr_configuration.vue`, `config_general.vue`)

---

## Module 10: Communication & Collaboration

### 10.1 Chat System
**Features Implemented:**
- Real-time messaging
- User-to-user chat
- Chat history

**Technologies:**
- Vue component (`chat.vue`)
- Laravel Echo + Socket.io
- Pusher for real-time events

### 10.2 Calendar & Events
**Features Implemented:**
- Company-wide calendar
- Event creation and management
- Event sharing
- Event reminders
- Location-based events

**Technologies:**
- Vue-FullCalendar
- Event notifications

### 10.3 Tasks Management
**Features Implemented:**
- Task creation and assignment
- Task status tracking
- Task prioritization
- Due date management

**Technologies:**
- Vue component (`tasks.vue`)
- Database table for tasks

### 10.4 Notifications
**Features Implemented:**
- Real-time notifications
- Email notifications
- System notifications
- Broadcast notifications

**Technologies:**
- Laravel broadcasting
- Socket.io client
- Vue-Toastr for UI notifications

---

## Module 11: Reporting & Analytics

### 11.1 Dashboard Components
**Features Implemented:**
- HRMS Dashboard with attendance metrics
- Procurement Dashboard with PO/GRN statistics
- Accounts Dashboard with financial KPIs
- Payroll Dashboard with salary distribution
- Recruitment Dashboard with hiring pipeline
- Company Dashboard with overall metrics

**Technologies:**
- ApexCharts for interactive charts
- Chart.js for data visualization
- Real-time data updates

### 11.2 Report Generation
**Features Implemented:**
- 100+ pre-built reports across all modules
- Custom report parameters
- Date range filtering
- Export to PDF/Excel
- Print-friendly layouts
- Email report delivery

**Technologies:**
- Laravel FPDF for PDF
- Maatwebsite Excel for Excel export
- Custom report controllers
- Vue-HTML2PDF for client-side PDF generation

### 11.3 Analytics Features
**Features Implemented:**
- Trend analysis
- Comparative reports
- Drill-down reporting
- Multi-dimensional filtering

---

## Module 12: Integration & Advanced Features

### 12.1 Biometric Integration
**Features Implemented:**
- ZKTeco device integration
- Automatic attendance sync
- Real-time punch data capture
- Device configuration management

**Technologies:**
- ZKTeco SDK (maliklibs/zkteco)
- Scheduled jobs for data sync

### 12.2 AI Integration
**Features Implemented:**
- OpenAI integration for intelligent features
- AI-powered recommendations

**Technologies:**
- OpenAI PHP Client
- Vue component (`AiController.php`)

### 12.3 Video Conferencing
**Features Implemented:**
- Integrated video chat for interviews
- Online meeting support

**Technologies:**
- Laravel Video Chat package

### 12.4 Barcode System
**Features Implemented:**
- Barcode generation for inventory items
- Barcode scanning for issuance/receipt

**Technologies:**
- Vue-Barcode component

### 12.5 Session Management
**Features Implemented:**
- Multi-session support
- Session switching
- Long session timeout (400 minutes)

**Technologies:**
- Laravel session driver

---

## Database Architecture

### Database Setup
- **Primary Database:** Multi-database architecture
  - `system_sass` - Main application database
  - `system_hrms` - HRMS specific database
  - `system_accounts` - Accounts specific database
  - `SA_MIS` - Management Information System database
- **Connection:** SQL Server with multiple connections
- **Migration System:** Laravel migrations for schema management
- **Stored Procedures:** 15+ stored procedures for complex operations
  - Attendance processing
  - Salary calculations
  - Final settlement
  - Report generation

### Key Database Tables (100+ tables)
- **HRMS:** Emp_Profile, Emp_Register, AttData, Employee_Qualification, Emp_Work_Experience, leave_Requisition, Warning_Letter, Post_Job, Candidate_Detail, interview_detail
- **Payroll:** PayrollHrApproval, PayrollFinanceApproval, Payroll_Distribution, LoanRequisition, LoanDetail, PayrollAllowance, PayrollBonuses, PayrollArrears, PayrollDues, FinalSettlement
- **Inventory:** Stock tables, Issuance tables, GRN tables
- **Accounts:** COA tables, Journal Entry tables, Voucher tables, Invoice tables
- **Projects:** Project tables, BOQ, BOM, Material Statement
- **Admin:** Users, Roles, Permissions, Companies, Departments, Designations

---

## Security Features

### Authentication & Authorization
- OAuth2 with Laravel Passport
- Token-based API authentication with Sanctum
- Role-based access control (RBAC)
- Permission-based feature access
- Password encryption
- Session management
- Token expiration handling

### Data Security
- Company-wise data segregation
- Multi-level approval workflows
- Audit trails for critical operations
- Activity logging
- Encrypted passwords
- SQL injection prevention
- CSRF protection

### User Access Control
- Module-wise permissions
- Feature-level permissions
- User-based data access
- Company-based data isolation

---

## Performance Optimizations

### Backend
- Database indexing
- Stored procedures for complex queries
- Query optimization
- Eager loading for relationships
- Caching strategies
- Background job processing

### Frontend
- Lazy loading of Vue components
- Code splitting with Webpack
- Asset optimization
- CDN integration capability
- Pagination for large datasets
- Virtual scrolling for long lists

---

## Key Achievements & Highlights

1. **Multi-Tenant Architecture:** Successfully implemented company-wise data segregation with 4 separate databases
2. **Biometric Integration:** Real-time attendance sync from ZKTeco devices with automated processing
3. **Complex Payroll Engine:** Automated salary calculation with overtime, deductions, allowances, and multi-level approvals
4. **End-to-End Procurement:** Complete procurement cycle from demand requisition to vendor payment
5. **Real-time Features:** Socket.io integration for live notifications and chat
6. **Comprehensive Reporting:** 100+ reports with PDF/Excel export capabilities
7. **Mobile-Responsive:** Bootstrap 5 responsive design for all modules
8. **Role-Based Access:** Dynamic permission system for fine-grained access control
9. **AI Integration:** OpenAI integration for intelligent features
10. **Video Conferencing:** Built-in video chat for remote interviews

---

## Deployment & Environment

### Server Requirements
- **Web Server:** Apache (XAMPP 3.3.0)
- **PHP Version:** 8.0+
- **Database:** Microsoft SQL Server Management Studio 18
- **Node.js:** Version 18 or 19
- **Composer:** Latest version

### Production Setup
- Multi-database configuration
- SQL Server drivers (php_pdo_sqlsrv_81_ts_x64.dll, php_sqlsrv_81_ts_x64.dll)
- Network protocols enabled for SQL Server
- Storage linked with public folder
- Email SMTP configuration (secure.sagroup.ltd)
- Redis for caching and queues

---

## Future Enhancements & Roadmap

### Planned Features
- Mobile app development (iOS/Android)
- Advanced analytics with machine learning
- Blockchain integration for audit trails
- WhatsApp integration for notifications
- Biometric facial recognition
- Advanced project management (Gantt charts, resource planning)
- Customer portal
- Vendor portal
- Employee self-service portal
- API marketplace for third-party integrations

---

## Development Team Contributions

### Key Accomplishments
- Developed and deployed a full-scale ERP system from scratch
- Integrated multiple third-party services (ZKTeco, OpenAI, Payment Gateways)
- Implemented complex business logic for payroll and procurement
- Created 100+ Vue.js components for rich user interface
- Designed and optimized 100+ database tables
- Built RESTful API with Laravel
- Implemented real-time features with Socket.io
- Generated comprehensive reports with FPDF and Excel
- Ensured data security with role-based access control
- Maintained code quality and documentation

---

## Project Statistics

- **Total Lines of Code:** 100,000+ lines
- **Vue Components:** 150+ components
- **Database Tables:** 100+ tables
- **API Endpoints:** 300+ endpoints
- **Stored Procedures:** 15+ procedures
- **Reports:** 100+ reports
- **Modules:** 12 major modules
- **Development Duration:** [Your project timeline]
- **Team Size:** [Your team size]

---

## Technologies Summary for Resume

**Backend:** Laravel 9, PHP 8, Laravel Passport, Laravel Sanctum, Spatie Permission, SQL Server, RESTful API  
**Frontend:** Vue.js 2, Vue Router, Pinia, Bootstrap 5, Bootstrap-Vue, ApexCharts, Chart.js, PrimeVue  
**Database:** Microsoft SQL Server (Multi-database architecture)  
**Real-time:** Laravel Echo, Socket.io, Pusher, Redis  
**Integrations:** ZKTeco Biometric, OpenAI API, PHPMailer, Laravel Video Chat  
**Tools:** Git, Composer, NPM, Webpack, Laravel Mix  
**Reports:** Laravel FPDF, Maatwebsite Excel, Vue-HTML2PDF  
**Additional:** OAuth2, RBAC, Multi-tenancy, Background Jobs, Queues

---

## Contact & Repository
**Developer:** [Your Name]  
**Email:** [Your Email]  
**Repository:** [If available]  
**Documentation:** This document serves as comprehensive module overview

---

*Document Version: 1.0*  
*Last Updated: January 2026*
