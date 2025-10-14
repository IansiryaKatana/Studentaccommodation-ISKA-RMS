import { ApiService } from './api';

export interface WordPressFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  message?: string;
  room_grade?: string;
  duration?: string;
  budget?: string;
}

export interface StudentBookingFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  birthday?: string;
  ethnicity: string;
  gender: string;
  ucas_id?: string;
  country: string;
  address_line1: string;
  post_code: string;
  town: string;
  academic_year: string;
  year_of_study: number;
  field_of_study: string;
  guarantor_name?: string;
  guarantor_email?: string;
  guarantor_phone?: string;
  guarantor_relationship?: string;
  wants_installments?: boolean;
  installment_plan_id?: string;
  deposit_paid?: boolean;
  studio_id: string;
  total_revenue: number;
  check_in_date: string;
  check_out_date: string;
  duration_name: string;
  duration_type: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  description: string;
  type: 'student_booking' | 'lead' | 'tourist_booking';
  status: 'active' | 'inactive' | 'testing';
  url: string;
  field_mappings: FieldMapping[];
  created_at: string;
  last_triggered?: string;
  trigger_count: number;
}

export interface FieldMapping {
  wpforms_field: string;
  system_field: string;
  css_class: string;
  required: boolean;
  field_type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'number';
}

export class WebhookService {
  /**
   * Process WordPress/Elementor form submission for leads
   * This endpoint should be called from WordPress when a form is submitted
   */
  static async processWordPressForm(formData: WordPressFormData) {
    try {
      console.log('Processing WordPress form data:', formData);

      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        throw new Error('First name and last name are required');
      }

      // Create lead using the API service
      const lead = await ApiService.createLeadFromWebhook(formData);

      console.log('Lead created successfully:', lead);

      return {
        success: true,
        message: 'Lead created successfully',
        leadId: lead.id,
        data: lead
      };
    } catch (error) {
      console.error('Error processing WordPress form:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error
      };
    }
  }

  /**
   * Process WordPress form submission for student bookings
   * This replicates the exact functionality of AddStudentBooking component
   */
  static async processStudentBookingForm(formData: StudentBookingFormData) {
    try {
      console.log('Processing student booking form data:', formData);

      // Validate required fields
      const requiredFields = [
        'first_name', 'last_name', 'email', 'mobile', 'ethnicity', 'gender',
        'country', 'address_line1', 'post_code', 'town', 'academic_year',
        'year_of_study', 'field_of_study', 'studio_id', 'total_revenue',
        'check_in_date', 'check_out_date', 'duration_name', 'duration_type'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof StudentBookingFormData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      // Check if student already exists
      const existingStudent = await ApiService.getStudentByEmail(formData.email);
      if (existingStudent) {
        throw new Error(`A student with email ${formData.email} already exists`);
      }

      // Create student profile (exactly like AddStudentBooking)
      const studentData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.mobile,
        birthday: formData.birthday,
        ethnicity: formData.ethnicity,
        gender: formData.gender,
        ucas_id: formData.ucas_id,
        country: formData.country,
        address_line1: formData.address_line1,
        post_code: formData.post_code,
        town: formData.town,
        academic_year: formData.academic_year,
        year_of_study: formData.year_of_study,
        field_of_study: formData.field_of_study,
        guarantor_name: formData.guarantor_name,
        guarantor_email: formData.guarantor_email,
        guarantor_phone: formData.guarantor_phone,
        guarantor_relationship: formData.guarantor_relationship,
        wants_installments: formData.wants_installments || false,
        installment_plan_id: formData.installment_plan_id,
        deposit_paid: formData.deposit_paid || false,
        studio_id: formData.studio_id,
        total_amount: formData.total_revenue,
        check_in_date: formData.check_in_date,
        duration_name: formData.duration_name,
        duration_type: formData.duration_type,
        // Initialize file upload reference fields
        passport_file_url: null,
        visa_file_url: null,
        utility_bill_file_url: null,
        guarantor_id_file_url: null,
        bank_statement_file_url: null,
        proof_of_income_file_url: null
      };

      const student = await ApiService.createStudent(studentData);
      console.log('Created student:', student);

      // Create reservation record (exactly like AddStudentBooking)
      let reservation = null;
      if (formData.studio_id && formData.check_in_date && formData.check_out_date) {
        try {
          const reservationData = {
            reservation_number: `STU-${Date.now()}`,
            type: 'student' as const,
            student_id: student.id,
            studio_id: formData.studio_id,
            duration_id: formData.duration_type,
            check_in_date: formData.check_in_date,
            check_out_date: formData.check_out_date,
            status: 'confirmed' as const,
            total_amount: formData.total_revenue,
            deposit_amount: 99,
            balance_due: formData.total_revenue - 99,
            notes: `Student booking for ${formData.first_name} ${formData.last_name}`,
            created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
          };

          reservation = await ApiService.createReservation(reservationData);
          console.log('Created reservation:', reservation);
        } catch (error) {
          console.error('Error creating reservation:', error);
          // Don't fail the entire process if reservation creation fails
        }
      }

      // Update studio status to occupied (exactly like AddStudentBooking)
      if (formData.studio_id) {
        try {
          await ApiService.updateStudioToOccupied(formData.studio_id);
          console.log('Studio status updated to occupied');
        } catch (error) {
          console.error('Error updating studio status:', error);
          // Don't fail the entire process if studio status update fails
        }
      }

      // Create invoices and installments using the create-student-invoices edge function
      // This replicates the exact same invoice creation logic as AddStudentBooking
      let invoiceResult = null;
      if (formData.total_revenue > 0) {
        try {
          const invoiceData = {
            studentId: student.id,
            totalAmount: formData.total_revenue,
            depositAmount: 99, // Default deposit amount
            installmentPlanId: formData.installment_plan_id,
            createdBy: '423b2f89-ed35-4537-866e-d4fe702e577c',
            depositPaid: formData.deposit_paid || false
          };

          // Call the create-student-invoices edge function
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase.functions.invoke('create-student-invoices', {
            body: invoiceData
          });

          if (error) {
            console.error('Error creating invoices:', error);
          } else {
            invoiceResult = data;
            console.log('Created invoices:', data);
          }
        } catch (error) {
          console.error('Error creating invoices:', error);
        }
      }

      console.log('Student booking created successfully');

      return {
        success: true,
        message: 'Student booking created successfully',
        studentId: student.id,
        reservationId: reservation?.id,
        invoiceResult,
        data: {
          student,
          reservation
        }
      };
    } catch (error) {
      console.error('Error processing student booking form:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error
      };
    }
  }

  /**
   * Test endpoint to simulate WordPress form submission
   * This can be used for testing the integration
   */
  static async testWordPressIntegration() {
    const testData: WordPressFormData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      message: 'Interested in booking a room for 2 weeks',
      room_grade: '770e8400-e29b-41d4-a716-446655440001', // This should be a valid room grade ID
      duration: '770e8400-e29b-41d4-a716-446655440001', // This should be a valid duration ID
      budget: '1500'
    };

    return await this.processWordPressForm(testData);
  }
}
