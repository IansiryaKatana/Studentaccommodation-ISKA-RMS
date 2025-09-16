
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import StudioSelect from '@/components/ui/studio-select';
import { Checkbox } from '@/components/ui/checkbox';
import { ApiService, StudentWithUser, Reservation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, FileText, Calendar, Building, CreditCard, Shield, Loader2, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface StudentProfileProps {
  studentId: string;
}

const StudentProfile = ({ studentId }: StudentProfileProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentWithUser | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [installmentPlans, setInstallmentPlans] = useState<any[]>([]);
  const [studentOptionFields, setStudentOptionFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Check if user can edit (staff roles can edit, students can only view)
  const canEdit = user?.role && ['admin', 'super_admin', 'salesperson', 'reservationist', 'operations_manager'].includes(user.role);

  // Helper function to get option field data
  const getOptionField = (fieldName: string) => {
    return studentOptionFields.find(field => field.field_name === fieldName);
  };

  // Helper function to map stored values to display values
  const mapStoredValueToDisplay = (fieldName: string, storedValue: string) => {
    const field = getOptionField(fieldName);
    if (!field?.options) return storedValue;
    
    // Handle specific mappings for fields where stored values don't match display values
    const mappings: Record<string, Record<string, string>> = {
      gender: {
        'male': 'Male',
        'female': 'Female',
        'other': 'Other',
        'prefer_not_to_say': 'Prefer Not to Say',
        'non-binary': 'Non-binary'
      },
      ethnicity: {
        'white': 'White',
        'black': 'Black / African / Caribbean',
        'asian': 'Asian',
        'mixed': 'Mixed / Multiple Ethnicities',
        'other': 'Other',
        'prefer_not_to_say': 'Prefer Not to Say',
        'hispanic': 'Hispanic / Latino',
        'middle_eastern': 'Middle Eastern',
        'native_american': 'Native American / Alaska Native',
        'pacific_islander': 'Pacific Islander / Native Hawaiian'
      },
      year_of_study: {
        '1st': 'First Year',
        '2nd': 'Second Year',
        '3rd': 'Third Year',
        '4th': 'Fourth Year',
        '4+': 'Fourth Year',
        'masters': 'Masters',
        'postgraduate': 'Postgraduate'
      }
    };
    
    // Check if there's a specific mapping for this field and value
    if (mappings[fieldName] && mappings[fieldName][storedValue]) {
      return mappings[fieldName][storedValue];
    }
    
    // If no specific mapping, return the stored value as-is
    return storedValue;
  };

  // Helper function to map display values back to stored values
  const mapDisplayValueToStored = (fieldName: string, displayValue: string) => {
    // Handle specific mappings for fields where display values need to be converted back to stored format
    const reverseMappings: Record<string, Record<string, string>> = {
      gender: {
        'Male': 'male',
        'Female': 'female',
        'Other': 'other',
        'Prefer Not to Say': 'prefer_not_to_say',
        'Non-binary': 'non-binary'
      },
      ethnicity: {
        'White': 'white',
        'Black / African / Caribbean': 'black',
        'Asian': 'asian',
        'Mixed / Multiple Ethnicities': 'mixed',
        'Other': 'other',
        'Prefer Not to Say': 'prefer_not_to_say',
        'Hispanic / Latino': 'hispanic',
        'Middle Eastern': 'middle_eastern',
        'Native American / Alaska Native': 'native_american',
        'Pacific Islander / Native Hawaiian': 'pacific_islander'
      },
      year_of_study: {
        'First Year': '1st',
        'Second Year': '2nd',
        'Third Year': '3rd',
        'Fourth Year': '4th',
        'Masters': 'masters',
        'Postgraduate': 'postgraduate'
      },
      guarantor_relationship: {
        'Parent': 'parent',
        'Guardian': 'guardian',
        'Relative': 'relative',
        'Friend': 'friend',
        'Employer': 'employer',
        'Other': 'other'
      }
    };
    
    // Check if there's a specific reverse mapping for this field and value
    if (reverseMappings[fieldName] && reverseMappings[fieldName][displayValue]) {
      return reverseMappings[fieldName][displayValue];
    }
    
    // If no specific mapping, return the display value as-is
    return displayValue;
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      
      // Get student data with studio details and option fields
      const [studentData, optionFieldsData] = await Promise.all([
        ApiService.getStudentByIdWithDetails(studentId),
        ApiService.getStudentOptionFields()
      ]);
      
      setStudent(studentData);
      setStudentOptionFields(optionFieldsData || []);
      
      // Initialize form data after option fields are loaded
      const mapStoredValueToDisplayWithData = (fieldName: string, storedValue: string, optionFields: any[]) => {
        const field = optionFields.find(f => f.field_name === fieldName);
        if (!field?.options) return storedValue;
        
        // Handle specific mappings for fields where stored values don't match display values
        const mappings: Record<string, Record<string, string>> = {
          gender: {
            'male': 'Male',
            'female': 'Female',
            'other': 'Other',
            'prefer_not_to_say': 'Prefer Not to Say',
            'non-binary': 'Non-binary'
          },
          ethnicity: {
            'white': 'White',
            'black': 'Black / African / Caribbean',
            'asian': 'Asian',
            'mixed': 'Mixed / Multiple Ethnicities',
            'other': 'Other',
            'prefer_not_to_say': 'Prefer Not to Say',
            'hispanic': 'Hispanic / Latino',
            'middle_eastern': 'Middle Eastern',
            'native_american': 'Native American / Alaska Native',
            'pacific_islander': 'Pacific Islander / Native Hawaiian'
          },
          year_of_study: {
            '1st': 'First Year',
            '2nd': 'Second Year',
            '3rd': 'Third Year',
            '4th': 'Fourth Year',
            '4+': 'Fourth Year',
            'masters': 'Masters',
            'postgraduate': 'Postgraduate'
          },
          guarantor_relationship: {
            'parent': 'Parent',
            'guardian': 'Guardian',
            'relative': 'Relative',
            'friend': 'Friend',
            'employer': 'Employer',
            'other': 'Other'
          }
        };
        
        // Check if there's a specific mapping for this field and value
        if (mappings[fieldName] && mappings[fieldName][storedValue]) {
          return mappings[fieldName][storedValue];
        }
        
        // If no specific mapping, return the stored value as-is
        return storedValue;
      };

      setFormData({
        // Personal Information
        firstName: studentData.user?.first_name || studentData.first_name || '',
        lastName: studentData.user?.last_name || studentData.last_name || '',
        birthday: studentData.birthday || '',
        ethnicity: mapStoredValueToDisplayWithData('ethnicity', studentData.ethnicity || '', optionFieldsData || []),
        gender: mapStoredValueToDisplayWithData('gender', studentData.gender || '', optionFieldsData || []),
        ucasId: studentData.ucas_id || '',
        country: studentData.country || '',
        
        // Contact Information
        email: studentData.user?.email || studentData.email || '',
        mobile: studentData.user?.phone || studentData.phone || '',
        addressLine1: studentData.address_line1 || '',
        postCode: studentData.post_code || '',
        town: studentData.town || '',
        
        // Academic Information
        academicYear: studentData.academic_year || '2025/2026',
        yearOfStudy: mapStoredValueToDisplayWithData('year_of_study', studentData.year_of_study || '', optionFieldsData || []),
        fieldOfStudy: studentData.field_of_study || '',
        
        // Reservation Details
        studioId: studentData.studio_id || '',
        roomGradeId: studentData.studio?.room_grade?.id || '',
        roomGradeName: studentData.studio?.room_grade?.name || '',
        checkin: studentData.check_in_date || '',
        durationType: studentData.duration_type || '',
        durationName: studentData.duration_name || '',
        weeklyRate: studentData.studio?.room_grade?.weekly_rate || 0,
        totalRevenue: studentData.total_amount || 0,
        academicYearDisplay: studentData.academic_year || '',
        assignedTo: '', // Not available in current schema
        
        // Payment Preferences
        wantsInstallments: studentData.wants_installments || false,
        installmentPlanId: studentData.installment_plan_id || '',
        depositPaid: studentData.deposit_paid || false,
        
        // Guarantor Information
        guarantorName: studentData.guarantor_name || '',
        guarantorEmail: studentData.guarantor_email || '',
        guarantorPhone: studentData.guarantor_phone || '',
        guarantorRelationship: mapStoredValueToDisplayWithData('guarantor_relationship', studentData.guarantor_relationship || '', optionFieldsData || [])
      });
      
      // Get reservation data (may be null for direct bookings)
      try {
        const reservationData = await ApiService.getReservationByStudentId(studentId);
        setReservation(reservationData);
      } catch (error) {
        console.log('No reservation found for student (direct booking)');
        setReservation(null);
      }

      // Get installment plans for dropdown
      try {
        const plansData = await ApiService.getInstallmentPlans();
        setInstallmentPlans(plansData);
      } catch (error) {
        console.log('No installment plans found');
        setInstallmentPlans([]);
      }
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepare update data with proper validation and filtering
      const updateData: any = {};
      
      // Only include fields that have values and are not empty strings
      const fieldsToUpdate = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birthday: formData.birthday,
        ethnicity: mapDisplayValueToStored('ethnicity', formData.ethnicity),
        gender: mapDisplayValueToStored('gender', formData.gender),
        ucas_id: formData.ucasId,
        country: formData.country,
        email: formData.email,
        phone: formData.mobile,
        address_line1: formData.addressLine1,
        post_code: formData.postCode,
        town: formData.town,
        academic_year: formData.academicYear,
        year_of_study: mapDisplayValueToStored('year_of_study', formData.yearOfStudy),
        field_of_study: formData.fieldOfStudy,
        studio_id: formData.studioId,
        total_amount: formData.totalRevenue ? parseFloat(formData.totalRevenue) : undefined,
        wants_installments: formData.wantsInstallments,
        installment_plan_id: formData.installmentPlanId,
        deposit_paid: formData.depositPaid,
        guarantor_name: formData.guarantorName,
        guarantor_email: formData.guarantorEmail,
        guarantor_phone: formData.guarantorPhone,
        guarantor_relationship: mapDisplayValueToStored('guarantor_relationship', formData.guarantorRelationship)
      };
      
      // Filter out undefined, null, and empty string values
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          updateData[key] = value;
        }
      });
      
      console.log('Updating student with data:', updateData);
      
      // Update student data
      await ApiService.updateStudent(studentId, updateData);

      toast({
        title: "Success",
        description: "Student profile updated successfully.",
      });

      setIsEditing(false);
      fetchStudentData(); // Refresh data

    } catch (error) {
      console.error('Error updating student:', error);
      
      // Get more detailed error information
      let errorMessage = "Failed to update student profile. Please try again.";
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.details) {
          errorMessage = error.details;
        } else if (error.hint) {
          errorMessage = error.hint;
        } else if (error.code) {
          errorMessage = `Database error (${error.code}): ${error.message || 'Unknown error'}`;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600">View and manage student information</p>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.firstName || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.lastName || 'N/A'}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                {isEditing ? (
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.birthday ? format(new Date(formData.birthday), 'MMM dd, yyyy') : 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ethnicity">Ethnicity</Label>
                {isEditing ? (
                  <Select value={formData.ethnicity} onValueChange={(value) => setFormData({ ...formData, ethnicity: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptionField('ethnicity')?.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{formData.ethnicity || 'N/A'}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptionField('gender')?.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{formData.gender || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ucasId">UCAS ID</Label>
                {isEditing ? (
                  <Input
                    id="ucasId"
                    value={formData.ucasId}
                    onChange={(e) => setFormData({ ...formData, ucasId: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.ucasId || 'N/A'}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
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
                          {getOptionField('country')?.options?.map((country: string) => (
                            <CommandItem
                              key={country}
                              value={country}
                              onSelect={() => setFormData({ ...formData, country: country })}
                            >
                              <PopoverClose className="w-full text-left">
                                {country}
                              </PopoverClose>
                            </CommandItem>
                          )) || (
                            <CommandItem value="No countries available">
                              No countries available
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <p className="text-sm py-2">{formData.country || 'N/A'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.email || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                {isEditing ? (
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.mobile || 'N/A'}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="addressLine1">Address</Label>
              {isEditing ? (
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{formData.addressLine1 || 'N/A'}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postCode">Post Code</Label>
                {isEditing ? (
                  <Input
                    id="postCode"
                    value={formData.postCode}
                    onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.postCode || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="town">Town</Label>
                {isEditing ? (
                  <Input
                    id="town"
                    value={formData.town}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.town || 'N/A'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                {isEditing ? (
                  <Select value={formData.academicYear} onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptionField('academic_year')?.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="2025/2026">2025/2026</SelectItem>
                          <SelectItem value="2026/2027">2026/2027</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{formData.academicYear || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="yearOfStudy">Year of Study</Label>
                {isEditing ? (
                  <Select value={formData.yearOfStudy} onValueChange={(value) => setFormData({ ...formData, yearOfStudy: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year of study" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptionField('year_of_study')?.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4+">4+ Years</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{formData.yearOfStudy || 'N/A'}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              {isEditing ? (
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{formData.fieldOfStudy || 'N/A'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Reservation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studioId">Studio</Label>
                {isEditing ? (
                  <StudioSelect
                    value={formData.studioId}
                    onChange={(value) => setFormData({ ...formData, studioId: value })}
                    placeholder="Select a studio"
                    showOccupied={true}
                  />
                ) : (
                  <p className="text-sm py-2">
                    {student?.studio?.studio_number ? `Studio ${student.studio.studio_number}` : 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="roomGradeName">Room Grade</Label>
                {isEditing ? (
                  <Input
                    id="roomGradeName"
                    value={formData.roomGradeName}
                    onChange={(e) => setFormData({ ...formData, roomGradeName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.roomGradeName || 'N/A'}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkin">Check-in Date</Label>
                {isEditing ? (
                  <Input
                    id="checkin"
                    type="date"
                    value={formData.checkin}
                    onChange={(e) => setFormData({ ...formData, checkin: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.checkin ? format(new Date(formData.checkin), 'MMM dd, yyyy') : 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="durationName">Duration</Label>
                {isEditing ? (
                  <Input
                    id="durationName"
                    value={formData.durationName}
                    onChange={(e) => setFormData({ ...formData, durationName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.durationName || 'N/A'}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weeklyRate">Weekly Rate</Label>
                {isEditing ? (
                  <Input
                    id="weeklyRate"
                    type="number"
                    value={formData.weeklyRate}
                    onChange={(e) => setFormData({ ...formData, weeklyRate: parseFloat(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-sm py-2">£{formData.weeklyRate || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="totalRevenue">Total Revenue</Label>
                {isEditing ? (
                  <Input
                    id="totalRevenue"
                    type="number"
                    value={formData.totalRevenue}
                    onChange={(e) => setFormData({ ...formData, totalRevenue: parseFloat(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-sm py-2">£{formData.totalRevenue || 'N/A'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Checkbox
                  id="wantsInstallments"
                  checked={formData.wantsInstallments}
                  onCheckedChange={(checked) => setFormData({ ...formData, wantsInstallments: checked as boolean })}
                />
              ) : (
                <div className={`w-4 h-4 rounded ${formData.wantsInstallments ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
              <Label htmlFor="wantsInstallments">Wants Installments</Label>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Checkbox
                  id="depositPaid"
                  checked={formData.depositPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, depositPaid: checked as boolean })}
                />
              ) : (
                <div className={`w-4 h-4 rounded ${formData.depositPaid ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
              <Label htmlFor="depositPaid">Deposit Paid</Label>
            </div>
            <div>
              <Label htmlFor="installmentPlanId">Installment Plan</Label>
              {isEditing ? (
                <Select
                  value={formData.installmentPlanId}
                  onValueChange={(value) => setFormData({ ...formData, installmentPlanId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select installment plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {installmentPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.installment_count} installments
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm py-2">
                  {formData.installmentPlanId 
                    ? installmentPlans.find(plan => plan.id === formData.installmentPlanId)?.name || `Plan ${formData.installmentPlanId}`
                    : 'N/A'
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guarantor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Guarantor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guarantorName">Guarantor Name</Label>
                {isEditing ? (
                  <Input
                    id="guarantorName"
                    value={formData.guarantorName}
                    onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.guarantorName || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="guarantorEmail">Guarantor Email</Label>
                {isEditing ? (
                  <Input
                    id="guarantorEmail"
                    type="email"
                    value={formData.guarantorEmail}
                    onChange={(e) => setFormData({ ...formData, guarantorEmail: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.guarantorEmail || 'N/A'}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guarantorPhone">Guarantor Phone</Label>
                {isEditing ? (
                  <Input
                    id="guarantorPhone"
                    value={formData.guarantorPhone}
                    onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm py-2">{formData.guarantorPhone || 'N/A'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="guarantorRelationship">Relationship</Label>
                {isEditing ? (
                  <Select value={formData.guarantorRelationship} onValueChange={(value) => setFormData({ ...formData, guarantorRelationship: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptionField('guarantor_relationship')?.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      )) || (
                        <>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{formData.guarantorRelationship || 'N/A'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
