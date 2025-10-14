# 🎓 Academic Year Complete Implementation Plan

## 🎯 GOAL
Complete academic year isolation where toggling academic years shows ONLY data from that year.

## 📊 TABLES THAT NEED ACADEMIC_YEAR FIELD

### ✅ ALREADY HAVE academic_year:
1. **students** - Has `academic_year` field
2. **durations** - Has `academic_year` field

### ❌ NEED academic_year ADDED:

#### **Core Booking/Financial Tables:**
1. **invoices** - Student invoices (linked to students)
2. **payments** - Payment records (linked to invoices)
3. **student_installments** - Payment plans (linked to students)
4. **reservations** - OTA bookings

#### **Lead Management:**
5. **leads** - Lead records
6. **callback_bookings** - Callback requests
7. **viewing_bookings** - Viewing bookings

#### **Studio Management:**
8. **studios** - Studio records (?)
   - **QUESTION:** Should studios have academic years, or should they be global?
   - Studios are physical spaces that exist across years
   - **RECOMMENDATION:** Studios should be GLOBAL (no academic year)

#### **Cleaning:**
9. **cleaning_tasks** - Cleaning schedules
   - **QUESTION:** Should cleaning be per academic year?
   - **RECOMMENDATION:** YES - cleaning tasks are tied to occupancy periods

#### **Maintenance:**
10. **maintenance_requests** - Maintenance requests
    - **RECOMMENDATION:** YES - maintenance is tied to students/periods

#### **Finance:**
11. **expenses** - Expense records
    - **RECOMMENDATION:** YES - expenses are period-based

## 🚫 TABLES THAT SHOULD **NOT** HAVE ACADEMIC_YEAR

### **Master Data (Global Across Years):**
1. **room_grades** - Room types (Bronze, Silver, Gold)
2. **pricing_matrix** - Pricing configurations
3. **installment_plans** - Payment plan templates
4. **studios** - Physical studio spaces
5. **users** - Staff/admin users
6. **maintenance_categories** - Category definitions
7. **lead_sources** - Lead source definitions
8. **branding** - System branding
9. **module_styles** - UI styles
10. **academic_years** - The academic years themselves

### **System Tables:**
- role_permissions
- module_access_config
- user_sessions
- email_templates
- email_campaigns

## 📋 IMPLEMENTATION CHECKLIST

### **Phase 1: Database Schema Updates**
- [ ] Add `academic_year` VARCHAR(50) to invoices
- [ ] Add `academic_year` VARCHAR(50) to payments
- [ ] Add `academic_year` VARCHAR(50) to student_installments
- [ ] Add `academic_year` VARCHAR(50) to reservations
- [ ] Add `academic_year` VARCHAR(50) to leads
- [ ] Add `academic_year` VARCHAR(50) to callback_bookings
- [ ] Add `academic_year` VARCHAR(50) to viewing_bookings
- [ ] Add `academic_year` VARCHAR(50) to cleaning_tasks
- [ ] Add `academic_year` VARCHAR(50) to maintenance_requests
- [ ] Add `academic_year` VARCHAR(50) to expenses

### **Phase 2: Migration Scripts**
- [ ] Migrate existing data to current academic year (2025/2026)
- [ ] Add NOT NULL constraints (after migration)
- [ ] Add indexes on academic_year columns for performance

### **Phase 3: API Layer Updates**
- [ ] Update all create/insert methods to auto-add academic_year from context
- [ ] Update all read/select methods to filter by academic_year from context
- [ ] Update TypeScript interfaces to include academic_year field

### **Phase 4: UI/UX Updates**
- [ ] Update all forms to auto-populate academic_year (hidden field)
- [ ] Update all list views to filter by selected academic_year
- [ ] Update dashboard stats to respect academic_year filter
- [ ] Add academic year display in record cards/tables

### **Phase 5: Context Integration**
- [ ] Enhance AcademicYearContext to provide auto-tagging
- [ ] Create HOC/hook for auto-filtering queries
- [ ] Update all module components to use academic year context

## 🎯 USER EXPERIENCE FLOW

### **Before:**
- User sees ALL students from ALL years mixed together
- No way to separate data by academic period

### **After:**
1. User selects **2024/2025** in dashboard
2. **Students Module:** Only shows students from 2024/2025
3. **Finance Module:** Only shows invoices/payments from 2024/2025
4. **Leads Module:** Only shows leads from 2024/2025
5. **User adds new student:** Automatically tagged as 2024/2025
6. **User switches to 2025/2026:** Sees completely different dataset

## ⚠️ IMPORTANT CONSIDERATIONS

### **Data Migration:**
- All existing records need academic year assigned
- Default: Assign all existing data to "2025/2026" (current year)
- Option: Allow bulk reassignment if needed

### **Performance:**
- Add indexes on `academic_year` columns
- Ensure queries are optimized with academic_year filter

### **Reporting:**
- Need "All Years" option for cross-year reports
- Dashboard stats should have toggle: Current Year vs All Years

### **Studio Management:**
- Studios are shared across years (same physical space)
- Studio occupancy is tracked via students (who have academic_year)
- Studio status (vacant/occupied) is year-independent

## 🔄 RECOMMENDED APPROACH

### **Option 1: Big Bang (Risky)**
- Add all fields at once
- Migrate all data at once
- Update all code at once
- **Risk:** High chance of breaking system

### **Option 2: Gradual Migration (Recommended)**
1. **Week 1:** Add fields with NULL allowed
2. **Week 2:** Migrate existing data
3. **Week 3:** Update create operations to auto-populate
4. **Week 4:** Update read operations to filter
5. **Week 5:** Make fields NOT NULL
6. **Week 6:** Testing and refinement

## ❓ QUESTIONS FOR YOU

1. **Should studios have academic years?**
   - My recommendation: NO (they're physical spaces)
   
2. **What about historical data?**
   - Assign all to 2025/2026? Or create 2024/2025 and migrate some?
   
3. **Should there be an "All Years" view?**
   - For reports/analytics across years?
   
4. **Maintenance categories, room grades, pricing?**
   - Should these be global or per-year?
   
5. **What happens to cross-year records?**
   - e.g., A student who spans 2024/2025 AND 2025/2026?

## 💡 MY RECOMMENDATION

Start with **CRITICAL tables only**:
1. **Students** (already done)
2. **Invoices** 
3. **Payments**
4. **Leads**

Then expand to:
5. **Cleaning tasks**
6. **Maintenance requests**
7. **Expenses**

Leave these GLOBAL:
- Studios
- Room grades
- Pricing
- Master data

This gives you 80% of the benefit with 20% of the risk.

What do you think?
