# Starcast ISP Reseller Platform - Development Guidelines

## 🚨 CRITICAL DATA ACCURACY REQUIREMENTS

### **Consumer Protection & Legal Compliance**
- **NO SAMPLE DATA**: Never add made-up or placeholder data for consumer-facing content
- **FACTUAL INFORMATION ONLY**: All pricing, package details, and terms must be 100% accurate
- **MISSING DATA POLICY**: If information doesn't exist, leave the field empty - don't create sample data
- **Legal Responsibility**: Incorrect information could result in lawsuits if we cannot deliver promised services
- **Backend-Controlled Content**: All consumer-facing data must come from the backend database
- **Admin-Managed Updates**: Pricing and promotions updated by admin staff, not developers

### **Data Management Protocol**
```
❌ NEVER DO:
- Add sample pricing data
- Create placeholder package information
- Guess at terms and conditions
- Add fake promotional offers
- Estimate speeds or coverage areas
- Use "unlimited" instead of South African term "uncapped"

✅ ALWAYS DO:
- Use only verified data from official sources
- Leave fields empty if data unavailable
- Ask user for missing information sources
- Flag incomplete data sections for user review
- Remove any test/sample data after testing
- Use correct South African terminology ("uncapped" not "unlimited")
```

### **🇿🇦 South African Localization Requirements**
- **Terminology**: Use "uncapped" instead of "unlimited" for data packages
- **Currency**: All prices in South African Rand (R)
- **Legal Compliance**: Follow South African consumer protection laws
- **Network Standards**: Use local ISP terminology and standards

## 🎯 CRITICAL DEVELOPMENT METHODOLOGY

### **MANDATORY WORKFLOW FOR ALL FEATURES**

#### **Step 1: Plan Before Code**
```
BEFORE WRITING ANY CODE:
1. Break feature into 3-5 micro-tasks (max 20 lines each)
2. Define exact files to create/modify
3. Identify dependencies and imports needed
4. Plan test verification for each micro-task
```

#### **Step 2: Implement One Micro-Task at a Time**
```
FOR EACH MICRO-TASK:
1. Write ONLY the specific micro-task code
2. Test the micro-task immediately
3. Verify no errors or warnings
4. Commit the working micro-task
5. ONLY THEN proceed to next micro-task
```

#### **Step 3: Validation After Each Step**
```
AFTER EACH MICRO-TASK:
✅ Run: npm run type-check
✅ Run: npm run lint:check  
✅ Test in browser: http://localhost:3000
✅ Verify no console errors
✅ Verify functionality works as expected
```

#### **Step 4: Documentation & Review**
```
AFTER COMPLETING ALL MICRO-TASKS:
1. Update CLAUDE.md with what was implemented
2. Update nextjs.md with any changes made
3. Review the complete feature end-to-end
4. Plan the next feature's micro-tasks
```

### **Error Prevention Rules**

#### **🚫 NEVER DO:**
- ❌ Write more than 20 lines of code without testing
- ❌ Create multiple files in one step
- ❌ Skip testing intermediate steps
- ❌ Ignore TypeScript or ESLint warnings
- ❌ Rush through implementation
- ❌ Assume previous code still works without verification

#### **✅ ALWAYS DO:**
- ✅ Test after every small change
- ✅ Fix errors immediately when they appear
- ✅ Verify imports and dependencies work
- ✅ Check for console errors in browser
- ✅ Commit working code frequently
- ✅ Ask for clarification if unsure about next step

### **Quality Gates**

#### **Before Moving to Next Micro-Task:**
```
CHECKLIST (ALL MUST PASS):
□ Code compiles without TypeScript errors
□ No ESLint warnings or errors
□ Browser loads without console errors
□ Specific functionality tested and working
□ Changes committed to git
□ Documentation updated if needed
```

#### **Emergency Protocol**
```
IF ERRORS OCCUR DURING IMPLEMENTATION:
1. STOP immediately - do not add more code
2. Fix the current error completely
3. Test the fix works
4. Only then continue with implementation
5. Ask for guidance if error is unclear
```

### **Implementation Tracking**

#### **Use TodoWrite Tool for Every Feature:**
```
REQUIRED FOR ALL IMPLEMENTATIONS:
1. Create detailed micro-task todo list
2. Mark tasks "in_progress" when starting
3. Mark tasks "completed" only after testing
4. Never mark incomplete tasks as completed
5. Add new tasks if scope changes
```

#### **Communication Protocol**
```
AFTER EACH MICRO-TASK COMPLETION:
1. Brief summary of what was implemented
2. Any issues encountered and resolved
3. Current status of overall feature
4. Next planned micro-task
```

#### **Before Major Changes:**
```
ALWAYS ASK BEFORE:
- Modifying database schema
- Installing new dependencies
- Changing project structure
- Implementing security features
- Integrating external services
```

**CRITICAL REMINDER**: This methodology prevents 90% of implementation errors by catching issues early. NEVER skip these steps, even for "simple" changes. Small, tested steps lead to reliable, maintainable code.

---

# 📧 NEXT PRIORITY: AUTOMATED EMAIL INVOICE SYSTEM

