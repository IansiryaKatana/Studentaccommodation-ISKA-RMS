# 🎓 Complete Academic Year Isolation + Rebooking System

## 🎯 YOUR VISION UNDERSTOOD

### **Current System Analysis:**
- ✅ **Deposit Amount:** Fixed at **£99** (hardcoded in multiple places)
- ✅ **Studio Status:** When student assigned → studio becomes "occupied"
- ✅ **Student Portal:** Has 6 pages (Overview, Payments, Profile, Documents, Maintenance, Agreements)
- ✅ **Academic Year Context:** Already implemented and working

### **Your Requirements:**
1. **Complete Academic Year Isolation** - Toggle academic year shows ONLY that year's data
2. **Studio Status by Academic Year** - Studio occupied for 2024/2025, vacant for 2025/2026
3. **Rebooking System** - Students can rebook for next academic year with deposit payment
4. **All existing data** → Assign to "2025/2026"
5. **Fast implementation** - Add all fields and migrate everything now

## 📊 IMPLEMENTATION BREAKDOWN

### **Phase 1: Database Schema Updates (CRITICAL TABLES)**

#### **Tables that NEED academic_year field:**
```sql
-- Core booking/financial tables
ALTER TABLE invoices ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE payments ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE student_installments ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE reservations ADD COLUMN academic_year VARCHAR(50);

-- Lead management
ALTER TABLE leads ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE callback_bookings ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE viewing_bookings ADD COLUMN academic_year VARCHAR(50);

-- Operations
ALTER TABLE cleaning_tasks ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE maintenance_requests ADD COLUMN academic_year VARCHAR(50);
ALTER TABLE expenses ADD COLUMN academic_year VARCHAR(50);
```

#### **Tables that DON'T need academic_year (Global):**
- ✅ `studios` - Physical spaces (global)
- ✅ `room_grades` - Room types (global)
- ✅ `pricing_matrix` - Pricing configs (global)
- ✅ `installment_plans` - Payment templates (global)
- ✅ `users` - Staff/admin (global)
- ✅ `maintenance_categories` - Category definitions (global)
- ✅ `lead_sources` - Source definitions (global)

### **Phase 2: Studio Status by Academic Year**

#### **Current Problem:**
- Studio status is GLOBAL (occupied/vacant)
- When student assigned → studio becomes "occupied" forever

#### **Solution: Studio Occupancy by Academic Year**
```sql
-- New table to track studio occupancy per academic year
CREATE TABLE studio_occupancy (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  studio_id UUID REFERENCES studios(id),
  academic_year VARCHAR(50) NOT NULL,
  student_id UUID REFERENCES students(id),
  status VARCHAR(20) DEFAULT 'occupied', -- occupied, vacant, maintenance
  check_in_date DATE,
  check_out_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(studio_id, academic_year) -- One student per studio per year
);
```

#### **Studio Status Logic:**
- **Studio List View:** Show status for CURRENT academic year
- **Studio Assignment:** Check if studio is available for SELECTED academic year
- **Rebooking:** Student can rebook same studio for NEXT academic year

### **Phase 3: Rebooking System**

#### **New Student Portal Page: "Rebooking"**
```
/student-portal/[student-id]/rebooking
```

#### **Rebooking Flow:**
1. **Student clicks "Rebook for Next Year"**
2. **System checks:**
   - Is student currently in a studio?
   - What's the next academic year?
   - Is the same studio available for next year?
3. **Rebooking Dialog shows:**
   - Current studio (if available) or studio selection
   - Duration options for next academic year
   - Installment plan selection
   - **Deposit amount: £99** (same as current system)
4. **Stripe Payment Integration:**
   - Use existing Stripe setup
   - Process £99 deposit payment
   - Create new student record for next academic year
   - Create new invoices/installments
   - Update studio occupancy for next year

#### **Rebooking Data Structure:**
```typescript
interface RebookingRecord {
  id: string;
  original_student_id: string; // Link to current student
  new_student_id: string; // New student record for next year
  current_academic_year: string; // 2024/2025
  new_academic_year: string; // 2025/2026
  studio_id: string;
  duration_id: string;
  installment_plan_id?: string;
  deposit_amount: number; // £99
  deposit_paid: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
```

### **Phase 4: API Layer Updates**

#### **Auto-Populate Academic Year:**
```typescript
// All create methods auto-add academic_year from context
static async createStudent(data: CreateStudentData): Promise<Student> {
  const { selectedAcademicYear } = useAcademicYear();
  const studentData = {
    ...data,
    academic_year: selectedAcademicYear !== 'all' ? selectedAcademicYear : '2025/2026'
  };
  // ... rest of method
}
```

