# Student Booking and Invoice Creation Workflow

## Current Authoritative Workflow (Saved)

### Backend: Edge Function `create-student-invoices`
- Inputs: `{ studentId, totalAmount, depositAmount, installmentPlanId?, durationId?, createdBy? }`
- Behavior:
  - Resolves `created_by` to a valid `users.id` if none provided
  - Inserts deposit invoice (invoices.student_id = student)
  - Inserts main invoice (invoices.student_id = student)
  - If plan present: upserts student_installments (unique by student_id+plan_id+number) and inserts an invoice per installment
  - Robust invoice numbering `INV-YYYY-####` with retry-per-insert to avoid unique conflicts
- Returns: `{ depositInvoice, mainInvoice, installmentInvoices, installments }`

### Frontend
- Booking form creates `students` row
- Requires plan when `wantsInstallments=true`
- Calls API → invokes Edge Function to persist deposit, main, installments + invoices
- `StudentInvoices` renders mini invoices using deposit + `student_installments`; dialog shows student name/email with fallbacks

### Schema & Policies
- `ALTER TABLE invoices ADD COLUMN student_id uuid REFERENCES students(id)`
- Enable RLS; add SELECT policies for `invoices` and `student_installments`
- Inserts are done by Edge Function (service role)

### Verification
- Booking with installments creates:
  - 1 deposit invoice + 1 main invoice in `invoices`
  - N `student_installments` rows
  - N installment invoices in `invoices`
- UI shows deposit + N installments with correct progress