## 🚨 **IMMEDIATE IMPLEMENTATION REQUIRED**

### **📋 Implementation Plan Available**
- **✅ COMPLETED**: Full research and architecture documented in `AUTOMATED_EMAIL_INVOICE_IMPLEMENTATION_PLAN.md`
- **✅ TECH STACK SELECTED**: 100% free, open-source solutions researched
- **✅ 4-WEEK TIMELINE**: Detailed implementation roadmap created

### **🎯 Priority Features to Implement**
1. **Monthly Billing Automation**: Auto-generate invoices on 1st of each month
2. **Welcome & Approval Emails**: "Thank you for signing up" + "Service approved"
3. **PDF Invoice Generation**: Professional branded invoices using React-PDF
4. **Email Templates**: React Email components for all notifications
5. **Payment Confirmations**: Automatic receipts via Ozow integration

### **🏆 Recommended Technology Stack**

#### **Email Service: Resend** (FREE: 3,000 emails/month)
```bash
npm install resend @react-email/components
```

#### **PDF Generation: React-PDF** (100% FREE)
```bash
npm install @react-pdf/renderer
```

#### **Task Scheduling: Node-Cron** (100% FREE)
```bash
npm install node-cron bull
```

#### **Email Templates: React Email** (100% FREE)
```bash
npm install @react-email/components
```

### **📅 Week 1 Implementation Plan**

#### **Day 1: Foundation Setup**
1. Install email service dependencies (Resend + React Email)
2. Configure environment variables
3. Create email service structure (`src/lib/email/`)

#### **Day 2-3: Email Templates**
1. Create welcome email template (React Email)
2. Create account approval template
3. Create invoice email template
4. Test template rendering

#### **Day 4-5: PDF Invoice Generation**
1. Set up React-PDF for invoice generation
2. Create professional invoice template
3. Test PDF generation with sample data

#### **Day 6-7: Integration & Testing**
1. Connect to existing billing system
2. Create API endpoints for email sending
3. Test complete email workflow

### **💰 Cost Benefits**
- **Month 1-12**: **$0** (using free tiers)
- **Growth Phase**: **$20-30/month** (for 2,000+ customers)
- **Enterprise Scale**: **Under $50/month** (for 10,000+ customers)

### **🔄 Integration Points with Existing System**
- **Database**: Extend existing Prisma schema with EmailLog, EmailTemplate models
- **BetterAuth**: Use existing user authentication for email personalization
- **Billing System**: Connect to existing Bill and Payment models
- **Ozow Integration**: Trigger emails on payment confirmations

### **📁 File Structure to Create**
```
src/lib/email/
├── providers/
│   ├── resend.ts           # Resend configuration
│   └── index.ts            # Provider abstraction
├── templates/
│   ├── welcome.tsx         # Welcome email template
│   ├── approval.tsx        # Account approval template
│   ├── invoice.tsx         # Invoice email template
│   └── index.ts            # Template exports
├── queue/
│   ├── emailQueue.ts       # Bull queue setup
│   └── processors.ts       # Email processing logic
└── service.ts              # Main email service
```

### **🚀 Action Items**
1. **Open the detailed plan**: Read `AUTOMATED_EMAIL_INVOICE_IMPLEMENTATION_PLAN.md`
2. **Start with Week 1, Day 1**: Install dependencies and configure Resend
3. **Follow micro-task methodology**: Break into small, testable steps
4. **Use TodoWrite tool**: Track progress for each implementation step

---

**💡 WHY THIS IS CRITICAL**: 
- Automated billing is essential for ISP business operations
- Professional invoices build customer trust and legal compliance
- Email automation reduces manual work and improves customer experience
- Early implementation allows testing with beta customers

**🎯 SUCCESS METRICS**:
- 95%+ email delivery rate
- <5 seconds invoice generation time
- Automated monthly billing cycle working
- Professional customer communications

---

# 📋 CURRENT PROJECT STATUS

## ✅ **COMPLETED SYSTEMS**
- **Authentication**: BetterAuth fully implemented and operational
- **Database**: Prisma schema with billing, payment, and user models
- **Website**: Fibre packages page with provider comparison system
- **API**: Package and provider management endpoints

## 🔄 **IN PROGRESS**
- **Documentation Reorganization**: Moving website details to nextjs.md
- **Email System Setup**: About to begin implementation

## ⏳ **NEXT IMPLEMENTATIONS**
1. **Email & PDF System** (Priority 1)
2. **Customer Dashboard** (Login forms + bills view)
3. **LTE-5G Page** (Following fibre page pattern)
4. **Admin Panel** (Package and user management)

## 🎯 **DEVELOPMENT FOCUS**
Following micro-task methodology for all implementations. Each task broken into small, testable steps with immediate validation.

**Current Working Directory**: `C:\Users\Admin\Desktop\starcast-nextjs`
**Server**: `npm run dev` on http://localhost:3000
**Database**: SQLite with Prisma Studio for management

---

**Note**: Always ask for clarification before implementing major changes. Complete one task fully before starting another. Update this documentation after successful implementations.