#### **Auto-Filter by Academic Year:**
```typescript
// All read methods filter by academic_year from context
static async getStudents(): Promise<Student[]> {
  const { selectedAcademicYear } = useAcademicYear();
  let query = supabase.from('students').select('*');
  
  if (selectedAcademicYear !== 'all') {
    query = query.eq('academic_year', selectedAcademicYear);
  }
  
  const { data, error } = await query;
  return data || [];
}
```

### **Phase 5: UI/UX Updates**

#### **Dashboard Stats:**
- All counters respect academic year filter
- "All Years" toggle for cross-year reporting

#### **Studio Management:**
- Studio list shows occupancy for CURRENT academic year
- Studio assignment checks availability for SELECTED academic year
- Visual indicators: 🟢 Available, 🔴 Occupied, 🟡 Maintenance

#### **Student Portal - New Rebooking Page:**
```typescript
const StudentRebooking = ({ studentId }: { studentId: string }) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [nextAcademicYear, setNextAcademicYear] = useState<string>('');
  const [availableStudios, setAvailableStudios] = useState<Studio[]>([]);
  const [rebookingData, setRebookingData] = useState<RebookingFormData>({});
  
  // Check if student can rebook
  const canRebook = currentStudent?.studio_id && 
                   currentStudent?.academic_year !== getLatestAcademicYear();
  
  // Show rebooking dialog with Stripe payment
  const handleRebook = async () => {
    // Process £99 deposit payment
    // Create new student record for next year
    // Update studio occupancy
  };
  
  return (
    <div className="space-y-6">
      <h1>Rebook for Next Academic Year</h1>
      
      {canRebook ? (
        <RebookingDialog 
          student={currentStudent}
          nextYear={nextAcademicYear}
          onRebook={handleRebook}
        />
      ) : (
        <div className="text-center py-8">
          <p>You are not eligible to rebook at this time.</p>
        </div>
      )}
    </div>
  );
};
```

## 🚀 IMPLEMENTATION ORDER

### **Step 1: Database Schema (30 minutes)**
1. Add `academic_year` columns to all required tables
2. Create `studio_occupancy` table
3. Create `rebooking_records` table
4. Migrate existing data to "2025/2026"

### **Step 2: API Layer (45 minutes)**
1. Update all TypeScript interfaces
2. Update all create methods to auto-populate academic_year
3. Update all read methods to filter by academic_year
4. Add rebooking API methods

### **Step 3: Studio Management (30 minutes)**
1. Update studio list to show current year occupancy
2. Update studio assignment to check year availability
3. Add studio occupancy management

### **Step 4: Student Portal Rebooking (60 minutes)**
1. Create new rebooking page
2. Add rebooking dialog with Stripe integration
3. Update student portal navigation
4. Add rebooking status tracking

### **Step 5: UI Context Integration (30 minutes)**
1. Update all components to use academic year context
2. Add "All Years" toggle for reporting
3. Update dashboard stats

### **Step 6: Testing & Refinement (30 minutes)**
1. Test academic year switching
2. Test rebooking flow
3. Test studio occupancy logic
4. Fix any issues

## 💰 DEPOSIT AMOUNT CONFIRMATION

**Current System:** £99 deposit (hardcoded in multiple places)
- `AddStudentBooking.tsx`: `const depositAmount = 99;`
- `webhookService.ts`: `depositAmount: 99`
- `BulkUploadStudents.tsx`: `const depositAmount = 99;`

**Rebooking System:** Same £99 deposit for consistency

## ❓ QUESTIONS FOR CONFIRMATION

1. **Deposit Amount:** Confirm £99 for rebooking deposits?
2. **Studio Rebooking:** Can student rebook the SAME studio for next year?
3. **Rebooking Eligibility:** Any restrictions (e.g., must be current student, no outstanding payments)?
4. **Cross-Year Students:** What if student wants to stay for 2+ academic years?
5. **Rebooking Deadline:** Any deadline for rebooking (e.g., before current year ends)?

## 🎯 EXPECTED OUTCOME

After implementation:
1. **Toggle 2024/2025:** See only 2024/2025 students, invoices, leads, etc.
2. **Toggle 2025/2026:** See only 2025/2026 data
3. **Studio Status:** Studio 101 occupied in 2024/2025, vacant in 2025/2026
4. **Student Portal:** New "Rebooking" page with £99 deposit payment
5. **All Years View:** Toggle to see cross-year reports

**Ready to proceed with implementation?** 🚀
