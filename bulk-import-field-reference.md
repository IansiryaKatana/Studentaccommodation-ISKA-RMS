# Bulk Student Import CSV Field Reference

## Required Fields
- `first_name` - Student's first name
- `last_name` - Student's last name  
- `email` - Student's email address
- `studio_id` - UUID of the assigned studio
- `duration_id` - UUID of the duration/booking period
- `check_in_date` - Check-in date (YYYY-MM-DD format)
- `check_out_date` - Check-out date (YYYY-MM-DD format)

## Optional Personal Information
- `phone` - Student's phone number
- `birthday` - Date of birth (YYYY-MM-DD format)
- `ethnicity` - Student's ethnicity
- `gender` - Gender (Male, Female, Other, Prefer not to say)
- `ucas_id` - UCAS application ID
- `country` - Country of origin
- `address_line1` - Address line 1
- `post_code` - Postal/ZIP code
- `town` - City/Town
- `student_id` - Internal student ID

## Academic Information
- `academic_year` - Academic year (e.g., 2024-2025)
- `year_of_study` - Year of study (1st, 2nd, 3rd, 4th, 5th, Postgraduate)
- `field_of_study` - Field of study
- `university` - University name
- `course` - Course/Program name

## Emergency Contact
- `emergency_contact_name` - Emergency contact name
- `emergency_contact_phone` - Emergency contact phone

## Guarantor Information
- `guarantor_name` - Guarantor's full name
- `guarantor_email` - Guarantor's email
- `guarantor_phone` - Guarantor's phone
- `guarantor_relationship` - Relationship to student (Father, Mother, Guardian, etc.)
- `guarantor_address` - Guarantor's address

## Financial Information
- `wants_installments` - Boolean (true/false)
- `installment_plan_id` - UUID of installment plan
- `deposit_paid` - Boolean (true/false)
- `total_amount` - Total booking amount

## Booking Details
- `duration_name` - Duration name (e.g., "51 Weeks")
- `duration_type` - Duration type (e.g., "student")
- `notes` - Additional notes

## Document URLs (All Optional)
- `passport_file_url` - URL to passport document
- `visa_file_url` - URL to visa document
- `utility_bill_file_url` - URL to utility bill document
- `guarantor_id_file_url` - URL to guarantor ID document
- `bank_statement_file_url` - URL to bank statement document
- `proof_of_income_file_url` - URL to proof of income document

## Field Options Reference

### Gender Options:
- Male
- Female
- Other
- Prefer not to say

### Year of Study Options:
- 1st
- 2nd
- 3rd
- 4th
- 5th
- Postgraduate

### Guarantor Relationship Options:
- Father
- Mother
- Guardian
- Sibling
- Other

### Installment Plan Options (Use UUIDs):
- 3 Installments
- 4 Installments
- 10 Installments
- No Installments (leave empty)

### Studio Status Options:
- vacant
- occupied
- dirty
- cleaning
- maintenance

## Important Notes:
1. All UUIDs must be valid UUIDs from your database
2. Dates must be in YYYY-MM-DD format
3. Boolean values should be "true" or "false"
4. Document URLs should be accessible links to your storage
5. Leave optional fields empty if not applicable
6. Ensure all required fields are filled for each student
