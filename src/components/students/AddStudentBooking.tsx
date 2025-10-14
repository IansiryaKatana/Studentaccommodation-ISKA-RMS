import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { PopoverClose } from '@radix-ui/react-popover';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Upload, Loader2, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import StudioSelect from '@/components/ui/studio-select';
import StudioOccupancyDialog from '@/components/ui/studio-occupancy-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAcademicYear } from '@/contexts/AcademicYearContext';

interface OptionField {
  id: string;
  field_name: string;
  field_type: string;
  field_label: string;
  options?: string[];
  is_active: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  step: number;
}

const AddStudentBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedAcademicYear } = useAcademicYear();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  // Birthday pickers (no calendar UX)
  const [birthdayYear, setBirthdayYear] = useState<string>('');
  const [birthdayMonth, setBirthdayMonth] = useState<string>('');
  const [birthdayDay, setBirthdayDay] = useState<string>('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isCheckingGuarantor, setIsCheckingGuarantor] = useState(false);
  const [guarantorExists, setGuarantorExists] = useState<boolean | null>(null);
  
  // Studio occupancy dialog state
  const [occupancyDialog, setOccupancyDialog] = useState({
    isOpen: false,
    studioNumber: '',
    occupantName: '',
    occupantEmail: '',
    reservationType: 'student' as 'student' | 'tourist',
    checkInDate: '',
    checkOutDate: ''
  });
  
  // Dynamic data from database
  const [studios, setStudios] = useState<any[]>([]);
  const [durations, setDurations] = useState<any[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);
  const [studentOptionFields, setStudentOptionFields] = useState<OptionField[]>([]);
  const [pricingMatrix, setPricingMatrix] = useState<any[]>([]);
  const [roomGrades, setRoomGrades] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    birthday: null as Date | null,
    ethnicity: '',
    gender: '',
    ucasId: '',
    country: '',
    
    // Contact Information
    email: '',
    mobile: '',
    addressLine1: '',
    postCode: '',
    town: '',
    
    // Academic Information
    academicYear: '2025/2026',
    yearOfStudy: '',
    fieldOfStudy: '',
    
    // Reservation Details
    studioId: '',
    roomGradeId: '',
    roomGradeName: '',
    checkin: null as Date | null,
    durationType: '',
    durationName: '',
    weeklyRate: 0,
    totalRevenue: 0,
    academicYearDisplay: '',
    assignedTo: '',
    
    // Payment Preferences
    wantsInstallments: false,
    installmentPlanId: '',
    depositPaid: false,
    
    // Guarantor Information
    guarantorName: '',
    guarantorEmail: '',
    guarantorPhone: '',
    guarantorRelationship: ''
  });

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<{
    passport?: File;
    visa?: File;
    utilityBill?: File;
    guarantorId?: File;
    bankStatement?: File;
    proofOfIncome?: File;
  }>({});

  const fileInputRefs = {
    passport: useRef<HTMLInputElement>(null),
    visa: useRef<HTMLInputElement>(null),
    utilityBill: useRef<HTMLInputElement>(null),
    guarantorId: useRef<HTMLInputElement>(null),
    bankStatement: useRef<HTMLInputElement>(null),
    proofOfIncome: useRef<HTMLInputElement>(null)
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsDataLoading(true);
        const [studiosData, durationsData, installmentPlansData, optionFieldsData, pricingMatrixData, roomGradesData] = await Promise.all([
          ApiService.getAvailableStudios(),
          ApiService.getDurations('student'),
          ApiService.getInstallmentPlans(),
          ApiService.getStudentOptionFields(),
          ApiService.getPricingMatrix(),
          ApiService.getRoomGrades()
        ]);
        
        setStudios(studiosData || []);
        setDurations(durationsData || []);
        setInstallmentPlans((installmentPlansData || []).filter(plan => plan.is_active));
        setStudentOptionFields(optionFieldsData || []);
        const countryField = (optionFieldsData || []).find((f: any) => f.field_name === 'country');
        if (countryField?.options && Array.isArray(countryField.options)) {
          setCountryOptions(countryField.options);
        }
        setPricingMatrix(pricingMatrixData || []);
        setRoomGrades(roomGradesData || []);
        
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchFormData();
  }, [toast]);

  // Initialize birthday dropdowns from existing value (if any)
  useEffect(() => {
    if (formData.birthday instanceof Date) {
      setBirthdayYear(String(formData.birthday.getFullYear()));
      setBirthdayMonth(String(formData.birthday.getMonth() + 1));
      setBirthdayDay(String(formData.birthday.getDate()));
    }
  }, []);

  // When dropdowns change, compute Date and update formData.birthday
  useEffect(() => {
    if (birthdayYear && birthdayMonth && birthdayDay) {
      const y = parseInt(birthdayYear, 10);
      const m = parseInt(birthdayMonth, 10);
      const d = parseInt(birthdayDay, 10);
      const maxDays = new Date(y, m, 0).getDate();
      if (d <= maxDays) {
        updateFormData('birthday', new Date(y, m - 1, d));
        return;
      }
    }
    // Incomplete or invalid selection clears birthday
    updateFormData('birthday', null);
  }, [birthdayYear, birthdayMonth, birthdayDay]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Handle studio selection - auto-populate room grade and weekly rate
      if (field === 'studioId' && value) {
        const studio = getStudioDetails(value);
        if (studio && studio.room_grade_id) {
          const roomGrade = getRoomGradeDetails(studio.room_grade_id);
          newData.roomGradeId = studio.room_grade_id;
          newData.roomGradeName = roomGrade ? roomGrade.name : '';
          
          // If duration is already selected, calculate weekly rate and total revenue
          if (newData.durationType) {
            const weeklyRate = getWeeklyRate(studio.room_grade_id, newData.durationType);
            newData.weeklyRate = weeklyRate;
            newData.totalRevenue = calculateTotalRevenue(weeklyRate, newData.durationType);
          }
        }
      }
      
      // Handle duration selection - auto-populate check-in date, academic year, and calculate revenue
      if (field === 'durationType' && value) {
        const duration = getDurationDetails(value);
        if (duration) {
          newData.durationName = duration.name;
          newData.checkin = new Date(duration.check_in_date);
          newData.academicYearDisplay = duration.academic_year;
          
          // If studio is already selected, calculate weekly rate and total revenue
          if (newData.roomGradeId) {
            const weeklyRate = getWeeklyRate(newData.roomGradeId, value);
            newData.weeklyRate = weeklyRate;
            newData.totalRevenue = calculateTotalRevenue(weeklyRate, value);
          }
        }
      }
      
      return newData;
    });
    
    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== field));

    // Live uniqueness checks
    if (field === 'email') {
      void checkStudentEmailUnique(value);
    }
    if (field === 'guarantorEmail') {
      void checkGuarantorEmailUnique(value);
    }
  };

  const checkStudentEmailUnique = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailExists(null);
      return;
    }
    try {
      setIsCheckingEmail(true);
      const count = await ApiService.countStudentsByEmail(email);
      setEmailExists(count > 0);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const checkGuarantorEmailUnique = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setGuarantorExists(null);
      return;
    }
    try {
      setIsCheckingGuarantor(true);
      const count = await ApiService.countStudentsByGuarantorEmail(email);
      setGuarantorExists(count > 0);
    } finally {
      setIsCheckingGuarantor(false);
    }
  };

  const validateStep = (step: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName?.trim()) {
          errors.push({ field: 'firstName', message: 'First name is required', step: 1 });
        }
        if (!formData.lastName?.trim()) {
          errors.push({ field: 'lastName', message: 'Last name is required', step: 1 });
        }
        if (!formData.email?.trim()) {
          errors.push({ field: 'email', message: 'Email is required', step: 1 });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.push({ field: 'email', message: 'Please enter a valid email address', step: 1 });
        }
        if (!formData.mobile?.trim()) {
          errors.push({ field: 'mobile', message: 'Mobile number is required', step: 1 });
        }
        if (!formData.birthday) {
          errors.push({ field: 'birthday', message: 'Date of birth is required', step: 1 });
        }
        if (!formData.ethnicity?.trim()) {
          errors.push({ field: 'ethnicity', message: 'Ethnicity is required', step: 1 });
        }
        if (!formData.gender?.trim()) {
          errors.push({ field: 'gender', message: 'Gender is required', step: 1 });
        }
        if (!formData.country?.trim()) {
          errors.push({ field: 'country', message: 'Country is required', step: 1 });
        }
        break;
        
      case 2: // Contact Information
        if (!formData.addressLine1?.trim()) {
          errors.push({ field: 'addressLine1', message: 'Address is required', step: 2 });
        }
        if (!formData.postCode?.trim()) {
          errors.push({ field: 'postCode', message: 'Post code is required', step: 2 });
        }
        if (!formData.town?.trim()) {
          errors.push({ field: 'town', message: 'Town is required', step: 2 });
        }
        break;
        
      case 3: // Academic Information
        if (!formData.yearOfStudy?.trim()) {
          errors.push({ field: 'yearOfStudy', message: 'Year of study is required', step: 3 });
        }
        if (!formData.fieldOfStudy?.trim()) {
          errors.push({ field: 'fieldOfStudy', message: 'Field of study is required', step: 3 });
        }
        break;
        
      case 4: // Reservation Details
        if (!formData.studioId?.trim()) {
          errors.push({ field: 'studioId', message: 'Studio selection is required', step: 4 });
        }
        if (!formData.durationType?.trim()) {
          errors.push({ field: 'durationType', message: 'Duration selection is required', step: 4 });
        }
        if (!formData.checkin) {
          errors.push({ field: 'checkin', message: 'Check-in date is required', step: 4 });
        }
        break;
        
      case 5: // Guarantor Information
        if (!formData.guarantorName?.trim()) {
          errors.push({ field: 'guarantorName', message: 'Guarantor name is required', step: 5 });
        }
        if (!formData.guarantorEmail?.trim()) {
          errors.push({ field: 'guarantorEmail', message: 'Guarantor email is required', step: 5 });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guarantorEmail)) {
          errors.push({ field: 'guarantorEmail', message: 'Please enter a valid guarantor email address', step: 5 });
        }
        if (!formData.guarantorPhone?.trim()) {
          errors.push({ field: 'guarantorPhone', message: 'Guarantor phone is required', step: 5 });
        }
        if (!formData.guarantorRelationship?.trim()) {
          errors.push({ field: 'guarantorRelationship', message: 'Guarantor relationship is required', step: 5 });
        }
        break;
        
      case 6: // Payment Preferences
        if (formData.wantsInstallments && !formData.installmentPlanId?.trim()) {
          errors.push({ field: 'installmentPlanId', message: 'Installment plan is required when installments are selected', step: 6 });
        }
        break;
    }
    
    return errors;
  };

  const validateAllSteps = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];
    for (let step = 1; step <= 6; step++) {
      const stepErrors = validateStep(step);
      allErrors.push(...stepErrors);
    }
    return allErrors;
  };

  const getFieldError = (fieldName: string): ValidationError | undefined => {
    return validationErrors.find(error => error.field === fieldName);
  };

  const isFieldValid = (fieldName: string): boolean => {
    return !validationErrors.some(error => error.field === fieldName);
  };

  const handleFileUpload = (fileType: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleFileRemove = (fileType: keyof typeof uploadedFiles) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileType];
      return newFiles;
    });
  };

  const handleFileInputChange = (fileType: keyof typeof uploadedFiles, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(fileType, file);
    }
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (stepErrors.length > 0) {
      setValidationErrors(prev => [...prev.filter(error => error.step !== currentStep), ...stepErrors]);
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields in step ${currentStep}.`,
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      // Clear validation errors for the current step when moving to next
      setValidationErrors(prev => prev.filter(error => error.step !== currentStep));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate all steps
    const allErrors = validateAllSteps();
    
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields. Found ${allErrors.length} error(s).`,
        variant: "destructive",
      });
      return;
    }

    // Check if studio is still available before proceeding
    if (formData.studioId) {
      try {
        const occupancyInfo = await ApiService.getStudioOccupancyInfo(formData.studioId);
        
        if (occupancyInfo?.currentReservation) {
          const reservation = occupancyInfo.currentReservation;
          const studentName = reservation.student
            ? `${reservation.student.user?.first_name || reservation.student.first_name || 'Student'} ${reservation.student.user?.last_name || reservation.student.last_name || ''}`.trim()
            : undefined;
          const touristName = reservation.tourist
            ? `${reservation.tourist.first_name} ${reservation.tourist.last_name}`
            : undefined;

          const occupantName = studentName || touristName || 'Unknown Guest';
          const occupantEmail = reservation.student
            ? (reservation.student.user?.email || reservation.student.email || '')
            : (reservation.tourist?.email || '');

          setOccupancyDialog({
            isOpen: true,
            studioNumber: occupancyInfo.studio.studio_number,
            occupantName,
            occupantEmail,
            reservationType: reservation.type,
            checkInDate: reservation.check_in_date,
            checkOutDate: reservation.check_out_date
          });
          return;
        }
      } catch (error) {
        console.error('Error checking studio occupancy:', error);
        // Continue with submission if we can't check occupancy
      }
    }

    try {
      setIsLoading(true);

      // Check if student already exists with this email
      const existingStudent = await ApiService.getStudentByEmail(formData.email);
      if (existingStudent) {
        toast({
          title: "Student Already Exists",
          description: `A student with email ${formData.email} already exists. Please use a different email or contact support.`,
          variant: "destructive",
        });
        return;
      }

      // Create student profile WITHOUT creating a user account
      const studentData = {
        // Personal information (also stored in students table for easy access)
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.mobile,
        birthday: formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : undefined,
        ethnicity: formData.ethnicity,
        gender: formData.gender,
        ucas_id: formData.ucasId,
        country: formData.country,
        address_line1: formData.addressLine1,
        post_code: formData.postCode,
        town: formData.town,
        academic_year: formData.academicYear,
        year_of_study: formData.yearOfStudy,
        field_of_study: formData.fieldOfStudy,
        guarantor_name: formData.guarantorName,
        guarantor_email: formData.guarantorEmail,
        guarantor_phone: formData.guarantorPhone,
        guarantor_relationship: formData.guarantorRelationship,
        wants_installments: formData.wantsInstallments,
        installment_plan_id: formData.wantsInstallments ? formData.installmentPlanId : undefined,
        deposit_paid: formData.depositPaid,
        studio_id: formData.studioId,
        total_amount: formData.totalRevenue, // Save the calculated total revenue
        check_in_date: formData.checkin ? format(formData.checkin, 'yyyy-MM-dd') : null,
        duration_name: formData.durationName,
        duration_type: formData.durationType,
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

      // Create reservation record for the student booking
      let reservation = null;
      if (formData.studioId && formData.checkin && formData.checkout) {
        try {
          const reservationData = {
            reservation_number: `STU-${Date.now()}`,
            type: 'student' as const,
            student_id: student.id,
            studio_id: formData.studioId,
            duration_id: formData.durationType,
            check_in_date: format(formData.checkin, 'yyyy-MM-dd'),
            check_out_date: format(formData.checkout, 'yyyy-MM-dd'),
            status: 'confirmed' as const,
            total_amount: formData.totalRevenue,
            deposit_amount: 99,
            balance_due: formData.totalRevenue - 99,
            notes: `Student booking for ${formData.firstName} ${formData.lastName}`,
            created_by: '423b2f89-ed35-4537-866e-d4fe702e577c', // Admin user ID
            academic_year: selectedAcademicYear // Use current academic year from context
          };

          reservation = await ApiService.createReservation(reservationData);
          console.log('Created reservation:', reservation);
        } catch (error) {
          console.error('Error creating reservation:', error);
          // Don't fail the entire process if reservation creation fails
          toast({
            title: "Warning",
            description: "Student created but reservation may not have been created properly. Please check the reservation manually.",
            variant: "destructive",
          });
        }
      }

      // Update studio status to occupied
      if (formData.studioId) {
        try {
          await ApiService.updateStudioToOccupied(formData.studioId);
          console.log('Studio status updated to occupied');
          
          // Dispatch event to notify other modules (Studios List, Overview, etc.)
          window.dispatchEvent(new CustomEvent('studioStatusUpdated', {
            detail: {
              studioId: formData.studioId,
              newStatus: 'occupied',
              reason: 'student_assigned'
            }
          }));
          
          console.log('📡 Dispatched studioStatusUpdated event');
        } catch (error) {
          console.error('Error updating studio status:', error);
          // Don't fail the entire process if studio status update fails
          toast({
            title: "Warning",
            description: "Student created but studio status may not have been updated. Please check the studio status manually.",
            variant: "destructive",
          });
        }
      }

      // Upload files if any and update student record with file URLs
      const uploadPromises = [];
      const documentTypes = {
        passport: 'passport' as const,
        visa: 'visa' as const,
        utilityBill: 'utility_bill' as const,
        guarantorId: 'guarantor_id' as const,
        bankStatement: 'bank_statement' as const,
        proofOfIncome: 'proof_of_income' as const
      };

      const fileUrlUpdates: any = {};

      for (const [fileKey, file] of Object.entries(uploadedFiles)) {
        if (file) {
          const documentType = documentTypes[fileKey as keyof typeof documentTypes];
          
          // Upload file to Supabase storage
          const fileName = `${student.id}/${documentType}/${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('student-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error(`Error uploading ${documentType} file:`, uploadError);
            // Continue with other files
            continue;
          }

          // Get the public URL for the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('student-documents')
            .getPublicUrl(fileName);

          // Store the URL for updating the student record
          const fieldName = `${documentType}_file_url`;
          fileUrlUpdates[fieldName] = publicUrl;

          uploadPromises.push(
            ApiService.createStudentDocument({
              student_id: student.id,
              document_type: documentType,
              file_url: publicUrl,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              uploaded_at: new Date().toISOString()
            })
          );
        }
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Update student record with file URLs if any files were uploaded
      if (Object.keys(fileUrlUpdates).length > 0) {
        await ApiService.updateStudent(student.id, fileUrlUpdates);
        console.log('Updated student record with file URLs:', fileUrlUpdates);
      }

      // Update student record with installment plan information
      const studentUpdateData = {
        wants_installments: formData.wantsInstallments,
        installment_plan_id: formData.wantsInstallments ? formData.installmentPlanId : undefined,
        deposit_paid: formData.depositPaid
      };

      await ApiService.updateStudent(student.id, studentUpdateData);
      console.log('Updated student with installment plan data');

      // Create financial records (invoices and installments) for the student
      const selectedDuration = durations.find(d => d.id === formData.durationType);
      if (selectedDuration) {
        // Use the calculated total revenue from the form
        const totalAmount = formData.totalRevenue;
        const depositAmount = 99; // £99 deposit

        try {
          console.log('Creating financial records for student:', {
            studentId: student.id,
            totalAmount,
            depositAmount,
            installmentPlanId: formData.wantsInstallments ? formData.installmentPlanId : undefined,
            depositPaid: formData.depositPaid
          });
          
          // Use the proper method to create student financial records
          await ApiService.createStudentFinancialRecordsDirect(student.id, {
            depositAmount: depositAmount,
            totalAmount: totalAmount,
            installmentPlanId: formData.wantsInstallments ? formData.installmentPlanId : undefined,
            durationId: formData.durationType || 'student', // Provide default if undefined
            createdBy: '423b2f89-ed35-4537-866e-d4fe702e577c', // Admin user ID
            depositPaid: formData.depositPaid,
            reservationId: reservation?.id // Pass reservation ID if created
          });
          
          console.log('Financial records created successfully');
        } catch (error) {
          console.error('Error creating financial records:', error);
          // Don't fail the entire process if financial records creation fails
          toast({
            title: "Warning",
            description: "Student created but financial records may not have been created properly. Please check the Finance module.",
            variant: "destructive",
          });
        }
      }

      // Create initial cleaning task for the student's studio
      if (formData.studioId && formData.checkin) {
        try {
          const taskData = {
            studio_id: formData.studioId,
            scheduled_date: format(formData.checkin, 'yyyy-MM-dd'),
            scheduled_time: '09:00', // Default time
            estimated_duration: 120, // 2 hours default
            status: 'scheduled' as const,
            notes: `Initial cleaning for student: ${formData.firstName} ${formData.lastName} (${student.id})`,
            created_by: '423b2f89-ed35-4537-866e-d4fe702e577c' // Admin user ID
          };
          console.log('Creating cleaning task:', taskData);
          await ApiService.createCleaningTask(taskData);
          console.log('Cleaning task created successfully');
        } catch (error) {
          console.error('Error creating cleaning task:', error);
          // Don't fail the entire process if cleaning task creation fails
        }
      }
      
      toast({
        title: "Success",
        description: "Student booking created successfully!",
      });
      
      console.log('Navigating to students page to check if student appears...');
      navigate('/students/list');
      
    } catch (error) {
      console.error('Error creating student booking:', error);
      toast({
        title: "Error",
        description: "Failed to create student booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionField = (fieldType: string) => {
    return studentOptionFields.find(field => field.field_type === fieldType);
  };

  const getStudioDetails = (studioId: string) => {
    return studios.find(studio => studio.id === studioId);
  };

  const getRoomGradeDetails = (roomGradeId: string) => {
    return roomGrades.find(grade => grade.id === roomGradeId);
  };

  const getDurationDetails = (durationId: string) => {
    return durations.find(duration => duration.id === durationId);
  };

  const getWeeklyRate = (roomGradeId: string, durationId: string) => {
    const pricing = pricingMatrix.find(p => 
      p.room_grade_id === roomGradeId && p.duration_id === durationId
    );
    return pricing?.weekly_rate_override || getRoomGradeDetails(roomGradeId)?.weekly_rate || 0;
  };

  const calculateTotalRevenue = (weeklyRate: number, durationId: string) => {
    const duration = getDurationDetails(durationId);
    return weeklyRate * (duration?.weeks_count || 0);
  };

  const renderFieldWithValidation = (
    fieldName: string,
    label: string,
    children: React.ReactNode,
    required: boolean = true
  ) => {
    const error = getFieldError(fieldName);
    const isValid = isFieldValid(fieldName);
    
      return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
          {label}
        </Label>
        <div className={`relative ${error ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
          {children}
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error.message}
          </p>
        )}
        </div>
      );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFieldWithValidation('firstName', 'First Name', (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              ))}
              
              {renderFieldWithValidation('lastName', 'Last Name', (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              ))}
            </div>
            
            {renderFieldWithValidation('email', 'Email Address', (
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter email address"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  {isCheckingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : emailExists === true ? (
                    <span className="text-red-600">Email exists</span>
                  ) : emailExists === false ? (
                    <span className="text-green-600">Available</span>
                  ) : null}
                </div>
              </div>
            ))}

            {renderFieldWithValidation('mobile', 'Mobile Number', (
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => updateFormData('mobile', e.target.value)}
                placeholder="Enter mobile number"
              />
            ))}

            {renderFieldWithValidation('birthday', 'Date of Birth', (
              <div className="grid grid-cols-3 gap-2">
                <Select value={birthdayDay} onValueChange={(v) => setBirthdayDay(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: (birthdayYear && birthdayMonth) ? new Date(parseInt(birthdayYear,10), parseInt(birthdayMonth,10), 0).getDate() : 31 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={birthdayMonth} onValueChange={(v) => setBirthdayMonth(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'January','February','March','April','May','June','July','August','September','October','November','December'
                    ].map((name, idx) => (
                      <SelectItem key={name} value={String(idx + 1)}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={birthdayYear} onValueChange={(v) => setBirthdayYear(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFieldWithValidation('ethnicity', 'Ethnicity', (
                <Select onValueChange={(value) => updateFormData('ethnicity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              ))}
              
              {renderFieldWithValidation('gender', 'Gender', (
                <Select onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              ))}
            </div>

            {renderFieldWithValidation('ucasId', 'UCAS ID', (
                <Input
                  id="ucasId"
                  value={formData.ucasId}
                  onChange={(e) => updateFormData('ucasId', e.target.value)}
                placeholder="Enter UCAS ID (optional)"
              />
            ), false)}

              {renderFieldWithValidation('country', 'Country', (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {formData.country || 'Select country'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[320px]">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {(countryOptions || []).map((country) => (
                            <CommandItem
                              key={country}
                              value={country}
                              onSelect={() => updateFormData('country', country)}
                            >
                              <PopoverClose className="w-full text-left">
                                {country}
                              </PopoverClose>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {renderFieldWithValidation('addressLine1', 'Address Line 1', (
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => updateFormData('addressLine1', e.target.value)}
                placeholder="Enter address"
              />
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFieldWithValidation('postCode', 'Post Code', (
                <Input
                  id="postCode"
                  value={formData.postCode}
                  onChange={(e) => updateFormData('postCode', e.target.value)}
                  placeholder="Enter post code"
                />
              ))}
              
              {renderFieldWithValidation('town', 'Town/City', (
                <Input
                  id="town"
                  value={formData.town}
                  onChange={(e) => updateFormData('town', e.target.value)}
                  placeholder="Enter town or city"
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFieldWithValidation('yearOfStudy', 'Year of Study', (
                <Select onValueChange={(value) => updateFormData('yearOfStudy', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select year of study" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4+">4th Year+</SelectItem>
                </SelectContent>
              </Select>
              ))}
              
              {renderFieldWithValidation('fieldOfStudy', 'Field of Study', (
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
                  placeholder="Enter field of study"
                />
              ))}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Academic Year</h4>
              <p className="text-blue-700">{formData.academicYear}</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {renderFieldWithValidation('studioId', 'Select Studio', (
              <StudioSelect
                value={formData.studioId}
                onChange={(value) => updateFormData('studioId', value)}
                placeholder="Choose a studio"
                isDisabled={isDataLoading}
                error={!!getFieldError('studioId')}
                showOccupied={true}
              />
            ))}

            {renderFieldWithValidation('durationType', 'Select Duration', (
              <Select onValueChange={(value) => updateFormData('durationType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.id} value={duration.id}>
                      {duration.name} ({duration.weeks_count} weeks)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {formData.checkin && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Check-in Date</h4>
                <p className="text-green-700">{format(formData.checkin, 'PPP')}</p>
              </div>
            )}

            {formData.weeklyRate > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Information</h4>
                <div className="space-y-1 text-blue-700">
                  <p>Weekly Rate: £{formData.weeklyRate}</p>
                  <p>Total Revenue: £{formData.totalRevenue}</p>
              </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {renderFieldWithValidation('guarantorName', 'Guarantor Name', (
              <Input
                id="guarantorName"
                value={formData.guarantorName}
                onChange={(e) => updateFormData('guarantorName', e.target.value)}
                placeholder="Enter guarantor's full name"
              />
            ))}

            {renderFieldWithValidation('guarantorEmail', 'Guarantor Email', (
              <div className="relative">
                <Input
                  id="guarantorEmail"
                  type="email"
                  value={formData.guarantorEmail}
                  onChange={(e) => updateFormData('guarantorEmail', e.target.value)}
                  placeholder="Enter guarantor's email address"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  {isCheckingGuarantor ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : guarantorExists === true ? (
                    <span className="text-red-600">Email in use</span>
                  ) : guarantorExists === false ? (
                    <span className="text-green-600">Available</span>
                  ) : null}
                </div>
              </div>
            ))}

            {renderFieldWithValidation('guarantorPhone', 'Guarantor Phone', (
              <Input
                id="guarantorPhone"
                value={formData.guarantorPhone}
                onChange={(e) => updateFormData('guarantorPhone', e.target.value)}
                placeholder="Enter guarantor's phone number"
              />
            ))}

            {renderFieldWithValidation('guarantorRelationship', 'Relationship to Student', (
              <Select onValueChange={(value) => updateFormData('guarantorRelationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            ))}
            </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wantsInstallments"
                checked={formData.wantsInstallments}
                onCheckedChange={(checked) => updateFormData('wantsInstallments', checked)}
              />
              <Label htmlFor="wantsInstallments">I want to pay in installments</Label>
                      </div>

            {formData.wantsInstallments && (
              renderFieldWithValidation('installmentPlanId', 'Select Installment Plan', (
                <Select onValueChange={(value) => updateFormData('installmentPlanId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose installment plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {installmentPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.number_of_installments} installments
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="depositPaid"
                checked={formData.depositPaid}
                onCheckedChange={(checked) => updateFormData('depositPaid', checked)}
              />
              <Label htmlFor="depositPaid">Deposit has been paid</Label>
                      </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Document Upload</h4>
              <p className="text-yellow-700 mb-4">Please upload the following documents:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  passport: 'Passport',
                  visa: 'Visa',
                  utilityBill: 'Utility Bill',
                  guarantorId: 'Guarantor ID',
                  bankStatement: 'Bank Statement',
                  proofOfIncome: 'Proof of Income'
                }).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                  type="file"
                      ref={fileInputRefs[key as keyof typeof fileInputRefs]}
                      onChange={(e) => handleFileInputChange(key as keyof typeof uploadedFiles, e)}
                      className="cursor-pointer"
                    />
                    {uploadedFiles[key as keyof typeof uploadedFiles] && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <span>✓ {uploadedFiles[key as keyof typeof uploadedFiles]?.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                          onClick={() => handleFileRemove(key as keyof typeof uploadedFiles)}
                      >
                          <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { title: 'Personal Information', description: 'Basic personal details' },
    { title: 'Contact Information', description: 'Address and contact details' },
    { title: 'Academic Information', description: 'Study details' },
    { title: 'Reservation Details', description: 'Studio and duration selection' },
    { title: 'Guarantor Information', description: 'Guarantor details' },
    { title: 'Payment & Documents', description: 'Payment preferences and document upload' }
  ];

  if (isDataLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Progress Steps Skeleton */}
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              {step < 6 && <Skeleton className="h-1 w-16 ml-4" />}
            </div>
          ))}
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
          <div className="mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Student Booking</h1>
          <p className="text-gray-600 mt-1">Create a new student reservation</p>
        </div>
          </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
              {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index + 1 === currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : index + 1 < currentStep 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-500'
              }`}>
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
                </div>
              ))}
            </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>

      {/* Form Content */}
          <Card>
        <CardContent className="p-6">
              {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Booking...
                      </>
                    ) : (
                'Create Booking'
                    )}
                  </Button>
                )}
              </div>
        </div>

      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-900 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Step {error.step}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Studio Occupancy Dialog */}
      <StudioOccupancyDialog
        isOpen={occupancyDialog.isOpen}
        onClose={() => setOccupancyDialog(prev => ({ ...prev, isOpen: false }))}
        studioNumber={occupancyDialog.studioNumber}
        occupantName={occupancyDialog.occupantName}
        occupantEmail={occupancyDialog.occupantEmail}
        reservationType={occupancyDialog.reservationType}
        checkInDate={occupancyDialog.checkInDate}
        checkOutDate={occupancyDialog.checkOutDate}
      />
    </div>
  );
};

export default AddStudentBooking;
